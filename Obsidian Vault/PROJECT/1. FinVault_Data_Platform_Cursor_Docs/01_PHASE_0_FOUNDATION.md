# Phase 0 — Foundation

## Objective

Establish the architecture, repository structure, documentation and development standards.

## Do Not Build Yet

Do not implement:

- Business APIs
- Full React screens
- CSV ingestion
- PySpark pipeline
- Azure integration
- Databricks
- Docker deployment

## Tasks

1. Inspect the repository.
2. Understand reusable existing code.
3. Create the agreed folder structure.
4. Create/update `README.md`.
5. Create/update `PROJECT_PLAN.md`.
6. Create `docs/architecture.md`.
7. Create `docs/database.md`.
8. Create `.env.example`.
9. Define local development requirements.
10. Define the PostgreSQL schema at a high level.
11. Define phase boundaries.
12. Record assumptions and architectural decisions.

## Expected Documentation

```text
PROJECT_PLAN.md
README.md
AI_RULES.md
.env.example

docs/
  architecture.md
  database.md
```

## Completion Criteria

- Repository structure is clear.
- Architecture is documented.
- Database design is documented.
- Technology responsibilities are documented.
- Local development requirements are documented.
- No future-phase implementation has been started.

## Cursor Completion Behavior

Run basic repository checks, update documentation, summarize changes, and stop.
