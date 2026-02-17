# Story 2.2: Task Dashboard (List View)

Status: done

## Story

As a user,
I want to view a list of only my tasks on a dashboard,
so that I can see what I need to do and stay organized.

## Acceptance Criteria

1. API endpoint `GET /api/tasks` implemented to fetch tasks.
2. **Strict Authorization:** Only return tasks where `userId == current_user_id`. (AC: #36)
3. Supports optional filtering by status (TODO, IN_PROGRESS, DONE).
4. Supports basic sorting by `createdAt` (descending by default).
5. Service method `TaskService.getTasks(userId)` created.

## Tasks / Subtasks

- [x] Implement TaskService listing logic (AC: #2, #5)
  - [x] Add `getTasks(userId: number, filters: TaskFilters)` to `src/lib/services/task-service.ts`
- [x] Implement API Route for Task Listing (AC: #1, #2)
  - [x] Update `GET` handler in `src/app/api/tasks/route.ts`
  - [x] Extract filters from query parameters
- [x] Write Unit Tests for Task Listing (AC: #2, #3)
  - [x] Test fetching tasks for specific user
  - [x] Test filters (status)
  - [x] Test that user cannot see other users' tasks (Service level verification)

## Dev Notes

- **Security:** Ensure the query always includes `where: { userId }` to prevent data leaking between users.
- **Service Pattern:** Use the existing `TaskService` class. 
- **Types:** Define a `TaskFilters` type in the service or a shared types file if needed.

### Project Structure Notes

- `src/lib/services/task-service.ts` (MODIFY)
- `src/app/api/tasks/route.ts` (MODIFY)

### References

- [Architecture Decision Document](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/architecture.md#Authorization%20Pattern)
- [Product Backlog](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/epics.md#User%20Story%202.2:%20Task%20Dashboard)

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet (Amelia)

### Completion Notes List

### File List
