# Standard python slim image
FROM python:3.11-slim AS builder

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvbin/uv
ENV PATH="/uvbin:$PATH"

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy project files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --no-install-project --no-dev

# Final production stage
FROM python:3.11-slim

WORKDIR /app

# Copy the virtualenv from the builder
COPY --from=builder /app/.venv /app/.venv
COPY . .

# Ensure we use the virtualenv
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8080

# Start the application directly with python to ensure main block runs
CMD ["python", "main.py"]
