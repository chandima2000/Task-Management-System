# Use uv-based python image for faster builds
FROM ghcr.io/astral-sh/uv:python3.11-alpine AS builder

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy project files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --no-install-project --no-dev

# Final stage
FROM python:3.11-alpine

WORKDIR /app

# Copy the environment from the builder
COPY --from=builder /app/.venv /app/.venv
COPY . .

# Ensure we use the virtualenv
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
