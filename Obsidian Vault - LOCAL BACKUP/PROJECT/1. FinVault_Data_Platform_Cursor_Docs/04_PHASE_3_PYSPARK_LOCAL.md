# Phase 3 — Local PySpark Pipeline

## Objective

Introduce meaningful PySpark processing locally before adding cloud complexity.

## Target Flow

```text
Local source
   ↓
Bronze
   ↓
PySpark
   ↓
Silver
   ↓
Business transformations
   ↓
Gold
```

## PySpark Responsibilities

Demonstrate:

- Reading data
- Explicit schema
- Filtering
- Selecting columns
- `withColumn`
- Null handling
- Deduplication
- Data-type conversion
- Joins
- GroupBy/aggregation
- Derived columns
- Appropriate output writing

## Bronze

Minimal transformation/raw representation.

## Silver

Cleaned and standardized data.

Examples:

- normalized dates
- validated numeric fields
- cleaned categories
- duplicate handling
- null rules

## Gold

Analytics-ready datasets such as:

- monthly spending
- category spending
- merchant summary
- daily transaction metrics

## Important Rule

Do not use Spark just to claim Spark experience.

The pipeline should perform work that demonstrates why distributed data processing is useful.

## Local vs Cloud

Document that the local pipeline is a development equivalent.

Do not describe local filesystem folders as a real Azure data lake.

## Completion Criteria

- Pipeline runs reproducibly.
- Transformations are tested.
- Outputs can be inspected.
- Data flow is documented.
- No Azure/Databricks implementation yet.

Stop after Phase 3.
