# Product Backlog - Task Management System

This document breaks down the assessment requirements into actionable Epics and User Stories to guide the implementation phase.

## Epic 1: Secure Authentication & Identity
**Goal:** Ensure users can register, log in, and securely access their data.

### [User Story 1.1] User Registration
*   **As a** new user, **I want to** create an account with an email and password, **So that** I can start managing my personal tasks.
*   **Acceptance Criteria:**
    *   Password must be hashed using Bcrypt.
    *   Duplicate emails must be prevented.
    *   Validation for email format and password strength.

### [User Story 1.2] Secure Login & Session
*   **As a** registered user, **I want to** log in securely, **So that** I can access my private dashboard.
*   **Acceptance Criteria:**
    *   JWT or Session issuance on success.
    *   `httpOnly` cookie storage for tokens.
    *   POST `/auth/refresh` endpoint for long-lived sessions.

---

## Epic 2: Core Task Management (CRUD)
**Goal:** Enable users to perform basic task operations with strict ownership.

### [User Story 2.1] Task Creation
*   **As a** user, **I want to** create a new task with a title and description, **So that** I can keep track of my work.
*   **Acceptance Criteria:**
    *   Task is automatically associated with the logged-in user.
    *   Title validation (non-empty, max length).

### [User Story 2.2] Task Dashboard
*   **As a** user, **I want to** view a list of only my tasks on a dashboard, **So that** I can see what I need to do.
*   **Acceptance Criteria:**
    *   Strict filter to show only tasks where `userId == current_user`.
    *   Loading and empty states handled in UI.

### [User Story 2.3] Edit & Delete
*   **As a** user, **I want to** update or remove my tasks, **So that** my list stays accurate.
*   **Acceptance Criteria:**
    *   Forbidden (403) error if attempting to edit/delete a task owned by another user (IDOR prevention).

---

## Epic 3: AI Intelligence (The Novelty)
**Goal:** Enhance the platform with intelligent assistive features using Google ADK.

### [User Story 3.1] Intelligent Task Breakdown (The AI Agent)
*   **As a** user, **I want to** have the AI agent suggest sub-tasks for a complex task, **So that** I can manage large projects more efficiently.
*   **Acceptance Criteria:**
    *   Integration with Google ADK.
    *   User can "Review & Accept" AI suggestions before they are added.

---

## Epic 4: Security & Quality Assurance
**Goal:** Ensure the system is robust against common web attacks.

### [User Story 4.1] Input Sanitization & Validation
*   **As a** security-conscious developer, **I want to** validate all incoming data using Zod, **So that** malicious payloads (XSS/Injection) are blocked at the entry point.
*   **Acceptance Criteria:**
    *   All API routes use Zod schemas for validation.
    *   Strict DTO stripping for Mass Assignment prevention.
