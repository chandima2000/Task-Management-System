# Task Management System with AI Consultant

A premium, human-centric Task Management System featuring an integrated AI Planning Consultant. This project uses a hybrid cloud architecture for maximum speed and intelligence.

## Architecture Overview

The system is split into two main components:
1.  **Next.js Frontend**: A high-performance web application coupled with a PostgreSQL database.
2.  **Python AI Agent**: A standalone intelligence service built with **Google ADK (Agent Development Kit)** to break down complex goals into actionable tasks.

### Hybrid Deployment
-   **Frontend & Database**: Deployed on **Vercel** with **Vercel Postgres** for ultra-fast performance.
-   **AI Agent**: **[NOT DEPLOYED]** Due to recent cloud restrictions, the AI Agent must be **run locally** to enable the AI Consultant features in the dashboard.

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### 2. Clone the Repository
```bash
git clone https://github.com/chandima2000/Task-Management-System.git
cd Task-Management-System
```

### 3. Frontend Setup (Next.js)
```bash
cd task-management-system
npm install
# Copy .env.example and fill in your details
cp .env.example .env
# Sync your database
npx prisma db push
# Start development server
npm run dev
```

### 4. AI Agent Setup (Python)
```bash
cd ai-agent
# Install dependencies using uv
uv sync
# Copy .env.example and add your Google API Key
cp .env.example .env
# Start the agent
uvicorn main:app --port 8080
```

---

## Deployment Details

### Vercel (Frontend)
-   **Connection**: Linked directly to the GitHub repository.
-   **Environment Variables**: Managed in the Vercel dashboard (`DATABASE_URL`, `JWT_SECRET`).
-   **Postgres**: Provisioned via the Vercel Storage tab.

### Google Cloud (AI Agent)
-   **Service**: Google Cloud Run.
-   **Registry**: Google Artifact Registry.
-   **Build**: Optimized using `gcloud builds` and multi-stage Dockerfiles.
-   **Variables**: `GOOGLE_API_KEY` is required for Gemini model access.

---

## Environment Variables

### Frontend (`task-management-system/.env`)
- `DATABASE_URL`: Connection string for your PostgreSQL database.
- `JWT_SECRET`: A secure string for encrypting user sessions.
- `NEXT_PUBLIC_AI_AGENT_URL`: The URL of your deployed AI Agent (Defaults to localhost).

### AI Agent (`ai-agent/.env`)
- `GOOGLE_API_KEY`: Your Gemini API key from Google AI Studio.
- `GOOGLE_GENAI_USE_VERTEXAI`: Set to `True` if deploying on GCP.

---

## API Documentation

### AI Agent Service (`ai-agent`)

#### `POST /breakdown`
Generates a project roadmap using Gemini.
- **Payload**: `{"title": "Goal Title", "description": "Optional context"}`
- **Response**: `{"subtasks": [{"title": "Step 1", "description": "Details..."}, ...]}`

#### `GET /health`
Returns the operational status of the agent.

### Core Web Application (`task-management-system`)

#### Authentication
- `POST /api/auth/register`: Creates a new user account.
- `POST /api/auth/login`: Authenticates user and sets session cookie.
- `POST /api/auth/logout`: Clears the user session.

#### Task Management
- `GET /api/api/tasks`: Returns a list of tasks for the authenticated user.
  - *Query Param*: `status` (TODO, IN_PROGRESS, DONE)
- `POST /api/api/tasks`: Creates a new task.
  - *Payload*: `{"title": "Title", "status": "TODO", ...}`
- `PATCH /api/api/tasks/[id]`: Updates an existing task.
- `DELETE /api/api/tasks/[id]`: Removes a task.

---

## Features
- **Human-Centric UI**: Crafted with a Rose/Zinc palette for a premium SaaS feel.
- **AI Breakdown**: Consult the AI panel to automatically turn one big goal into a checklist.
- **Secure Auth**: JWT-based session management.
- **Real-time Sync**: Persistent task storage with Prisma ORM.
