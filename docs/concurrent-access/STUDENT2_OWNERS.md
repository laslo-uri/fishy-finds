# Concurrent Database Access — Student 2 (Owners / Laslo)

Section 4.4 write-up for bungalow and boat owner conflict scenarios in FishyFinds.

Relevant code: `BungalowController`, `BoatController`, `TermController`, `TermService`, `ReservationService`, `Term` / `Reservation` (`@Version`), image save during `addNewBungalow` / `addNewBoat`.

---

## 1. Owner creates reservation while client books the same slot

### Situation
An owner defines or books a period on an offer (term / owner-side reservation) at the same time a customer calls `makeReservation` for an overlapping interval on the same term. Both can observe the slot as free and persist overlapping reservations.

### Endpoints / classes
- Customer: `ReservationController.makeReservation` → `ReservationService.makeReservation`
- Owner term setup: `TermController.addNewTermToOffer` → `TermService.addNewTermToOffer`
- Entities: `Term` (`@Version`), `Reservation` (`@Version`)

### Lock approach
**Optimistic locking** via `@Version` on `Term` when attaching reservations / updating availability, and on `Reservation` when creating/updating bookings. The second commit that updates the same term version fails.

### Why chosen
Owner and client paths converge on the same term entity. Optimistic locking fits interactive UI flows where conflicts are uncommon and holding a pessimistic lock across network latency would hurt responsiveness.

---

## 2. Owner defines an action while client reserves

### Situation
The owner creates a quick action (`ReservationType.QUICK`) on an offer while a customer simultaneously books a default reservation (or claims another action) that overlaps the same dates. Overlap can leave two active claims on the same capacity.

### Endpoints / classes
- Owner: `POST /api/createQuickAction` → `ReservationController.createQuickAction` → `ReservationService.createQuickAction` (creates `ReservationType.QUICK` with no customer yet; overlap check via `hasOverlappingActiveReservation`)
- Also: `ReservationService.getActionsForOffer`
- Customer: `makeReservation` / `makeReservationAction`
- Entity: `Reservation` with `@Version`

### Note on `createQuickAction`
`createQuickAction` is the concrete owner write path that races with client `makeReservation`: both can pass an overlap check on a stale snapshot and insert conflicting active rows. Optimistic `@Version` on `Reservation`/`Term` (and/or tightening the overlap check inside the same transaction) makes the losing writer fail instead of silently double-booking.

### Lock approach
**Optimistic locking** on `Reservation` (and `Term` when the action is linked into the term’s reservation list). Concurrent assignment of customer or insertion into the term’s reservation list triggers a version conflict for the loser.

### Why chosen
Actions are stored as reservation rows; versioning those rows matches the customer-side action race solution and keeps owner/client contention consistent.

---

## 3. Delete offer while it is reserved

### Situation
An owner deletes (or soft-deletes) a bungalow/boat offer that still has active upcoming reservations. Concurrent delete and booking can leave reservations pointing at a missing offer or allow new bookings after delete started.

### Endpoints / classes
- Offer management via `BungalowController` / `BoatController` / `OfferService`
- Active bookings via `ReservationService`
- Entities: `Offer` / `Bungalow` / `Boat`, `Reservation`

### Lock approach
Prefer a **business guard** (reject delete if active reservations exist) combined with **optimistic locking** on related `Reservation`/`Term` rows. If delete and book race, the transaction that still sees active reservations should abort the delete; booking against a deleted offer should fail FK / null offer checks.

### Why chosen
Deleting an offer is a rare, high-impact operation. Checking reservation state explicitly is clearer than relying only on locks; optimistic versions still protect concurrent reservation mutations during the check window.

---

## Extra conflict: concurrent `addNewBungalow` image save (or two owners editing the same offer)

### Situation A — concurrent image save
Two parallel `POST /api/addNewBungalow` (or image update) requests for the same owner flow save images through `ImageService.saveImage` with names derived from offer count (`bungalow_<n>_<i>_`). Concurrent saves can overwrite files or attach inconsistent `ImageItem` sets.

### Situation B — two owners editing the same offer
If two sessions load the same bungalow/boat and save edits, last-write-wins can drop one owner’s changes (description, price, capacity).

### Endpoints / classes
- `BungalowController.addNewBungalow` → `BungalowService.addNewBungalow`
- Analogous boat path: `BoatController` / `BoatService.addNewBoat`
- `ImageItem`, `ImageService`

### Lock approach
- For offer edits: add **`@Version` on `Offer`** (or rely on transactional read-modify-write with optimistic checks) so concurrent updates conflict.
- For image naming/save races: serialize image persistence per offer (short **pessimistic** or synchronized naming) or use unique generated filenames (UUID) to avoid collisions.

### Why chosen
File-system writes are not covered by JPA `@Version` alone. Unique names or a short critical section around `saveImage` prevent silent overwrites; `@Version` on the offer entity covers metadata races between two editors.

---

## Summary of locking used in this codebase

| Concern | Mechanism |
|--------|-----------|
| Term availability / reservation list | `@Version` on `Term` |
| Reservation / action assignment | `@Version` on `Reservation` |
| Customer penalty vs book (cross-entity) | Pessimistic `PESSIMISTIC_WRITE` on `CustomerRepository.findByEmail` |
| Offer create + images | App-level unique paths / transactional save (recommended hardening) |
