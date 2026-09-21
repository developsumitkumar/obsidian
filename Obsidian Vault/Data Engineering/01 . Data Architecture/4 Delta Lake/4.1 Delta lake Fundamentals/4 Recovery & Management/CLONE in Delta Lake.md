

> [!summary] Core Idea  
> **CLONE creates a copy of an existing Delta table for development, testing, experimentation, backup-like workflows, or creating another environment.**
> 
> Delta commonly distinguishes:
> 
> - **SHALLOW CLONE** → copies table metadata while referencing existing source data files.
> - **DEEP CLONE** → copies metadata **and** the underlying data files.
> 
> Support and exact behavior can vary by Delta platform/version.

---

## 1. Why Do We Need CLONE?

Imagine our production pipeline:

```
Source
   ↓
Bronze
   ↓
Silver
   ↓
Gold
   ↓
Power BI / Analytics
```

Our production Silver table contains:

```
silver_transactions

500 million rows
2 TB of data
```

You want to test a new transformation.

Would you test directly on:

```
PRODUCTION TABLE ❌
```

Definitely not.

You could manually create another table and copy everything:

```
Production
    ↓
Read entire table
    ↓
Write entire table again
    ↓
Test Table
```

But copying 2 TB can take time and consume another 2 TB of storage.

Delta provides **CLONE** to make this workflow easier.

---

# 2. Two Types of CLONE

```
                CLONE
                  │
          ┌───────┴────────┐
          ↓                ↓
   SHALLOW CLONE       DEEP CLONE
          │                │
   Metadata copied    Metadata copied
          +                +
   References source   Data files copied
   data files
```

Understanding this distinction is the main goal of this topic.

---

# 3. SHALLOW CLONE

Suppose production contains:

```
silver_transactions
│
├── A.parquet
├── B.parquet
├── C.parquet
└── _delta_log/
```

We create:

```
CREATE TABLE silver_test
SHALLOW CLONE silver_transactions;
```

Conceptually:

```
              SOURCE
        silver_transactions

        A     B     C
        ↑     ↑     ↑
        │     │     │
        └─────┼─────┘
              │
       SHALLOW CLONE
              │
              ↓
          silver_test
        separate metadata
```

The important idea:

> **A shallow clone doesn't initially duplicate all of the source table's data files.**

Instead, the clone can reference the source's existing data files.

Therefore it is generally:

```
Fast to create
+
Low initial storage cost
```

---

# 4. Is a Shallow Clone Just Another Name for the Same Table?

No.

This is an important distinction.

Think:

```
Source Table
     │
     ├── its metadata/history
     │
     └── data files
             ↑
             │
      initially referenced
             │
     Shallow Clone
             │
             └── its own metadata
```

The clone is a **separate table**, even though its initial state can reference source data files.

Subsequent changes to the clone are tracked independently.

So if you modify:

```
silver_test
```

you aren't simply executing the same transaction against:

```
silver_transactions
```

---

# 5. The Major Shallow Clone Risk

Remember `VACUUM`?

Suppose the shallow clone references:

```
A.parquet
B.parquet
C.parquet
```

from the source.

Later, changes to the source make `A.parquet` obsolete.

Eventually:

```
Source
   ↓
VACUUM
   ↓
A.parquet physically deleted
```

If your shallow clone still depends on that file, you can have a problem.

Conceptually:

```
SHALLOW CLONE
      ↓
References source files
      ↓
Source changes over time
      ↓
Source VACUUM removes
files clone still requires
      ↓
Clone may become unusable
for that referenced data
```

> [!warning]  
> A shallow clone is **not the same as a fully independent physical backup**.

This also gives you another reason why understanding `VACUUM` first was useful.

---

# 6. DEEP CLONE

Now suppose we execute:

```
CREATE TABLE silver_test
DEEP CLONE silver_transactions;
```

A deep clone copies the underlying data as well.

Conceptually:

```
SOURCE

A.parquet
B.parquet
C.parquet

       ↓
   DEEP CLONE
       ↓

TEST

X.parquet
Y.parquet
Z.parquet
```

Think:

```
SHALLOW
"Reference existing data."


DEEP
"Create an independent physical copy."
```

Because the data has to be copied, deep clone generally requires:

```
More time
+
More storage
```

than a shallow clone.

---

# 7. SQL Examples

### Shallow Clone

```sql
CREATE TABLE silver_transactions_test
SHALLOW CLONE silver_transactions;
```

### Deep Clone

```sql
CREATE TABLE silver_transactions_test
DEEP CLONE silver_transactions;
```

You can also encounter cloning to a location:

```sql
CREATE TABLE silver_transactions_test
DEEP CLONE silver_transactions
LOCATION '/data/test/silver_transactions';
```

Exact syntax/features depend on the Delta platform you're using.

---

# 8. PySpark Examples

Unlike normal transformations such as:

```python
df.filter(...)
df.groupBy(...)
```

CLONE is a **table-management operation**.

A straightforward PySpark approach is therefore to execute the SQL:

```python
spark.sql("""
    CREATE TABLE silver_transactions_test
    SHALLOW CLONE silver_transactions
""")
```

For a deep clone:

```python
spark.sql("""
    CREATE TABLE silver_transactions_test
    DEEP CLONE silver_transactions
""")
```

So remember:

```
PySpark application
      ↓
spark.sql(...)
      ↓
Delta CLONE command
      ↓
New Delta table
```

> [!important]  
> Don't assume every Delta operation must look like a DataFrame transformation. PySpark applications can execute SQL through `spark.sql()`.

---

# 9. Pipeline Example

Suppose we currently have:

```
Production

Bronze
   ↓
Silver
   ↓
Gold
```

You want to change your Gold aggregation logic.

Instead of experimenting directly on production:

```
Production Silver
       ↓
 SHALLOW CLONE
       ↓
 silver_test
       ↓
New transformation
       ↓
 gold_test
       ↓
Validate results
```

Your PySpark notebook could begin with:

```python
spark.sql("""
    CREATE TABLE silver_transactions_test
    SHALLOW CLONE silver_transactions
""")
```

Then test:

```python
test_df = spark.table("silver_transactions_test")

result_df = (
    test_df
    .groupBy("month", "category")
    .sum("amount")
)
```

Now you're experimenting against a cloned table rather than intentionally modifying the production table.

---

# 10. SHALLOW vs DEEP CLONE

||Shallow Clone|Deep Clone|
|---|---|---|
|Metadata|Copied|Copied|
|Initial data files|Referenced|Copied|
|Creation|Usually faster|Usually slower|
|Initial storage|Lower|Higher|
|Physical independence|Lower|Higher|
|Good mental use case|Development/testing|Independent copy|

The easiest way to visualize it:

```
SHALLOW

Source ────────┐
               ↓
          Data Files
               ↑
Clone ─────────┘


DEEP

Source
  ↓
Source Files

      COPY

Clone
  ↓
Clone Files
```

---

# 11. CLONE vs COPY

You might ask:

> Why not just read and write the DataFrame?

For example:

```python
df = spark.table("silver_transactions")

df.write \
  .format("delta") \
  .saveAsTable("silver_transactions_test")
```

That can create another dataset, but you're performing a normal data read/write operation.

`CLONE` is specifically designed as a **Delta table-management feature** for replicating a table's state.

Especially with shallow clone:

```
Normal full copy

Read data
   ↓
Write data again
   ↓
Potentially expensive


SHALLOW CLONE

Clone metadata/reference state
   ↓
No initial full physical data copy
   ↓
Much cheaper/faster initial creation
```

---

# 12. CLONE vs RESTORE

Don't confuse these two.

### RESTORE

```
SAME TABLE

Current version ❌
      ↓
RESTORE
      ↓
Earlier state becomes
new current state
```

Example:

```
RESTORE TABLE gold
TO VERSION AS OF 10;
```

Purpose:

> **Recovery**

### CLONE

```
SOURCE TABLE
      ↓
    CLONE
      ↓
NEW TABLE
```

Example:

```sql
CREATE TABLE gold_test
SHALLOW CLONE gold;
```

Purpose:

> **Create another table from an existing table state.**

Memory:

```
RESTORE
"Fix this table using its past."

CLONE
"Create another table from this table."
```

---

# 13. Where Does CLONE Fit?

Our Delta map is now:

```
Delta Lake Operations
│
├── DML
│   ├── INSERT
│   ├── UPDATE
│   ├── DELETE
│   └── MERGE
│
├── Write Modes
│   ├── APPEND
│   └── OVERWRITE
│
├── Maintenance & Optimization
│   ├── OPTIMIZE
│   ├── Z-ORDER
│   └── VACUUM
│
└── Recovery / Management
    ├── RESTORE
    └── CLONE
        ├── SHALLOW
        └── DEEP
```

So:

> **CLONE is not DML and isn't a normal DataFrame write mode. It is a Delta table-management operation.**

---

# Interview Answer

> [!question] What is CLONE in Delta Lake?
> 
> **CLONE is a Delta table-management operation used to create another table from an existing Delta table. A shallow clone creates a separate table while initially referencing the source table's existing data files, making it fast and storage-efficient. A deep clone also copies the underlying data files, giving greater physical independence but requiring more time and storage. Clones are useful for development, testing, experimentation, and environment replication. Exact clone capabilities depend on the Delta platform and version.**

### If asked: Shallow vs Deep?

> **A shallow clone primarily copies metadata and references existing source data files, while a deep clone copies both metadata and the underlying data.**

### If asked: RESTORE vs CLONE?

> **RESTORE changes the current state of an existing table to match an earlier state, while CLONE creates a separate table from an existing table.**

> [!example] One-Line Memory Trick
> 
> **SHALLOW CLONE = new table, shared existing files initially.**  
> **DEEP CLONE = new table, copied data files.**  
> **RESTORE = same table, previous state becomes current.**

