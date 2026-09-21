```python

DATA ENGINEERING
│
├── 01. Data Architecture              ← mostly done
│   ├── Data Lake
│   ├── Data Warehouse
│   ├── Data Lakehouse
│   ├── Delta Lake
│   └── Bronze / Silver / Gold
│
├── 02. Data Processing                ← NEXT
│   ├── Batch Processing
│   ├── Stream Processing
│   ├── Batch vs Streaming
│   ├── Full Load
│   ├── Incremental Load
│   ├── ETL vs ELT
│   └── Idempotency
│
├── 03. Incremental Data Engineering   ← VERY IMPORTANT
│   ├── Incremental Loading
│   ├── Watermarking
│   ├── High-Water Mark
│   ├── CDC (Change Data Capture)
│   ├── Late Arriving Data
│   ├── Deduplication
│   ├── Upsert
│   └── Backfills
│
├── 04. Apache Spark
│   ├── Spark Architecture
│   ├── Driver
│   ├── Executors
│   ├── Cluster Manager
│   ├── Jobs / Stages / Tasks
│   ├── Transformations vs Actions
│   ├── Lazy Evaluation
│   ├── Narrow vs Wide Transformations
│   ├── Shuffle
│   ├── Partitions
│   ├── Repartition vs Coalesce
│   ├── Cache / Persist
│   ├── Broadcast Join
│   ├── Spark Joins
│   ├── Data Skew
│   ├── Predicate Pushdown
│   └── Spark Performance Tuning
│
├── 05. PySpark
│   ├── DataFrames
│   ├── select / filter / withColumn
│   ├── groupBy / agg
│   ├── Joins
│   ├── Window Functions
│   ├── explode
│   ├── when / otherwise
│   ├── null handling
│   ├── read / write
│   ├── schemas
│   ├── UDFs
│   └── PySpark Interview Problems
│
├── 06. SQL for Data Engineering
│   ├── Joins
│   ├── GROUP BY / Aggregations
│   ├── CTE
│   ├── Subqueries
│   ├── Window Functions
│   ├── ROW_NUMBER / RANK / DENSE_RANK
│   ├── LEAD / LAG
│   ├── Running Totals
│   ├── Deduplication
│   ├── Conditional Aggregation
│   ├── Date Functions
│   ├── Query Execution
│   └── SQL Optimization
│
├── 07. Data Warehousing
│   ├── OLTP vs OLAP
│   ├── Fact Tables
│   ├── Dimension Tables
│   ├── Star Schema
│   ├── Snowflake Schema
│   ├── Surrogate Keys
│   ├── Natural Keys
│   ├── SCD
│   │    ├── Type 1
│   │    └── Type 2 ⭐
│   ├── Grain
│   └── Data Marts
│
├── 08. File Formats & Storage
│   ├── CSV
│   ├── JSON
│   ├── Parquet
│   ├── Avro
│   ├── Row vs Columnar Storage
│   ├── Compression
│   ├── Partitioning
│   ├── Bucketing
│   └── Small File Problem
│
├── 09. Data Pipelines
│   ├── Pipeline Design
│   ├── DAG
│   ├── Dependencies
│   ├── Scheduling
│   ├── Orchestration
│   ├── Retries
│   ├── Failure Handling
│   ├── Checkpointing
│   ├── Backfill
│   ├── Monitoring
│   └── Data Quality
│
├── 10. Apache Kafka
│   ├── Kafka Architecture
│   ├── Producer
│   ├── Consumer
│   ├── Topic
│   ├── Partition
│   ├── Offset
│   ├── Consumer Groups
│   ├── Retention
│   └── Kafka → Spark pipeline
│
├── 11. Spark Structured Streaming
│   ├── Streaming DataFrame
│   ├── Micro-batching
│   ├── Checkpoints
│   ├── Watermarks
│   ├── Window Aggregations
│   ├── Stateful Processing
│   └── Exactly-once concepts
│
├── 12. Cloud Data Engineering
│   ├── Object Storage
│   │    ├── S3
│   │    ├── ADLS
│   │    └── GCS
│   ├── IAM / Permissions
│   ├── Compute vs Storage
│   └── Cloud architecture
│
└── 13. DE System Design
    ├── Design Batch Pipeline
    ├── Design Streaming Pipeline
    ├── Incremental Pipeline
    ├── Handling Duplicates
    ├── Handling Late Data
    ├── Handling Failures
    ├── Scaling Pipelines
    └── End-to-End DE Architecture
14. dbt / Analytics Engineering
│
├── What is dbt?
├── ELT and dbt's role
├── dbt Project Structure
├── Models
├── ref()
├── source()
├── Materializations
│   ├── View
│   ├── Table
│   ├── Incremental
│   └── Ephemeral
├── Incremental Models
├── Tests
│   ├── not_null
│   ├── unique
│   ├── relationships
│   └── accepted_values
├── Sources & Freshness
├── Macros / Jinja basics
├── Documentation
├── Lineage / DAG
└── Snapshots
    └── Connection to SCD Type 2


15. Data Quality & Observability
│
├── What is Data Quality?
├── Completeness
├── Accuracy
├── Uniqueness
├── Consistency
├── Validity
├── Freshness
├── Schema Validation
├── Data Quality Checks
├── dbt Tests
├── Great Expectations / similar frameworks
├── Data Contracts
├── Freshness Monitoring
├── Pipeline Monitoring
├── Anomaly Detection
└── Alerting


16. Governance & Security
│
├── PII / Sensitive Data
├── Encryption
│   ├── At Rest
│   └── In Transit
├── Authentication vs Authorization
├── RBAC
├── Least Privilege
├── Column / Row-level Security
├── Masking / Tokenization
├── Data Catalog
├── Metadata Management
├── Data Lineage
├── Retention Policies
├── Unity Catalog
└── Microsoft Purview


17. Data Engineering DevOps
│
├── Git for Data Engineering
├── Branching / Pull Requests
├── CI/CD
├── Testing Data Pipelines
├── Unit Tests
├── Integration Tests
├── Environment Management
│   ├── Dev
│   ├── Test
│   └── Prod
├── Docker Fundamentals
├── Infrastructure as Code
├── Terraform Fundamentals
├── Secrets Management
├── Deployment
└── Monitoring after Deployment
```
