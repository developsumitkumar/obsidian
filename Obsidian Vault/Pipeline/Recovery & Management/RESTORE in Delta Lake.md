

> [!summary] Core Idea  
> **RESTORE is a Delta Lake recovery operation that makes the current table state match an earlier table version or timestamp.**
> 
> Think: **“Something went wrong with my table. Take its data state back to when it was correct.”**

## 1. Why do we need RESTORE?

Suppose our pipeline is:

```
Source
   ↓
Bronze
   ↓
Silver
   ↓
Gold
```

Gold has these versions:

```
Version 10 → Correct
Version 11 → Correct
Version 12 → Bad pipeline run ❌
```

Maybe somebody accidentally executed:

```
DELETE FROM gold_transactions;
```

or your pipeline performed an incorrect `MERGE`/`OVERWRITE`.

The current table is now **Version 12**, but Version 11 was correct.

Instead of manually rebuilding everything, Delta can use its transaction history and retained data files to restore the table.

---

## 2. RESTORE uses Delta's version history

Remember our Delta architecture:

```
Delta Table
│
├── Parquet data files
│
└── _delta_log/
       │
       ├── version 10
       ├── version 11
       └── version 12
```

Delta knows which files represented each table version.

Therefore, we can say:

```
Current State
Version 12 ❌

      ↓ RESTORE

Previous State
Version 11 ✅
```

> [!important]  
> RESTORE does **not simply erase Version 12 and move the version number backward**.

Instead, restoration itself creates another transaction.

Conceptually:

```
Version 10
   ↓
Version 11  ✅
   ↓
Version 12  ❌
   ↓
RESTORE TO VERSION 11
   ↓
Version 13  ✅
```

Version 13 becomes the current version, but its **table state resembles Version 11**.

This preserves Delta's transactional history.

---

# 3. SQL Example

First, we can inspect table history:

```
DESCRIBE HISTORY gold_transactions;
```

Suppose we find:

```
Version    Operation
----------------------------
10         MERGE
11         MERGE
12         DELETE    ❌
```

We can restore:

```
RESTORE TABLE gold_transactions
TO VERSION AS OF 11;
```

We can also restore based on a timestamp:

```
RESTORE TABLE gold_transactions
TO TIMESTAMP AS OF '2026-09-20 10:00:00';
```

Conceptually:

```
Find last good state
        ↓
Version 11
        ↓
RESTORE
        ↓
New current version
representing that state
```

---

# 4. PySpark Example

With PySpark, one straightforward approach is executing Delta SQL:

```python
spark.sql("""
    RESTORE TABLE gold_transactions
    TO VERSION AS OF 11
""")
```

For timestamp-based restore:

```python
spark.sql("""
    RESTORE TABLE gold_transactions
    TO TIMESTAMP AS OF '2026-09-20 10:00:00'
""")
```

Depending on your Delta Lake/platform version, the Python `DeltaTable` API can also expose restore methods.

For example:

```python
from delta.tables import DeltaTable

gold_table = DeltaTable.forName(
    spark,
    "gold_transactions"
)

gold_table.restoreToVersion(11)
```

Or:

```python
gold_table.restoreToTimestamp(
    "2026-09-20 10:00:00"
)
```

> [!tip]  
> For learning, understand the **SQL form first**. The underlying RESTORE concept is the same regardless of whether you trigger it through SQL or the Delta Python API.

---

# 5. RESTORE vs Time Travel

These two are closely related but **not the same thing**.

Suppose:

```
Current = Version 12
Old     = Version 11
```

### Time Travel

```sql
SELECT *
FROM gold_transactions
VERSION AS OF 11;
```

means:

> **"Let me READ Version 11."**

The current table remains Version 12.

```
Current table → V12

You temporarily read → V11
```

### RESTORE

```sql
RESTORE TABLE gold_transactions
TO VERSION AS OF 11;
```

means:

> **"Make the table's current state look like Version 11 again."**

Conceptually:

```
V11
 ↓
V12 ❌
 ↓
RESTORE V11
 ↓
V13 ✅
```

### Memory trick

> **Time Travel = visit the past.**  
> **RESTORE = make the past state current again.**

---

# 6. Connection With VACUUM

This is extremely important.

Suppose Version 11 requires:

```
A.parquet
B.parquet
C.parquet
```

Version 12 replaced those with:

```
D.parquet
E.parquet
```

To restore Version 11, Delta needs the required historical data files.

But remember what `VACUUM` does:

```
Old unreferenced files
        ↓
Retention period passes
        ↓
VACUUM
        ↓
Physical deletion
```

If required historical files have already been physically removed, restoring that old state may no longer be possible.

Therefore:

```
Longer retention
      ↓
More historical recovery potential
      +
More storage


Aggressive VACUUM
      ↓
Less storage
      +
Less historical recovery potential
```

> [!warning]  
> **VACUUM policy directly affects how far back historical operations such as time travel and RESTORE can work.**

---

# 7. Pipeline Example

Imagine our Gold pipeline normally performs:

```python
gold_df.write \
    .format("delta") \
    .mode("overwrite") \
    .saveAsTable("gold_monthly_spending")
```

A coding bug produces incorrect totals:

```
Gold V40
Jan Food      5,000
Feb Food      7,000
Mar Food      6,000
                 ✅

       ↓ BAD PIPELINE

Gold V41
Jan Food      500,000
Feb Food      700,000
Mar Food      600,000
                 ❌
```

First investigate:

```
DESCRIBE HISTORY gold_monthly_spending;
```

Suppose Version 40 is confirmed correct.

Then:

```
RESTORE TABLE gold_monthly_spending
TO VERSION AS OF 40;
```

Now:

```
V40  Correct
 ↓
V41  Bad
 ↓
RESTORE TO V40
 ↓
V42  Correct state again
```

But there's an operational lesson here:

> [!important]  
> **RESTORE fixes the table state; it does not fix the buggy pipeline code.**

If tomorrow's job runs the same bad transformation again:

```
V42 Correct
   ↓
Bad pipeline runs again
   ↓
V43 Wrong ❌
```

So in a real incident:

```
Detect bad data
      ↓
Stop/fix offending pipeline
      ↓
Identify last correct version
      ↓
RESTORE
      ↓
Validate table
      ↓
Resume pipeline
```

---

# 8. Where Does RESTORE Fit?

Update our classification:

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
    ├── RESTORE   ← here
    └── CLONE
```

So **RESTORE is neither DML nor a normal write mode**.

It's best understood as a:

> **Delta Lake table recovery operation.**

---

# Interview Answer

> [!question] What is RESTORE in Delta Lake?
> 
> **RESTORE is a Delta Lake recovery operation used to return a table's current state to an earlier version or timestamp. Delta uses its transaction history and retained data files to reconstruct the earlier state. RESTORE itself creates a new table version rather than deleting the versions that came after the restored version. It is useful for recovering from accidental DELETEs, incorrect MERGEs, bad overwrites, or faulty pipeline runs.**

### RESTORE vs Time Travel?

> **Time travel reads an older version without changing the current table, whereas RESTORE makes an older table state the new current state.**

### RESTORE vs VACUUM?

> **RESTORE depends on historical files being available, while VACUUM can permanently remove obsolete historical files after the retention period. Therefore, aggressive VACUUM policies can limit how far back a table can be restored.**

> [!example] One-Line Memory Trick
> 
> **Time Travel = READ the past.**  
> **RESTORE = make the past CURRENT.**  
> **VACUUM = eventually DELETE old physical files.**