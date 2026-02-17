# Story 2.3: Edit & Delete (IDOR Protection)

Status: done

## Story

As a user,
I want to update or remove my tasks,
so that my list stays accurate and I can manage my workload effectively.

## Acceptance Criteria

1. API endpoint `PATCH /api/tasks/[id]` implemented for updates.
2. API endpoint `DELETE /api/tasks/[id]` implemented for deletion.
3. **Strict IDOR Prevention:** Returns 403 Forbidden if a user attempts to modify/delete a task they do not own. (AC: #42)
4. Validation for update payload (partial updates allowed) using Zod.
5. Service methods `TaskService.updateTask(taskId, userId, data)` and `deleteTask(taskId, userId)` created.

## Tasks / Subtasks

- [x] Create Update Zod validation schema (AC: #4)
  - [x] Add `updateTaskSchema` to `src/lib/validations/task.ts`
- [x] Implement TaskService mutation logic (AC: #3, #5)
  - [x] Add `updateTask(id, userId, data)` with ownership check
  - [x] Add `deleteTask(id, userId)` with ownership check
- [x] Create Dynamic API Route for Task Mutations (AC: #1, #2, #3)
  - [x] Create `src/app/api/tasks/[id]/route.ts`
  - [x] Implement PATCH handler
  - [x] Implement DELETE handler
- [x] Write Unit Tests for Task Mutations (AC: #1-5)
  - [x] Test successful update/delete (Owner)
  - [x] Test IDOR prevention (Non-owner attempt)
  - [x] Test validation errors on update

## Dev Notes

- **Ownership Verification:** The Service Layer must fetch the task first and verify `task.userId === requester.userId` before performing the operation.
- **RESTful Design:** Use the dynamic [id] folder structure in Next.js.
- **Error Codes:** Return 403 Forbidden for ownership failures, 404 Not Found if task doesn't exist.

### Project Structure Notes

- `src/lib/validations/task.ts` (MODIFY)
- `src/lib/services/task-service.ts` (MODIFY)
- `src/app/api/tasks/[id]/route.ts` (NEW)

### References

- [Architecture Decision Document](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/architecture.md#Management%20Authorization%20Pattern)
- [Product Backlog](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/epics.md#User%20Story%202.3:%20Edit%20&%20Delete)

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet (Amelia)

### Completion Notes List

### File List
