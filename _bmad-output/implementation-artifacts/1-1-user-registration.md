# Story 1.1: User Registration

Status: done

## Story

As a new user,
I want to create an account with an email and password,
so that I can start managing my personal tasks.

## Acceptance Criteria

1. Password must be hashed using Bcrypt.
2. Duplicate emails must be prevented (409 Conflict).
3. Validation for email format and password strength using Zod.
4. Success response returns user data (excluding password) and 201 Created.

## Tasks / Subtasks

- [x] Define User model in Prisma schema (AC: #1, #2)
  - [x] Add `email` (unique) and `password` fields
  - [x] Run `npx prisma migrate dev`
- [x] Create Zod validation schema (AC: #3)
  - [x] Define `registerSchema` in `src/lib/validations/auth.ts`
- [x] Implement AuthService registration logic (AC: #1, #2)
  - [x] Create `src/lib/services/auth-service.ts`
  - [x] Implement `registerUser` with password hashing (bcryptjs)
  - [x] Handle duplicate email errors
- [x] Create API Route for registration (AC: #3, #4)
  - [x] Create `src/app/api/auth/register/route.ts`
  - [x] Implement POST handler calling `AuthService`
- [x] Write Unit/Integration Tests (AC: #1-4)
  - [x] Test successful registration
  - [x] Test duplicate email failure
  - [x] Test validation failures

## Dev Notes

- **Architecture Pattern:** Strict Service Layer. The API route is only a controller; logic resides in `authService`.
- **Hashing:** Use `bcryptjs` (compatible with Next.js edge/serverless).
- **Security:** Ensure `password` is never returned in the API response or Service return value.

### Project Structure Notes

- `src/lib/services/auth-service.ts` (NEW)
- `src/app/api/auth/register/route.ts` (NEW)
- `src/lib/validations/auth.ts` (NEW)
- `prisma/schema.prisma` (MODIFY)

### References

- [Architecture Decision Document](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/architecture.md#Authentication%20&%20Security)
- [Project Plan](file:///c:/Users/ASUS/Desktop/task-management-system/PLAN.md#3.%20Security%20Considerations%20&%20Mitigation)

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet (Amelia)

### Completion Notes List

### File List
