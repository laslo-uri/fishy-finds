# Scalability Proof of Concept — §4.8

Assumptions used in this PoC:

- **100 million** registered users
- **1 million** reservations per month
- FishyFinds domain: offers (bungalow / boat / course), terms, reservations, feedback, complaints, loyalty

---

## 1. Database schema overview

Core relational groups (PostgreSQL today):

| Area | Main tables |
|------|-------------|
| Users | `users`, `Customer`, `Admin`, `Instructor`, owners, `AUTHORITY`, `user_authority` |
| Offers | `Offer`, `Bungalow`, `Boat`, `Course`, `Location`, `Engine`, `ImageItem`, additional services |
| Availability | `Term` (versioned), linked reservations |
| Bookings | `Reservation` (versioned), `CancelledReservation`, `BoatReservation` |
| Quality / admin | `UserFeedback`, `Complaint`, `VisitReport`, `AccountDeletionRequest` |
| Loyalty / penalties | `LoyaltyProgram`, `penal` |

Hot paths: term lookup → reservation insert/update → customer points/loyalty update.

---

## 2. Partitioning strategy

### By offer type
Logical or physical separation of offer-related and reservation-related data:

- Partition keys aligned with `OfferType`: `BUNGALOW`, `BOAT`, `COURSE`
- Reservation / term child partitions keyed by offer type (join via offer id ranges or denormalized `offer_type` column)

### By date
Time-based range partitions on reservation `startDate` (monthly or quarterly):

- Keeps “upcoming” and “history” queries on small partitions
- Enables dropping/archiving old partitions instead of huge deletes

Combined approach: **list (offer_type) + range (month)** composite partitioning on `Reservation` / `CancelledReservation` for the 1M reservations/month load.

---

## 3. Replication

- **Primary** for all writes (reservations, cancellations, admin decisions)
- **Streaming replicas** (read-only) for:
  - catalog browsing (`allBoats`, `allCourses`, `allBungalows`)
  - history and analytics
- Failover: promote a replica; application connection string via VIP / service discovery

At 100M users, separate replicas for authentication/profile reads vs offer catalog reduces contention with booking writes.

---

## 4. Caching

### Production direction
- Distributed cache (Redis) for offer lists, term availability windows, loyalty categories
- Short TTL on availability; invalidate on reservation/term write
- CDN for static images under `upload/` / offer image paths

### Micro demo in this codebase
Spring Cache is demonstrated on catalog list service methods (wired through the public REST catalog endpoints):

| Cache name | Service method | Typical HTTP surface |
|------------|----------------|----------------------|
| `allBungalows` | `BungalowService.findAll()` | `GET /api/allBungalows` |
| `allBoats` | `BoatService.findAll()` | `GET /api/allBoats` |
| `allCourses` | `CourseService.findAll()` | `GET /api/allCourses` |

`CacheConfig` registers these names on a `ConcurrentMapCacheManager` with `@EnableCaching`.

This in-process map is a **PoC only**; replace with Redis (or similar) for multi-instance deployments.

---

## 5. Five-year storage estimate

Assumptions (illustrative):

| Data | Rate / size | 5-year estimate |
|------|-------------|-----------------|
| Reservations | 1M / month × 60 months = 60M rows; ~1 KB/row average | ~60 GB |
| Cancelled + history indexes / overhead | ~0.5× reservation volume | ~30 GB |
| Users | 100M profiles × ~0.5 KB | ~50 GB |
| Offers + images metadata | smaller; images on object storage | DB ~5–10 GB; objects separate |
| Feedback / complaints / audits | lower volume | ~10 GB |
| Indexes + WAL + free space (~2×) | — | multiply active DB |

**Order-of-magnitude active DB:** ~200–300 GB relational + object store for images. With partitioning and archive of reservations older than N years, hot set stays much smaller.

---

## 6. Load balancer

```
                     +------------------+
 Clients / SPA  -->  | Load balancer    |  (TLS terminate, sticky optional)
                     | (nginx / cloud LB)|
                     +--------+---------+
                              |
            +-----------------+-----------------+
            |                 |                 |
       +----+----+       +----+----+       +----+----+
       | App n1  |       | App n2  |       | App n3  |
       | Spring  |       | Spring  |       | Spring  |
       +----+----+       +----+----+       +----+----+
            |                 |                 |
            +--------+--------+--------+--------+
                     |                 |
              +------v------+   +------v------+
              | Redis cache |   | Object store|
              +------+------+   +-------------+
                     |
        +------------+-------------+
        |                          |
   +----v-----+              +-----v-----+
   | Postgres |  replicate   | Postgres  |
   | PRIMARY  | -----------> | REPLICA(s)|
   +----------+              +-----------+
```

LB routes HTTP to stateless Spring Boot instances; sessions are JWT-based (`TokenUtils`), so sticky sessions are optional.

---

## 7. What to monitor

- **Booking latency** and error rate on `/makeReservation`, `/makeReservationAction`, `/cancelReservation`
- **Optimistic lock failures** (`OptimisticLockException` count) — spike means contention hotspots
- **Pessimistic lock timeouts** on `CustomerRepository.findByEmail`
- **DB**: primary CPU, connection pool saturation, replication lag, partition size growth
- **Cache**: hit ratio for `allBoats` / `allCourses` / `allBungalows`; eviction rate
- **LB**: 5xx rate, backend healthy hosts, p95/p99 latency
- **Disk**: reservation partition growth vs 5-year forecast
- **JVM**: heap, GC pauses under peak booking windows

---

## 8. ASCII architecture diagram

```
[Browser / Mobile]
        |
        v
[Load Balancer]
        |
   +----+----+----+
   v    v    v
[App] [App] [App] -----> [Mail service]
   |    |    |
   +----+----+----> [Spring Cache / Redis]
   |                (allBoats, allCourses, allBungalows)
   |
   +----> [PostgreSQL PRIMARY] --async--> [READ REPLICAS]
   |         | partitions: offer_type + month
   |
   +----> [Object storage: offer images]
```

This PoC shows how FishyFinds can grow from a single Spring Boot + PostgreSQL deployment toward partitioned data, read replicas, horizontal app scaling, and cache tiers while keeping the current domain model.
