# FishyFinds

Web app for booking bungalows, boats, and instructor-led fishing courses. Guests browse the catalog; customers reserve and cancel; owners and instructors manage offers; admins moderate the platform.

FTN ISA team project, 2021/22 (Natalija Simin, Laslo Uri, David Jandrić).

## Screenshots

![Homepage](docs/screenshots/01-guest-home.png)

![Bungalow catalog](docs/screenshots/02-bungalows.png)

![Upcoming reservations](docs/screenshots/05-upcoming.png)

![Owner listings](docs/screenshots/06-owner-bungalows.png)

![Admin dashboard](docs/screenshots/09-admin-home.png)

More captures: [`docs/screenshots/`](docs/screenshots/).

## Stack

- Java 11 (runs on JDK 17+), Spring Boot 2.5.7, Spring Data JPA, Spring Security (JWT)
- PostgreSQL (`fishyfinds_db`)
- Vue 2 + Vue Router (history mode) + Axios, served from `src/main/resources/static`
- OpenLayers, Chart.js, SweetAlert2

## Roles

| Person | Roles |
|--------|--------|
| Natalija Simin | Guest, customer |
| Laslo Uri | Bungalow owner, boat owner |
| David Jandrić | Instructor, admin |

- **Guest** — catalogs, register, sign in
- **Customer** — search, book, cancel (≥ 3 days), history, follow actions, complaints, penalties
- **Owner / instructor** — offer CRUD, terms, quick actions, book for a client, calendar, reports
- **Admin** — registrations, reviews, complaints, deletions, penalties, loyalty, income, user/offer directory

Spec coverage (§3.1–3.29), concurrency notes, and the scalability write-up are in [`docs/`](docs/).

## Run locally

Needs JDK 11+, Maven Wrapper, and PostgreSQL.

```sql
CREATE DATABASE fishyfinds_db;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE fishyfinds_db TO root;
```

Override DB credentials with `DB_USERNAME` / `DB_PASSWORD` if needed. Schema is rebuilt on each start (`create-drop`) from `src/main/resources/data-postgres.sql`.

Mail is optional (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`). The app still runs if SMTP is unset.

```bash
./mvnw spring-boot:run
```

Open [http://localhost:8080](http://localhost:8080).

```bash
./mvnw test
```

## Demo accounts

Password for every seed user: `password`

| Email | Role |
|-------|------|
| `mail@mail.com` | Customer |
| `zokaMagic@mail.com` | Bungalow owner |
| `zokiSumi@mail.com` | Boat owner |
| `vesnaVuki@mail.com` | Instructor |
| `admin@admin.com` | Admin |
| `pending.owner@mail.com` | Pending advertiser |

## Docs

- Technical dossier (EN / SR): [`docs/dossier/`](docs/dossier/) — `dossier.html` or the PDFs
- Concurrent access (§4.4): [`docs/concurrent-access/`](docs/concurrent-access/)
- Scalability PoC (§4.8): [`docs/scalability/SCALABILITY_POC.md`](docs/scalability/SCALABILITY_POC.md)

## Layout

```
src/main/java/com/fishyfinds/isa/
  controllers/   REST
  service/       business rules
  model/         JPA
  repository/    Spring Data
  security/      JWT
src/main/resources/static/   Vue SPA
docs/
```

CI runs Maven tests on `main` / `master` / `develop` (`.github/workflows/`).
