# Phase 2 — Bulk Ingestion + Data Quality

## Objective

Build a robust bulk transaction ingestion workflow.

```text
CSV / pasted data
      ↓
FastAPI
      ↓
Schema validation
      ↓
Record validation
      ↓
Preview
      ↓
User confirmation
      ↓
PostgreSQL
```

## User Flow

1. Upload CSV.
2. Parse file.
3. Validate schema.
4. Validate data types.
5. Detect missing values.
6. Detect duplicates.
7. Identify invalid records.
8. Preview results.
9. Confirm import.
10. Import valid records.
11. Display data-quality summary.

## Example Result

```text
Total rows:      5000
Valid rows:      4982
Invalid rows:      18
Duplicates:         7
Missing/invalid:   11
```

These numbers are examples only; calculate actual results.

## Data Quality

Treat quality as an engineering concern.

Distinguish:

```text
RAW INPUT
   ↓
VALIDATED DATA
   ↓
ACCEPTED DATA

RAW INPUT
   ↓
REJECTED DATA
```

## Frontend

Provide:

- Upload control
- Preview
- Validation status
- Error summary
- Import confirmation
- Import result

## Backend

Create a reusable ingestion service.

Do not blindly insert uploaded records.

## Testing

Test:

- Valid CSV
- Invalid schema
- Missing fields
- Invalid data types
- Duplicate records
- Empty files
- Large-ish sample files
- Transaction/business-rule validation

## Do Not Build Yet

- PySpark
- Azure
- Databricks

Stop after Phase 2.
