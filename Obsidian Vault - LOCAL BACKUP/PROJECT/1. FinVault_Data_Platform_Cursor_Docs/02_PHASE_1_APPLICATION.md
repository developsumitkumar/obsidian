# Phase 1 — React + FastAPI + PostgreSQL

## Objective

Build a working local application foundation.

```text
React
  ↓
FastAPI
  ↓
PostgreSQL
```

## Backend

Implement:

- FastAPI application
- Configuration management
- PostgreSQL connection
- Database models
- Migrations if selected
- Health endpoint
- Initial transaction APIs
- Pydantic request/response schemas
- Service layer
- Repository/data-access layer
- Error handling

Preferred conceptual structure:

```text
Routes
  ↓
Services
  ↓
Repositories
  ↓
PostgreSQL
```

Keep business logic out of route handlers.

## Database

Implement the approved relational schema.

Use:

- Primary keys
- Foreign keys
- Constraints
- Appropriate indexes
- Timestamps
- Appropriate data types

## Frontend

Build a clean but focused React application with:

- Application shell
- Dashboard placeholder
- Transactions page
- Create transaction form
- Backend API integration

## Do Not Build Yet

- CSV ingestion
- PySpark
- Azure
- Databricks
- Advanced analytics

## Completion Criteria

- React runs.
- FastAPI runs.
- PostgreSQL connection works.
- Transaction creation works.
- Transaction retrieval works.
- Basic tests pass.
- Documentation is updated.

Stop after Phase 1.
