# FinVault Data Platform — Master Project Specification

## 1. Project Identity

**Project:** FinVault Data Platform

**Primary positioning:** Data Engineering

**Secondary positioning:** Backend / Software Engineering

This project evolves the FinVault fintech domain into a portfolio-grade data platform. It is **not** merely a Java-to-Python rewrite.

The goal is to demonstrate a coherent engineering flow:

> Python → SQL → ETL → PySpark → Apache Spark → Azure → Databricks → Data Pipelines → Analytics

while retaining strong backend/full-stack evidence.

---

## 2. Core Business Idea

The application generates financial/transaction data and also accepts bulk transaction data.

Two data sources:

1. **Application-generated data**
   - Users create transactions through React.
   - FastAPI stores operational records in PostgreSQL.

2. **Bulk imported data**
   - Users upload CSV or paste tabular data.
   - The system validates, previews, and imports valid records.
   - Invalid and duplicate records are reported.

The consolidated operational data then feeds the data engineering pipeline.

---

## 3. Target Architecture

```text
React
  ↓
FastAPI
  ↓
PostgreSQL
  ↓
Ingestion / Export
  ↓
Azure Storage
  ↓
Azure Databricks
  ↓
PySpark
  ↓
Bronze → Silver → Gold
  ↓
Analytics-ready datasets
  ↓
FastAPI
  ↓
React Dashboard
```

The implementation must be phased. Do not build everything at once.

---

## 4. Technology Roles

| Technology | Purpose |
|---|---|
| React | Application UI and analytics presentation |
| FastAPI | Python REST backend |
| PostgreSQL | Operational relational database |
| SQL | Schema, queries and relational data operations |
| Python | Backend and data engineering support |
| PySpark | Distributed data processing |
| Apache Spark | Processing engine behind PySpark |
| Azure Storage | Cloud data storage |
| Azure Databricks | Cloud Spark execution environment |
| Delta | Reliable processed/lakehouse tables where appropriate |
| Docker | Local reproducible multi-service environment |
| Git | Version control |

Do not add technologies merely to increase the resume technology list.

---

## 5. Data Layers

### Operational

PostgreSQL contains application-oriented records.

### Bronze

Raw/minimally transformed ingested data.

### Silver

Validated, cleaned, standardized and transformed data.

### Gold

Business-ready datasets for analytics.

Each layer must have a documented purpose.

---

## 6. Key Features

### Application
- Transaction CRUD
- Dashboard
- Account/user-related functionality as justified by schema

### Ingestion
- CSV upload
- Tabular paste/import
- Schema validation
- Data-type validation
- Missing-value detection
- Duplicate detection
- Invalid-record reporting
- Import confirmation
- Import summary

### Data Engineering
- PySpark processing
- Explicit schemas
- Cleaning
- Deduplication
- Null handling
- Joins
- Aggregations
- Derived fields
- Bronze/Silver/Gold
- Delta tables where appropriate

### Analytics
- Monthly spending
- Category spending
- Merchant summary
- Daily transaction metrics
- Average transaction value
- Other useful business metrics

---

## 7. Phases

### Phase 0
Architecture, repository structure and documentation.

### Phase 1
React + FastAPI + PostgreSQL foundation.

### Phase 2
Transaction model + bulk CSV ingestion + validation + data quality.

### Phase 3
Local PySpark pipeline.

### Phase 4
Azure Storage integration.

### Phase 5
Azure Databricks + PySpark + Bronze/Silver/Gold.

### Phase 6
Analytics datasets + dashboard.

### Phase 7
Docker + testing + logging + security + documentation polish.

---

## 8. Cursor Rules

- Read project documentation before changing code.
- Inspect existing code before creating new code.
- Implement only the requested phase.
- Do not silently implement future phases.
- Do not hardcode secrets.
- Do not fake cloud integrations.
- Prefer simple, correct, explainable architecture.
- Avoid unnecessary microservices/Kubernetes.
- Reuse existing code when appropriate.
- After each phase, test and update documentation.
- Stop after the requested phase.

---

## 9. Portfolio Objective

The finished project should provide credible, explainable evidence of:

- Python
- SQL
- PostgreSQL
- ETL/ELT
- Data ingestion
- Data quality
- PySpark
- Apache Spark
- Azure
- Azure Databricks
- Data pipelines
- Backend engineering

The developer should be able to explain every major architectural decision in an interview.
