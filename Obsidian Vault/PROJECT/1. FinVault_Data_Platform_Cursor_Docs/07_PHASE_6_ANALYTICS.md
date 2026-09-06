# Phase 6 — Analytics + Dashboard

## Objective

Expose Gold datasets through the application.

## Architecture

```text
Raw data
   ↓
PySpark
   ↓
Gold datasets
   ↓
FastAPI
   ↓
React
```

React should not perform heavy data processing.

## Analytics

Implement useful business metrics such as:

- Total transactions
- Transaction volume over time
- Spending by category
- Spending by merchant
- Monthly spending
- Average transaction value
- Account/customer summaries where justified

## Dashboard Principles

- Each chart should answer a business question.
- Avoid excessive charts.
- Prioritize readability.
- Use analytics-ready data.
- Document which Gold dataset powers each view.

## Completion Criteria

- Gold datasets are exposed through APIs.
- Dashboard consumes those APIs.
- Data is correct.
- Visualizations are useful.
- Documentation is updated.

Stop after Phase 6.
