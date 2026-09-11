# Concurrent Database Access — Student 3 (Admin / Instructor / Jandric)

Section 4.4 write-up for admin and instructor conflict scenarios in FishyFinds.

Relevant code: `ComplaintController`, `ComplaintService`, `AccountDeletionRequestController`, `AccountDeletionRequestService`, `LoyaltyProgramController`, `LoyaltyProgramService`, instructor reservation/action paths with `ReservationService` / `Term` `@Version`.

---

## 1. Two admins answering the same complaint

### Situation
Two administrators open the same pending complaint and both accept or deny it. Without concurrency control, both responses may be applied in sequence (double emails, flipped final status) or one silently overwrites the other.

### Endpoints / classes
- `GET /api/allPendingComplaints` → `ComplaintService.findAllPending`
- `POST /api/acceptComplaint` → `ComplaintService.acceptComplaint`
- `POST /api/denyComplaint` → `ComplaintService.denyComplaint`
- `ComplaintController`
- Entity: `Complaint` with `ComplaintStatus` (`PENDING` → `ACCEPTED` / `DECLINED`)

### Lock approach
**Optimistic status check**: load complaint, proceed only if status is still `PENDING`, then update. Optionally add `@Version` on `Complaint`. If the second admin commits after the first, the status is no longer `PENDING` and the second operation should return `false` / fail.

### Why chosen
Complaint resolution is a single-row status transition. Checking `PENDING` (and ideally a version column) is enough to ensure only one admin “wins” without locking the whole complaints table.

---

## 2. Two admins answering the same deletion request

### Situation
Two admins process the same account deletion (or creation approval) request concurrently—one accepts, one denies—or both accept. That can delete a user twice, send conflicting emails, or leave request status inconsistent.

### Endpoints / classes
- `AccountDeletionRequestService.updateRequest` (accept delete)
- `AccountDeletionRequestService.denyDeleteRequest`
- `approveCreationRequest` / `denyCreationRequest`
- Controller: `AccountDeletionRequestController`
- Entity: `AccountDeletionRequest` with `DeletionRequestStatus`

### Lock approach
**Optimistic / conditional update** on status: only transition from `PENDING` (or `PENDING_CREATION`) to a terminal state. Second admin finds non-pending status and aborts. Pessimistic lock on the request row is an alternative if delete + user removal must be strictly serialized.

### Why chosen
Status machine (`PENDING` → `ACCEPTED` / `DECLINED`) naturally serializes decisions. Matching the complaint pattern keeps admin flows consistent and avoids long locks during mail sending.

---

## 3. Instructor action versus client reserve

### Situation
An instructor defines a quick action or available term on a course while a client books overlapping capacity on the same offer. Same class of conflict as owner action vs client booking.

### Endpoints / classes
- Instructor: `POST /api/createQuickAction` → `ReservationController.createQuickAction` → `ReservationService.createQuickAction` (same QUICK-action path owners use)
- Instructor term setup → `TermService` / related reservation APIs
- Client: `ReservationController` → `ReservationService.makeReservation` / `makeReservationAction`
- Entities: `Term` (`@Version`), `Reservation` (`@Version`), course `Offer`

### Note on `createQuickAction`
Instructors share `createQuickAction` with owners: concurrent `createQuickAction` vs client `makeReservation` can both observe free capacity and commit overlapping ACTIVE reservations. Document this race explicitly and rely on `@Version` on `Reservation`/`Term` (plus transactional overlap checks) so only one writer succeeds.

### Lock approach
**Optimistic locking** via `@Version` on `Term` and `Reservation`, same as customer/owner booking races.

### Why chosen
Instructor and client both mutate shared term/reservation state; the existing version columns already encode the intended conflict detection without introducing instructor-specific locking.

---

## Extra conflict: two admins deleting the same loyalty category

### Situation
Two admins call delete on the same loyalty category at once (`deleteLoyaltyCategory`). One delete succeeds; the second may throw, or both may attempt to detach users still referencing the category.

### Endpoints / classes
- `POST /api/deleteLoyaltyCategory` → `LoyaltyProgramController.deleteLoyalty`
- `LoyaltyProgramService.deleteLoyalty`
- Related: `POST /api/addNewLoyaltyCategory` / `checkIfExists` uniqueness when creating categories
- Entity: `LoyaltyProgram`

### Lock approach
Load by id; if missing, no-op / return false. Prefer **optimistic delete** (delete only if row still exists) or a short **pessimistic write lock** on the loyalty row when reassigning users. Creation path already skips duplicates via `checkIfExists(categoryName)`.

### Why chosen
Deletes are idempotent if keyed by id: the second admin simply finds no entity. Guarding create with name uniqueness prevents two admins from inserting the same category name concurrently (last check-then-act race can still need a unique DB constraint).

---

## Summary

| Scenario | Primary classes | Recommended control |
|----------|-----------------|---------------------|
| Same complaint | `ComplaintController`, `ComplaintService` | Conditional status update / `@Version` |
| Same deletion request | `AccountDeletionRequestService` | Conditional status update |
| Instructor vs client book | `ReservationService`, `Term` | `@Version` optimistic |
| Same loyalty delete | `LoyaltyProgramController`, `LoyaltyProgramService` | Idempotent delete + unique category name |
