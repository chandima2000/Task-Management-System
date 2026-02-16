stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
project_name: 'Task-Management-System'
user_name: 'Chandima'
date: '2026-02-17'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Session Initialization

**Date:** 2026-02-17
**Architect:** Winston
**Context:** Creating a robust, scalable architecture for the Task Management System based on Phase 1 planning.

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Extracted from BACKLOG.md. The system must handle secure User Registration/Login (Epic 1), authenticated Task Management with strict resource ownership (Epic 2), and AI-driven task breakdown assistants (Epic 3).

**Non-Functional Requirements:**
Architecture must support high delivery velocity without sacrificing separation of concerns. Security is a primary driver, requiring parameterized queries, input sanitization, and mass assignment prevention.

**Scale & Complexity:**
The project is a professional-grade assessment application.
- Primary domain: Full-stack Web (Next.js)
- Complexity level: Medium
- Estimated architectural components: Auth Service, Task Service, AI Gateway, Prisma Data Layer.

### Technical Constraints & Dependencies
- **Stack:** Next.js (Strict constraint)
- **Database:** Prisma ORM
- **Intelligence:** Google ADK / GCP
- **Auth:** JWT/Session via httpOnly cookies

### Cross-Cutting Concerns Identified
- **Security:** IDOR prevention and global input validation.
- **Productivity:** End-to-end type safety.
- **Extensibility:** Service Layer pattern to allow future framework migration.

## Starter Template Evaluation

### Primary Technology Domain
**Full-stack Web (Next.js)** identified as the primary domain based on the Phase 1 Planning and Backlog requirements.

### Starter Options Considered

1. **create-next-app (Standard):** 
   - *Pros:* Minimum boilerplate, fully supported by Vercel, uses Next.js 16.
   - *Cons:* Requires manual setup of Prisma, Auth, and Service Layer folders.
2. **T3 Stack (create-t3-app):** 
   - *Pros:* Excellent type-safety (tRPC), includes Prisma and NextAuth out of the box.
   - *Cons:* tRPC might be overkill for a timed assessment; can add unnecessary complexity for beginners.
3. **Professional Service-Layer Starter (Recommended):**
   - *Approach:* Use `npx create-next-app@latest` with a custom folder structure specifically optimized for the **Service Layer Pattern** we planned.

### Selected Starter: Next.js 16 (Standard + Custom Service Structure)

**Rationale for Selection:**
We need maximum control over the architecture to implement the "Strict Service Pattern" defined in Step 2. Using the official `create-next-app` ensuring we are on **Next.js 16** with **Tailwind v4.0**, then manually structuring our `/lib/services` ensures the cleanest implementation of your assessment requirements.

**Initialization Command:**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --src-dir --app --import-alias "@/*" --use-npm --no-turbopack
```
*(Note: Turbopack is stabilized in v16, but we'll stick to standard Webpack for maximum compatibility during initial build steps if needed)*

**Architectural Decisions Provided:**
- **Language:** TypeScript 5.x for full-stack type safety.
- **Styling:** Tailwind CSS v4.0 (Performance optimized).
- **Organization:** App Router (Next.js 16) with a dedicated `src/` directory.
- **Dev Experience:** ESLint and standard Next.js dev server.

## Core Architectural Decisions

### Data Architecture
- **ORM:** Prisma (v6.x confirmed via latest npm standards).
- **Database:** **SQLite** (`file:./dev.db`) selected for local development and assessment portability.
- **Validation:** **Zod** (v3.x) used for "Gatekeeper" validation at the API and Service boundaries.
- **Rationale:** SQLite ensures the project is "Clone & Run" ready for assessors, while Prisma Provides the type-safety required in our foundations.

### Authentication & Security
- **Type:** **Manual JWT Implementation** (using `jose` or `jsonwebtoken`).
- **Storage:** tokens stored in **httpOnly, Secure, SameSite=Lax cookies**.
- **Authorization Pattern:** **Resource Ownership Pattern**. The Service Layer will explicitly verify `resource.userId === requester.userId` for all Mutation operations.
- **Rationale:** Demonstrates deep security knowledge and protects against CSRF and XSS more effectively than LocalStorage-based solutions.

### API & Communication Patterns
- **Style:** Next.js **Route Handlers** (RESTful-ish design).
- **Service Isolation:** All API routes are strictly "Controller" shells. 100% of business logic must reside in `src/lib/services`.
- **AI Integration:** **Gateway Pattern** implemented in `ai-service.ts`. This encapsulates all Google ADK/GCP logic, ensuring the rest of the app remains agnostic to the specific AI provider.

### Infrastructure & Deployment
- **Hosting:** Optimized for **Vercel** (Serverless compatibility).
- **Environment:** Strict `.env` schema validation using Zod to prevent runtime configuration errors.
- **Logging:** Basic structured console logging, ready for expansion to professional tools like Axiom or Sentry.

## Decision Impact Analysis

**Implementation Sequence:**
1. Initialize Next.js 16 with the Service folder structure.
2. Define Prisma Schema (User, Task) and initialize SQLite.
3. Implement `AuthService` (Registration/Login) and first Route Handlers.
4. Build `TaskService` with Ownership validation.
5. Integrate `AIService` via the Gateway pattern.

## Implementation Patterns & Consistency Rules

### Naming Patterns
- **Database (Prisma):** Models use **PascalCase** (e.g., `User`). Fields use **camelCase** (e.g., `createdAt`).
- **API Endpoints:** Use **kebab-case** and **plural** nouns (e.g., `/api/tasks`, `/api/auth/register`).
- **Code:** React Components use **PascalCase** (`TaskCard.tsx`). All other files (services, utilities, helpers) use **kebab-case** (`auth-service.ts`).

### Structure Patterns
- **Services:** High-level business logic is encapsulated in `src/lib/services/*.service.ts`.
- **Components:** Organized by feature area (`src/components/tasks/`, `src/components/auth/`).
- **Validation:** Zod schemas are co-located in `src/lib/validations/` for shared access between client and server.

### Format Patterns
- **API Responses:** 
  - Success: Direct data or `{ data: [...] }`.
  - Error: `{ "error": "Human readable message", "code": "ERROR_CODE_IN_SNAKE" }`.
- **HTTP Status Codes:** 
  - 200/201: Success.
  - 400: Validation/Business logic error.
  - 401/403: Authentication/Authorization failure.
  - 500: Unexpected server error.

### Enforcement Guidelines
**All AI Agents MUST:**
- Use the Service Layer for all database operations (NEVER call Prisma directly from an API route).
- Implement Zod validation for every API request body and parameter.
- Verify resource ownership for all non-GET requests using the `verifyOwnership` pattern in services.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
task-management-system/
├── prisma/
│   ├── schema.prisma           # Database models (User, Task)
│   └── dev.db                  # Local SQLite database
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Route Controllers
│   │   │   ├── auth/           # Login, Register, Logout
│   │   │   └── tasks/          # Task CRUD & AI Breakdown
│   │   ├── (dashboard)/        # Authenticated UI routes
│   │   │   └── tasks/          # Main task list view
│   │   ├── login/              # Login Page
│   │   └── register/           # Registration Page
│   ├── components/             # React Components
│   │   ├── auth/               # Auth forms & state
│   │   ├── tasks/              # Task list, cards, AI tools
│   │   └── ui/                 # Reusable shadcn/ui atoms
│   ├── lib/                    # The "Engine Room"
│   │   ├── services/           # CORE BUSINESS LOGIC
│   │   │   ├── auth-service.ts # Registration/Login logic
│   │   │   ├── task-service.ts # CRUD & Ownership logic
│   │   │   └── ai-service.ts   # Google ADK / GCP Gateway
│   │   ├── prisma.ts           # DB Singleton client
│   │   ├── validations/        # Zod schemas (Shared)
│   │   └── utils.ts            # Helper functions
│   └── middleware.ts           # Global Auth & Security checks
├── .env                        # Environment variables
└── package.json                # Dependencies & Scripts
```

### Requirements to Structure Mapping

- **Epic 1: Authentication** ⮕ `auth-service.ts` + `app/api/auth/`
- **Epic 2: Task Management** ⮕ `task-service.ts` + `app/api/tasks/`
- **Epic 3: AI Intelligence** ⮕ `ai-service.ts` + `app/api/tasks/[id]/breakdown/`
- **Epic 4: Security & Quality** ⮕ `validations/` + `middleware.ts`

### Architectural Boundaries

**Service Boundaries:**
API Routes are thin controllers. All state mutation and database interaction MUST occur within the Service layer. Services return typed data or throw standardized business errors.

**Data Flow:**
Request ⮕ Middleware (Auth) ⮕ API Route (Controller) ⮕ Service (Logic/DB) ⮕ Response.
Client ⮕ React Component ⮕ Server Action/API ⮕ Service Layer.

## Architecture Validation Results

### Coherence Validation ✅
- **Decision Compatibility:** Next.js 16, Prisma v6, and Tailwind v4.0 form a cohesive, high-performance modern stack.
- **Pattern Consistency:** Naming and structural patterns align with Next.js App Router and Prisma standards, minimizing dev friction.
- **Structure Alignment:** The "Service Layer" implementation in `src/lib/services` provides the necessary abstraction for both security and future scalability.

### Requirements Coverage Validation ✅
- **Epic/Feature Coverage:** 
  - Epics 1 & 2 are natively supported by the Prisma/Service architecture.
  - Epic 3 (AI) is isolated via the Gateway pattern in `ai-service.ts`.
- **Functional Requirements Coverage:** All functional requirements in BACKLOG.md have a corresponding implementation location.
- **Non-Functional Requirements Coverage:** Security is addressed via a multi-layer defense strategy (JWT/Zod/Ownership checks).

### Implementation Readiness Validation ✅
- **Decision Completeness:** All critical technology choices and versions are documented.
- **Structure Completeness:** The project tree is specific and maps directly to implementation stories.
- **Pattern Completeness:** AI agent consistency is enforced through mandatory naming and structural rules.

### Gap Analysis Results
- **Priority (Minor):** Error code registry. *Solution:* We have established a SCREAMING_SNAKE_CASE standard; agents will define these as they build services.
- **Priority (Minor):** GCP Credential Management. *Solution:* Handled via `.env` (Google ADK integration requirements).

### Architecture Completeness Checklist
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Naming conventions established
- [x] Complete directory structure defined
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment
**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** HIGH
**Key Strengths:** High degree of separation of concerns despite being a full-stack Next.js app. Strong security posture via manual JWT and resource ownership checks.

### Implementation Handoff
**First Implementation Priority:**
Initialize the project using the following command:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --src-dir --app --import-alias "@/*" --use-npm --no-turbopack
```
Followed by `npx prisma init` to set up the data layer.

## Architecture Completion Summary

### Workflow Completion
**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-02-17
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables
**📋 Complete Architecture Document**
- Verified technology stack (Next.js 16, Prisma v6, Tailwind v4.0).
- Strict Service Layer patterns for backend logic.
- Managed JWT Auth with httpOnly cookies.
- Comprehensive Project structure mapping for 4 Epics.

### Implementation Ready Foundation
- 10+ architectural decisions made.
- 5+ strict naming and structural patterns defined.
- 100% requirements coverage validated.

### Implementation Handoff
**For AI Agents:**
This architecture document is your complete guide for implementing **Task-Management-System**. Follow all decisions, patterns, and structures exactly as documented.

**Immediate Next Steps:**
1. Initialize the project using the starter template command.
2. Set up the Prisma schema and SQLite database.
3. Build the Auth Service and JWT middleware.
4. Implement Task CRUD following the ownership patterns.
5. Integrate the AI Service gateway.

**Architecture Status:** READY FOR IMPLEMENTATION ✅







