# Story 1.1: User Registration

Status: in-progress

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

- [ ] Define User model in Prisma schema (AC: #1, #2)
  - [ ] Add `email` (unique) and `password` fields
  - [ ] Run `npx prisma migrate dev`
- [ ] Create Zod validation schema (AC: #3)
  - [ ] Define `registerSchema` in `src/lib/validations/auth.ts`
- [ ] Implement AuthService registration logic (AC: #1, #2)
  - [ ] Create `src/lib/services/auth-service.ts`
  - [ ] Implement `registerUser` with password hashing (bcryptjs)
  - [ ] Handle duplicate email errors
- [ ] Create API Route for registration (AC: #3, #4)
  - [ ] Create `src/app/api/auth/register/route.ts`
  - [ ] Implement POST handler calling `AuthService`
- [ ] Write Unit/Integration Tests (AC: #1-4)
  - [ ] Test successful registration
  - [ ] Test duplicate email failure
  - [ ] Test validation failures

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
