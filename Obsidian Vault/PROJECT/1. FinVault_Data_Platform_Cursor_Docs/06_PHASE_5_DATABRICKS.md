# Phase 5 — Azure Databricks + PySpark + Bronze/Silver/Gold

## Objective

Move Spark processing into Azure Databricks and establish the cloud data-processing architecture.

## Target

```text
Azure Storage
      ↓
Azure Databricks
      ↓
PySpark
      ↓
Bronze
      ↓
Silver
      ↓
Gold
```

## Bronze

Purpose:

- Raw/minimally transformed representation
- Preserve source information
- Support replay/debugging where practical

## Silver

Purpose:

- Clean
- Validate
- Standardize
- Deduplicate
- Handle nulls
- Join related datasets
- Apply appropriate business rules

## Gold

Purpose:

Create analytics-ready datasets such as:

- Monthly spending
- Category spending
- Merchant summary
- Daily transaction metrics
- Account/customer summary

## Databricks

Demonstrate meaningful use of:

- Databricks notebooks and/or jobs
- PySpark
- Spark DataFrames
- Transformations
- Aggregations
- Delta tables where appropriate

Do not create excessive notebooks.

Prefer an understandable structure that could eventually support scheduled jobs.

## Incremental Processing

Only implement incremental processing if it can be explained and tested.

If implemented, document:

- watermark/change tracking approach
- new-data detection
- idempotency behavior
- failure/retry behavior

## Important

Do not claim production-grade functionality that has not been verified.

## Completion Criteria

- Cloud pipeline executes.
- Bronze/Silver/Gold outputs are verified.
- Schemas are documented.
- PySpark transformations are understandable.
- Databricks role is clearly documented.

Stop after Phase 5.
