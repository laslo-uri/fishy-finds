# Concurrent Database Access — Student 1 (Customer / Natalija)

Section 4.4 write-up for customer-side conflict scenarios in FishyFinds.

Relevant code: `ReservationController`, `ReservationService`, `Term` (`@Version`), `Reservation` (`@Version`), `CustomerRepository` (pessimistic lock on `findByEmail`), `FeedbackService` / `FeedbackController`.

---

## 1. Double booking the same term

### Situation
Two customers try to book overlapping date ranges on the same available term (same offer slot) at the same time. Without concurrency control, both transactions can pass the `isFree` check and create two active reservations for the same period.

### Endpoints / classes
- `POST /api/makeReservation` → `ReservationController.makeReservation`
- `ReservationService.makeReservation` (`@Transactional`)
- Entity: `Term` with `@Version` and a list of reservations; `Reservation` persisted then attached via `updateTermsReservation`

### Lock approach
**Optimistic locking** via `@Version` on `Term`. When both transactions load the same term and both try to save an updated reservation list, the second commit fails with `OptimisticLockException` / version conflict.

### Why chosen
Term updates are relatively short and conflicts are infrequent compared to reads. Optimistic locking avoids holding row locks during the whole booking flow and only rejects the losing writer. Version-column comparison is simpler than comparing all entity fields.

---

## 2. Action (quick reservation) race

### Situation
Two customers claim the same predefined action (`ReservationType.QUICK`) in overlapping time. The last writer would otherwise overwrite customer assignment and leave inconsistent ownership of the action.

### Endpoints / classes
- `POST /api/makeReservationAction` → `ReservationController.makeReservationAction`
- `ReservationService.makeReservationAction` (`@Transactional`)
- Entity: `Reservation` with `@Version` (customer and status are updated on the existing row)

### Lock approach
**Optimistic locking** via `@Version` on `Reservation`. Concurrent updates to the same action row cause a version mismatch; only one customer successfully binds to the action.

### Why chosen
The conflict is on a single mutable reservation row (assign customer, set `ACTIVE`). A version counter on `Reservation` is the natural place for optimistic control without locking unrelated terms.

---

## 3. Cancel versus rebook

### Situation
A customer cancels a reservation while another flow (or the same customer after a cancelled-history check) tries to rebook the same offer/date window. Race between `cancelReservation` and `makeReservation` / `makeReservationAction` can allow booking a slot that was just cancelled incorrectly, or blocking a legitimate rebook via cancelled-history rules.

### Endpoints / classes
- `POST /api/cancelReservation` → `ReservationService.cancelReservation`
- `POST /api/makeReservation` / `makeReservationAction`
- Entities: `Reservation` (`@Version`), `CancelledReservation`; cancelled history checked in `makeReservation` / `makeReservationAction`

### Lock approach
**Optimistic locking** on `Reservation` (`@Version`) for status/customer changes. Cancellation sets `CANCELLED`, clears customer, and writes a `CancelledReservation` record. Booking paths re-read reservation/term state under `@Transactional` so a stale version fails the conflicting update.

### Why chosen
Cancel and book both mutate reservation state; optimistic versioning keeps the “who won” decision at commit time without long-held locks on customer sessions.

---

## Extra conflict: feedback submit while reservation cancelled

### Situation
A customer submits feedback for a past stay (`FeedbackService.addFeedback`) while another concurrent path cancels (or has already cancelled) that reservation. Feedback might be attached to a cancelled reservation, or `hasFeedback` might be set on a reservation that is no longer valid for review.

### Endpoints / classes
- Feedback submit: `FeedbackController` → `FeedbackService.addFeedback`
- Cancel: `ReservationController` → `ReservationService.cancelReservation`
- Entities: `UserFeedback`, `Reservation` (`@Version`, `hasFeedback`)

### Lock approach
**Optimistic locking** on `Reservation` when updating `hasFeedback`. Application should verify reservation status is still eligible (e.g. not `CANCELLED`) before saving feedback; a concurrent cancel increments version / changes status so the losing transaction fails or is rejected by business checks.

### Why chosen
Feedback and cancel touch the same reservation row; optimistic versioning matches the pattern already used for reservation mutations and avoids pessimistic locks for a rare edge case.

---

## Related: penalties versus reservation (pessimistic)

When checking whether a customer may book (`penalService.getPenalForUser` / customer load), `CustomerRepository.findByEmail` uses `@Lock(LockModeType.PESSIMISTIC_WRITE)` with lock timeout `0`. This prevents a concurrent penalty update and a concurrent booking from both proceeding when the customer would exceed the three-penalty limit. Pessimistic locking was chosen here because two different tables/entities (`Penal` and `Reservation`/`Term`) change together and a single `@Version` on one entity cannot cover the cross-table rule.
