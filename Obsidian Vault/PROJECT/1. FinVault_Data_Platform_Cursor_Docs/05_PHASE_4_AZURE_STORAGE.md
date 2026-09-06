# Phase 4 — Azure Storage

## Objective

Introduce cloud storage while preserving local development.

## Target Flow

```text
Application / PostgreSQL
        ↓
Ingestion
        ↓
Azure Storage
        ↓
Databricks later
```

## Tasks

- Select the Azure storage service justified by the architecture.
- Define containers/directories.
- Define naming conventions.
- Define raw-data locations.
- Define processed-data locations.
- Configure authentication securely.
- Update `.env.example`.
- Implement storage integration.
- Add error handling.
- Document configuration.

## Security

Never hardcode:

- Azure keys
- passwords
- connection strings
- tokens

Use environment variables or the chosen secure configuration mechanism.

## Local Mode

The project must still support local development.

Document:

```text
LOCAL MODE
AZURE MODE
```

and clearly explain the difference.

## Do Not Build Yet

- Databricks pipeline
- Cloud Bronze/Silver/Gold execution

Those belong to Phase 5.

## Completion Criteria

- Azure storage integration works as intended.
- Credentials are not committed.
- Local development remains understandable.
- Documentation is updated.

Stop after Phase 4.
