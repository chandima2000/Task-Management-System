# Task Management System - Phase 1 Planning

This document outlines the architectural decisions, security strategy, and technical reasoning for the Task Management System assessment.

## 1. Backend Choice & Justification

**Chosen Stack:** Next.js (Full Stack) with API Routes.

### Justification:
*   **Unified Architecture:** A single codebase for both frontend and backend reduces architectural complexity and cognitive load during the development lifecycle.
*   **End-to-End Type Safety:** By using a unified stack, we achieve seamless type safety from the database layer (via Prisma/Zod) up to the UI components, eliminating the need for a separate "translation layer."
*   **Development Velocity:** Next.js provides optimized build times and hot-reloading across the entire stack, enabling faster iteration and ensuring on-time delivery for this assessment.
*   **Deployment Simplicity:** The integration between Next.js and serverless platforms ensures a reliable and easily reproducible "Live deployed URL" requirement.

## 2. High-Level Architecture

We will implement a **Layered Architecture** within the Next.js framework to ensure strict separation of concerns.

### Architectural Layers:
1.  **UI Layer (Next.js Components):** Handling user interaction and rendering.
2.  **API Layer (Next.js API Routes):** Serving as the entry point for requests, handling HTTP concerns, and routing.
3.  **Service Layer (`/lib/services`):** **MANDATORY** isolation of business logic. API routes will call these services, ensuring the core logic remains decoupled from the specific web framework.
4.  **Data Layer (Prisma ORM):** Handling database interactions with full type safety.

This structure satisfies the "Architectural thinking" criteria by ensuring the system can easily migrate to a standalone NestJS or Express backend in the future by simply moving the Service Layer.

## 3. Security Considerations & Mitigation

Security is integrated at every layer of the application:

| Risk | Attack Vector | Mitigation Strategy |
| :--- | :--- | :--- |
| **IDOR** | Insecure Direct Object Reference (accessing other users' tasks). | **Strict Ownership Checks:** Every service call will require a `userId` and verify ownership in the database query (`WHERE userId = current_user`). |
| **Injection** | Malicious payloads in search or input fields. | **Parameterized Queries:** Use Prisma ORM to prevent SQL injection and **Zod** for schema-based input validation. |
| **XSS** | Stealing session tokens via malicious scripts in task names. | **Automatic Escaping:** Leverage Next.js/React's default escaping and implement a strict **Content Security Policy (CSP)**. Auth tokens will be stored in `httpOnly` secure cookies. |
| **DoS** | Resource exhaustion via infinite request loops. | **Rate Limiting:** Implement rate limiting (via middleware) to throttle excessive requests to sensitive API endpoints like `/api/tasks/create`. |
| **Mass Assignment** | Elevating privileges by injecting hidden fields like `isAdmin`. | **Strict DTOs:** Use Zod schemas to whitelist only allowed fields for updates, stripping any unrecognized fields before they reach the database layer. |

## 4. Novelty Feature: AI-Powered Task Intelligence

Beyond basic CRUD, the system will integrate an **AI Task Agent**.

*   **Technology:** Google ADK integrated via Google Cloud Platform (GCP).
*   **Functionality:**
    *   **Auto-Breakdown:** Automatically suggest sub-tasks for complex task titles.
    *   **Smart Categorization:** AI-driven tagging based on task content.
*   **Differentiation:** This provides a high-value, intelligent user experience that demonstrates advanced integration skills beyond standard web development patterns.

## 5. Implementation Roadmap

1.  **Phase 1:** Setup Next.js boilerplate, Prisma schema, and `/lib/services` structure.
2.  **Phase 2:** Implement Auth endpoints with secure token management.
3.  **Phase 3:** Build CRUD operations with strict ownership and Zod validation.
4.  **Phase 4:** Integrate AI Agent novelty feature.
5.  **Phase 5:** Final security audit and deployment.
