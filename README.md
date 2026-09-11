# FishyFinds

Centralized fishing-tourism marketplace for booking **bungalows**, **boats**, and **instructor courses**. Built as the FTN ISA (Internet Software Architectures) 2021/22 team project — polished archive with full admin queues, occupancy calendar, and consistent Vue UI.

## Stack

- Java 11 target (runs on JDK 17+), Spring Boot 2.5.7
- Spring Data JPA, Spring Security (JWT), Spring Mail
- PostgreSQL (`fishyfinds_db`)
- Vue 2 + Vue Router (history mode) + Axios (static SPA under `src/main/resources/static`)
- OpenLayers maps, Chart.js reports, SweetAlert2

## Requirements

Official course specs (local copies under FTN course materials / team docs):

- `FishyFinds - ISA specifikacija.pdf` — per-student function split
- `Specifikacija projekta RA II ISA 2021-2022` — full §3.1–3.29 and grading

| Student | Roles | Focus |
|---------|-------|--------|
| Natalija Simin | Guest, Customer | Browse, register, reserve, cancel, ratings, penalties, complaints |
| Laslo Uri | Bungalow owner, Boat owner | Offer CRUD, maps, availability, business reports |
| David Jandrić | Instructor, Admin | Courses, loyalty, occupancy calendar, admin moderation |

### Requirements coverage (§3.x)

| Spec | Feature | Status |
|------|---------|--------|
| 3.1 | Guest browse bungalows / boats / courses | Done |
| 3.2 | Customer register + email activation | Done |
| 3.3 | Advertiser register + admin approval | Done (UI: `/admin/registrations`) |
| 3.4–3.10 | Profiles, catalogs, extras, maps | Done |
| 3.11 | Admin users, commission, income | Done (`/admin/directory`, `/admin-income`) |
| 3.12 | Customer reservation search + book | Done (`/make-reservation`) |
| 3.13–3.15 | Owner/instructor CRUD + terms/actions | Done |
| 3.16 | Owner books for client | Done (`Book for client`) |
| 3.17–3.19 | Cancel (≥3 days), histories, feedback | Done |
| 3.20–3.21 | Reviews + admin moderation | Done (`/admin/reviews`) |
| 3.22–3.23 | Visit reports + penalty proposals | Done (`/visit-report`, `/admin/penalties`) |
| 3.24 | Action subscriptions | Done (`/following`) |
| 3.25–3.26 | Complaints + admin reply emails | Done (`/admin/complaints`) |
| 3.27 | Account deletion requests | Done (`/admin/deletion-requests`) |
| 3.28 | Owner reports / charts | Done (`/owner-reports`) |
| 3.29 | Loyalty categories | Done (`/admin-loyalty`) |
| 4.4 | Concurrent access (optimistic + pessimistic) | Done — see `docs/concurrent-access/` (Students 1–3 PDFs) |
| 4.8 | Scalability PoC | Done — `docs/scalability/SCALABILITY_POC.md` + `@Cacheable` catalogs |

### Grade ladder (ISA scoring)

| Grade | Focus | Status |
|-------|-------|--------|
| 6 | Core functional (§3 except G7 epics) | Complete — terms/actions/edit/book-for-client for bungalow, boat, instructor |
| 7 | Maps, business charts, calendar unavailable, loyalty | Complete — OpenLayers on all offer types; `OfferUnavailability`; `/admin-loyalty` |
| 8 | Concurrent access writeups | Complete — `student1` / `student2` / `student3` PDFs under `docs/concurrent-access/` |
| 9 | DevOps + tests | Complete — GitHub Actions + Sonar; service tests for reservation, quick action, loyalty, penal approve |
| 10 | Scalability | Complete — PoC + Spring Cache on `/api/allBungalows`, `/api/allBoats`, `/api/allCourses` |

## Screenshots

Product UI screenshots live in [`docs/screenshots/`](docs/screenshots/). Capture them after a local run with:

```powershell
# With the app at http://localhost:8080 and signed in as each seed role
.\scripts\capture-screenshots.ps1
```

Expected files (run `.\scripts\capture-screenshots.ps1` while the app is up, then re-capture signed-in pages after logging in as each seed role):

| File | Screen |
|------|--------|
| `01-guest-home.png` | Guest homepage |
| `02-bungalows.png` | Bungalow catalog |
| `03-sign-in.png` | Sign in |
| `04-make-reservation.png` | Customer booking |
| `05-upcoming.png` | Upcoming reservations |
| `06-owner-bungalows.png` | Owner listings |
| `07-owner-calendar.png` | Occupancy calendar |
| `08-owner-reports.png` | Owner reports |
| `09-admin-home.png` | Admin dashboard |
| `10-admin-registrations.png` | Registration queue |
| `11-admin-complaints.png` | Complaints queue |
| `12-admin-income.png` | Admin income |

## Run locally

### Prerequisites

1. JDK **11+** (pom targets 11; JDK 17 works — set `JAVA_HOME` accordingly)
2. Maven Wrapper (`mvnw` / `mvnw.cmd`) or Maven 3.6+
3. PostgreSQL with database `fishyfinds_db` (start the Windows service if needed)

### Database

```sql
CREATE DATABASE fishyfinds_db;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE fishyfinds_db TO root;
```

Override credentials with env vars if needed: `DB_USERNAME`, `DB_PASSWORD`.

Schema is recreated on every boot (`spring.jpa.hibernate.ddl-auto=create-drop`) and seeded from `src/main/resources/data-postgres.sql`.

### Mail (optional)

Set `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` for activation and notification emails. Without them, mail sends may fail but the rest of the app still runs.

### Start

```bash
./mvnw spring-boot:run
```

Open [http://localhost:8080](http://localhost:8080).

### Tests

```bash
./mvnw test
```

Live role smoke (app must be running on `:8080`):

```powershell
.\scripts\full-smoke.ps1
.\scripts\capture-screenshots.ps1
```

## Seed users

All seeded accounts use demo password: **`password`** (also noted in `data-postgres.sql`).

| Email | Role |
|-------|------|
| `mail@mail.com` | Customer |
| `zokaMagic@mail.com` | Bungalow owner |
| `zokiSumi@mail.com` | Boat owner |
| `vesnaVuki@mail.com` | Instructor |
| `admin@admin.com` | Admin |
| `pending.owner@mail.com` | Pending bungalow owner (appears in `/admin/registrations`) |

## Main features by role

- **Guest:** browse bungalows / boats / courses, register, sign in
- **Customer:** search, reserve, cancel (≥ 3 days), history, follow actions, complaints, penalties, loyalty points on profile
- **Bungalow / boat owner:** manage offers, terms/actions, book for client, delete when free, calendar, reports, visit reports
- **Instructor:** manage courses, calendar, reports, visit reports
- **Admin:** registrations, complaints, reviews, deletion requests, penalty proposals, user/offer directory, loyalty, system cut / income, add admin

## Project layout

```
src/main/java/com/fishyfinds/isa/
  controllers/     REST API (offers, users, terms, admin…)
  service/         Business logic
  model/           JPA entities
  repository/      Spring Data
  security/        JWT filter
src/main/resources/static/   Vue SPA (kebab-case components)
docs/
  concurrent-access/   §4.4 writeups + Student 1–3 PDFs
  scalability/         §4.8 PoC
  screenshots/         UI captures from the current build
```

## Docs for higher grades

- **Technical dossier (EN + SR):** [`docs/dossier/`](docs/dossier/) — subject/project purpose, stack, architecture diagrams, annotated screenshots, summary; open `dossier.html` or the PDFs (`fishyfinds-dossier-en.pdf` / `-sr.pdf`). Rebuild with `python docs/build_dossier.py`.
- `docs/concurrent-access/` — §4.4 writeups:
  - `student1-client-concurrent-access.pdf`
  - `student2-owners-concurrent-access.pdf`
  - `student3-admin-instructor-concurrent-access.pdf`
- `docs/scalability/SCALABILITY_POC.md` — §4.8 PoC (partitioning, replicas, LB diagram, monitoring)
- Catalog caches: `GET /api/allBungalows`, `GET /api/allBoats`, `GET /api/allCourses` via `@Cacheable`

## CI

GitHub Actions builds on `main` / `master` / `develop` with Maven and SonarCloud (see `.github/workflows/`).

## License

Student project archive — FTN ISA 2021/22.
