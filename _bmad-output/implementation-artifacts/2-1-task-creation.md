# Story 2.1: Task Creation

Status: done

## Story

As a user,
I want to create a new task with a title and description,
so that I can keep track of my work and associate it with my account.

## Acceptance Criteria

1. Task model defined in Prisma with specific fields (title, description, status, userId).
2. Title validation (non-empty, max 100 characters) using Zod.
3. Task is automatically associated with the logged-in user (via JWT session).
4. Success response returns the created task data and 201 Created.
5. Error response (400) for validation failures.

## Tasks / Subtasks

- [x] Update Prisma Schema (AC: #1)
  - [x] Add `Task` model with `userId` relation to `User`
  - [x] Execute `npx prisma migrate dev`
- [x] Create Task Zod validation schema (AC: #2)
  - [x] Create `src/lib/validations/task.ts` with `createTaskSchema`
- [x] Implement TaskService logic (AC: #3)
  - [x] Create `src/lib/services/task-service.ts`
  - [x] Implement `createTask(data: CreateTaskInput, userId: number)`
- [x] Create API Route for Task Creation (AC: #3, #4)
  - [x] Create `src/app/api/tasks/route.ts`
  - [x] Implement POST handler (extract userId from session, call service)
- [x] Write Unit/Integration Tests (AC: #1-5)
  - [x] Test successful task creation
  - [x] Test validation failures (empty title)
  - [x] Test unauthorized creation (no session)

## Dev Notes

- **Ownership:** Ensure `userId` is passed from the session/middleware to the service. Never trust a `userId` sent in the request body.
- **Enums:** Use Prisma enums for task status (e.g., TODO, IN_PROGRESS, DONE).
- **Service Pattern:** API Route acts as a controller; all DB logic in `TaskService`.

### Project Structure Notes

- `src/lib/services/task-service.ts` (NEW)
- `src/app/api/tasks/route.ts` (NEW)
- `src/lib/validations/task.ts` (NEW)
- `prisma/schema.prisma` (MODIFY)

### References

- [Architecture Decision Document](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/architecture.md#Data%20Architecture)
- [Product Backlog](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/epics.md#Epic%202:%20Core%20Task%20Management%20(CRUD))

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet (Amelia)

### Completion Notes List

### File List
