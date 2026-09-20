`VACUUM` is best classified as a **Delta Lake maintenance / cleanup operation**.

```
DML
├── INSERT
├── UPDATE
├── DELETE
└── MERGE

Write Modes
├── APPEND
└── OVERWRITE

Delta Maintenance
├── VACUUM      ← we are here
└── OPTIMIZE
```

The easiest definition:

> **VACUUM permanently deletes old data files that are no longer referenced by the current Delta table and are older than the configured retention period.**

It is essentially **physical storage cleanup**.

---

# 1. Why does VACUUM even exist?

This connects directly to what we learned about Delta Lake.

Remember that a Delta table consists roughly of:

```
Delta Table
│
├── Parquet data files
│
└── _delta_log/
```

Suppose Gold currently contains:

```
Version 1

A.parquet
B.parquet
C.parquet
```

Then we perform an `UPDATE`.

Instead of simply editing `B.parquet` in place, Delta may produce a new file:

```
D.parquet
```

and record:

```
REMOVE B.parquet
ADD    D.parquet
```

So the current logical table becomes:

```
Version 2

A.parquet
C.parquet
D.parquet
```

But physically, storage may still contain:

```
A.parquet
B.parquet    ← old
C.parquet
D.parquet
```

Why hasn't `B.parquet` disappeared?

Because Delta may still need it for **older table versions**.

---

# 2. This is what enables Time Travel

Imagine our table history:

```
Version 1
A + B + C

       ↓ UPDATE

Version 2
A + C + D
```

Current readers see:

```
A + C + D
```

But suppose you request:

```sql
SELECT *
FROM gold VERSION AS OF 1;
```

Delta looks at its transaction history and determines:

```
Version 1 requires:

A
B
C
```

Therefore `B.parquet` must still physically exist.

So:

> **Logically removed ≠ physically deleted.**

That's a very important Delta Lake concept.

---

# 3. Now imagine months of pipeline activity

Our pipeline runs every night:

```
Bronze
   ↓
Silver
   ↓
Gold
```

Gold currently uses full overwrite:

```python
gold_df.write \
    .format("delta") \
    .mode("overwrite") \
    .save(gold_path)
```

Day 1:

```
A.parquet
B.parquet
```

Day 2 overwrite:

```python
C.parquet
D.parquet
```

Day 3:

```python
E.parquet
F.parquet
```

Day 4:

```python
G.parquet
H.parquet
```

Current Gold may logically need only:

```python
G
H
```

but physical storage may still have older files:

```
A
B
C
D
E
F
G   ← current
H   ← current
```

Those old files consume storage.

And that's where **VACUUM** comes in.

---

# 4. What VACUUM does

Conceptually:

```
Before VACUUM

gold/
│
├── A.parquet   ❌ old/unreferenced
├── B.parquet   ❌ old/unreferenced
├── C.parquet   ❌ old/unreferenced
├── D.parquet   ❌ old/unreferenced
├── E.parquet   ❌ old/unreferenced
├── F.parquet   ❌ old/unreferenced
├── G.parquet   ✅ current
├── H.parquet   ✅ current
│
└── _delta_log/
```

Run:

```
VACUUM gold;
```

Delta identifies data files that:

1. are no longer required by the current table state, **and**
2. are old enough according to the retention policy.

Then physically deletes eligible files.

After:

```
gold/
│
├── G.parquet
├── H.parquet
│
└── _delta_log/
```

So:

> **DELETE changes what rows belong to the logical table. VACUUM cleans obsolete physical files from storage.**

Do not confuse those two.

---

# 5. But VACUUM has a major consequence

Suppose:

```
Version 1 → requires A + B

Version 2 → requires C + D

Version 3 → requires G + H
```

After enough time, VACUUM physically deletes:

```
A
B
C
D
```

Now you ask:

```sql
SELECT *
FROM gold
VERSION AS OF 1;
```

The transaction log may still contain historical information saying:

```
Version 1 used A and B
```

but if `A` and `B` have been physically deleted, Delta can't reconstruct that data.

This gives us the fundamental trade-off:

```
Keep old files
     ↓
More storage usage
     +
Longer time-travel capability


VACUUM old files
     ↓
Less storage usage
     +
Older versions eventually
become unavailable
```

---

# 6. Retention Period

Delta doesn't normally mean:

> "Delete every old file immediately!"

That would be dangerous.

VACUUM works with a **retention period**.

A commonly encountered default retention threshold in Delta Lake is **7 days (168 hours)** for files eligible for VACUUM, though actual platform/table configuration matters.

Conceptually:

```
Today
Sep 20
│
├── Sep 20 files   KEEP
├── Sep 19 files   KEEP
├── Sep 18 files   KEEP
├── Sep 17 files   KEEP
├── ...
├── Sep 14 files   KEEP
│
└── sufficiently old
        ↓
potentially eligible
for VACUUM if unreferenced
```

The crucial point is:

> **VACUUM doesn't delete a file merely because it's old. It targets files no longer referenced by the current table and beyond the applicable retention threshold.**

---

# 7. Why not `VACUUM RETAIN 0 HOURS`?

You may encounter commands like:

```
VACUUM gold RETAIN 0 HOURS;
```

Conceptually this says:

> Delete eligible unreferenced files immediately rather than preserving the normal safety window.

That's dangerous in real systems.

Why?

Because old files may still be required for:

```
Time Travel
Concurrent operations
Recovery
Long-running readers
```

Delta implementations/platforms therefore commonly include retention safety checks.

For interviews, don't say:

> "I always VACUUM with zero hours."

That's a red flag.

Say:

> **Retention should be chosen according to recovery/time-travel requirements and workload behavior.**

---

# 8. Pipeline Example

Imagine our Gold pipeline runs every night:

```
DAY 1

Silver
  ↓
Gold Version 1
A B


DAY 2

Silver
  ↓
OVERWRITE
  ↓
Gold Version 2
C D

A B remain physically


DAY 3

Silver
  ↓
OVERWRITE
  ↓
Gold Version 3
E F

A B C D remain physically
```

After many runs:

```
Object Storage
│
├── Old files
├── Old files
├── Old files
├── Old files
│
├── Current files
│
└── _delta_log/
```

Eventually:

```
        VACUUM
           ↓
Check which files are
no longer referenced
           ↓
Check retention age
           ↓
Physically delete
eligible obsolete files
           ↓
Reduce wasted storage
```

---

# 9. DELETE vs VACUUM

This is a very useful interview distinction.

Suppose transaction `101` should be removed.

### DELETE

```
DELETE FROM silver
WHERE transaction_id = 101;
```

means:

> **Remove transaction 101 from the logical table state.**

It changes the **data represented by the table**.

### VACUUM

```sql
VACUUM silver;
```

means:

> **Clean up obsolete physical files that Delta no longer needs within the applicable retention window.**

VACUUM doesn't mean:

```sql
DELETE WHERE ...
```

It isn't a business-data filtering operation.

---

# 10. OVERWRITE → Time Travel → VACUUM

These three concepts now connect beautifully:

```
              OVERWRITE
                  ↓
         New files are written
                  ↓
        Old files become logically
             unreferenced
                  ↓
         Old files remain around
                  ↓
            TIME TRAVEL
        may use historical files
                  ↓
            Time passes
                  ↓
               VACUUM
                  ↓
       Permanently delete eligible
           obsolete files
                  ↓
       Older time travel may
        no longer be possible
```

This is exactly why learning Delta operations in pipeline order is useful.

---

# 11. Interview Answer

### "What is VACUUM in Delta Lake?"

> **VACUUM is a Delta Lake maintenance operation that permanently removes old data files that are no longer referenced by the current state of a Delta table and are beyond the configured retention period. Delta retains old files after operations such as UPDATE, DELETE, MERGE, or OVERWRITE so that previous table versions can support features such as time travel. Over time those obsolete files consume storage, so VACUUM is used to clean them up. The trade-off is that once the required historical files are physically removed, older versions depending on them can no longer be queried or restored.**

If they ask:

### "Is VACUUM a DML or write operation?"

Say:

> **"No. I would classify VACUUM as a Delta Lake table-maintenance and storage-cleanup operation. DML modifies logical table data, while VACUUM physically cleans obsolete files that are no longer needed according to the retention policy."**

## Quick Revision

```
UPDATE / DELETE / MERGE / OVERWRITE
                 ↓
          New table version
                 ↓
     Some old Parquet files
      become unreferenced
                 ↓
        KEEP THEM TEMPORARILY
                 ↓
           Time Travel
           Recovery etc.
                 ↓
          Retention passes
                 ↓
             VACUUM
                 ↓
      Physically delete eligible
         obsolete data files
```

### One-line memory trick

> **DELETE removes data from the table. VACUUM removes obsolete files from storage.**

---

# PySpark Example — VACUUM

> [!example] PySpark / DeltaTable API
> Unlike `OPTIMIZE`, `VACUUM` has a direct `DeltaTable.vacuum()` Python API.

### SQL

```sql
VACUUM silver_transactions;
```

### PySpark — table registered by name

```python
from delta.tables import DeltaTable

delta_table = DeltaTable.forName(spark, "silver_transactions")

delta_table.vacuum()
```

### PySpark — table stored by path

```python
from delta.tables import DeltaTable

delta_table = DeltaTable.forPath(
    spark,
    "/data/silver/transactions"
)

delta_table.vacuum()
```

### Specify a retention period

```python
delta_table.vacuum(168)
```

Here `168` means **168 hours = 7 days**. Files that are still required by the current table state are not simply deleted because of their age; VACUUM targets obsolete files according to the applicable retention rules.

Pipeline connection:

```text
UPDATE / DELETE / MERGE / OVERWRITE / OPTIMIZE
                    ↓
       Some old files become unreferenced
                    ↓
          Retained for table history
                    ↓
             Retention passes
                    ↓
         delta_table.vacuum()
                    ↓
     Eligible obsolete files deleted
```

> [!warning]
> Do not reduce the retention period casually. Historical versions may depend on those files, and concurrent or lagging workloads can also require a safe retention window.

### SQL through a PySpark session

```python
spark.sql("VACUUM silver_transactions")
```

> [!tip] Memory Trick
> `DELETE` changes the **logical rows**.  
> `VACUUM` cleans the **obsolete physical files**.

