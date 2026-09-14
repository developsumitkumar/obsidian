# AI Development Rules

This is a portfolio-grade Data Engineering project.

The developer is learning while building it. AI assistance must therefore optimize for:

1. Understanding
2. Correct architecture
3. Maintainability
4. Explainability
5. Incremental development

## Before Changes

- Read the relevant documentation.
- Inspect existing code.
- Check whether functionality already exists.
- Avoid unnecessary rewrites.

## Scope Control

Implement only the requested phase.

Never silently implement future phases.

Never generate a large amount of speculative code.

## Architecture

Prefer:

> simple + correct + explainable

over:

> complicated + impressive-looking

Do not introduce:

- unnecessary microservices
- Kubernetes
- excessive abstractions
- technologies without a clear purpose

## Security

Never hardcode:

- passwords
- API keys
- cloud credentials
- tokens
- connection secrets

Use environment configuration.

## Data Engineering

Do not claim:

- Spark usage without meaningful Spark work
- Azure usage without actual integration
- Databricks usage without actual Databricks execution
- production-grade behavior without verification

## After Every Phase

1. Run relevant tests.
2. Verify the implementation.
3. Update documentation.
4. Update `PROJECT_PLAN.md`.
5. State what remains.
6. Stop.

The developer should be able to explain every major component during an interview.
