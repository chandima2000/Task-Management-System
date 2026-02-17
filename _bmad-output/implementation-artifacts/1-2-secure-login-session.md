# Story 1.2: Secure Login & Session

Status: done

## Story

As a registered user,
I want to log in securely,
so that I can access my private dashboard and manage my tasks.

## Acceptance Criteria

1. Authenticate user by comparing email and password (using bcrypt).
2. Generate a secure JWT session token upon successful login using `jose`.
3. Store the JWT in a secure, `httpOnly`, `SameSite=Lax` cookie.
4. Implement a `middleware.ts` to protect dashboard routes and redirect unauthenticated users to `/login`.
5. Support a POST `/api/auth/logout` endpoint to clear the session cookie.

## Tasks / Subtasks

- [x] Create Login Zod validation schema (AC: #1)
  - [x] Update `src/lib/validations/auth.ts` with `loginSchema`
- [x] Implement AuthService login logic (AC: #1, #2)
  - [x] Add `loginUser` to `src/lib/services/auth-service.ts`
  - [x] Verify password using `bcrypt.compare`
  - [x] Implement JWT generation utility in `src/lib/auth.ts`
- [x] Create API Route for Login (AC: #2, #3)
  - [x] Create `src/app/api/auth/login/route.ts`
  - [x] Call `AuthService`, handle failures (401 Unauthorized)
  - [x] Set cookie using `cookies().set()`
- [x] Implement Protected Middleware (AC: #4)
  - [x] Create `src/middleware.ts`
  - [x] Logic to check for session cookie and verify JWT
  - [x] Path matching for `/dashboard/*` and `/api/tasks/*`
- [x] Implement Logout Endpoint (AC: #5)
  - [x] Create `src/app/api/auth/logout/route.ts`
  - [x] Clear the session cookie
- [x] Write Unit/Integration Tests (AC: #1-5)
  - [x] Test successful login & cookie setting
  - [x] Test invalid credentials (401)
  - [x] Test middleware redirection
  - [x] Test logout functionality

## Dev Notes

- **JWT Secrets:** Use `JWT_SECRET` from environment variables.
- **Security:** Ensure cookies are `Secure: true` in production and `httpOnly: true` always.
- **Middleware:** Use the `jose` library for JWT verification within Next.js middleware as it's compatible with the Edge runtime.

### Project Structure Notes

- `src/lib/auth.ts` (NEW) - JWT utilities
- `src/middleware.ts` (NEW) - Auth protection
- `src/app/api/auth/login/route.ts` (NEW)
- `src/app/api/auth/logout/route.ts` (NEW)
- `src/lib/services/auth-service.ts` (MODIFY)
- `src/lib/validations/auth.ts` (MODIFY)

### References

- [Architecture Decision Document](file:///c:/Users/ASUS/Desktop/task-management-system/_bmad-output/planning-artifacts/architecture.md#Authentication%20&%20Security)
- [Project Plan](file:///c:/Users/ASUS/Desktop/task-management-system/PLAN.md#3.%20Security%20Considerations%20&%20Mitigation)

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet (Amelia)

### Completion Notes List

### File List
