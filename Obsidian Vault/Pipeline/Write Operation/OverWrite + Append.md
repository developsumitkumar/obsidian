# 1. What does OVERWRITE do?

Let's use our existing pipeline:

```
Bronze
   ↓
Silver
   ↓
Aggregate
   ↓
Gold
```

Suppose Gold currently contains:

```
month      category     total
--------------------------------
2026-01    Food          5,000
2026-01    Travel        8,000
2026-02    Food          7,000
2026-02    Shopping     12,000
```

We run:

```
silver_full = spark.read.format("delta").load(silver_path)

gold_df = build_monthly_spending(silver_full)
```

Spark recalculates Gold and produces:

```
gold_df

month      category     total
--------------------------------
2026-01    Food          5,000
2026-01    Travel        8,000
2026-02    Food          8,000
2026-02    Shopping     12,000
2026-03    Food          4,000
```

Now:

```python
gold_df.write \
    .format("delta") \
    .mode("overwrite") \
    .save(gold_path)
```

means:

```
OLD GOLD
   ↓
REPLACE
   ↓
NEW GOLD
```

After the operation, the new Gold dataset becomes the current table state.

---

# 2. OVERWRITE vs APPEND

This comparison makes `OVERWRITE` much easier to understand.

Suppose existing Gold contains:

```
January
February
```

and your DataFrame contains:

```
January
February
March
```

### APPEND

```
.mode("append")
```

means:

```
Existing
January
February

    +

New Data
January
February
March

    ↓

January
February
January    ← duplicate!
February   ← duplicate!
March
```

That's wrong if your DataFrame represents a complete rebuilt Gold table.

### OVERWRITE

```python
.mode("overwrite")
```

means:

```
OLD
January
February
       ↓
   REPLACE
       ↓
NEW
January
February
March
```

Exactly what we want for a **full recompute**.

---

# 3. Why are we using OVERWRITE in our Gold pipeline?

Remember our current architecture:

```
             SILVER
         Entire History
              ↓
       Read Everything
              ↓
 build_monthly_spending()
              ↓
      Complete New Gold
              ↓
          OVERWRITE
              ↓
             GOLD
```

The key phrase is:

> **Complete New Gold**

We're not calculating only today's Gold records.

We're recalculating **the entire Gold dataset from Silver**.

Therefore, overwriting the previous Gold table is logical.

For example:

```
Silver Full History
        ↓
GROUP BY month, category
        ↓
gold_df

Jan Food       5000
Jan Travel     8000
Feb Food       7000
Feb Shopping  12000
Mar Food       4000
```

`gold_df` represents the complete desired state.

So we can say:

> "This is what Gold should look like now. Replace the previous result."

That's `OVERWRITE`.

---

# 4. OVERWRITE vs UPDATE

These are very different.

Suppose Gold contains:

```
Jan Food     5000
Feb Food     7000
Mar Food     4000
```

We discover February should be `7500`.

### UPDATE

Targets a specific existing row:

```
UPDATE gold
SET total = 7500
WHERE month = '2026-02'
AND category = 'Food';
```

Conceptually:

```
Jan Food     5000     unchanged
Feb Food     7500     ← changed
Mar Food     4000     unchanged
```

### OVERWRITE

Instead, we generate the complete desired dataset:

```
Jan Food     5000
Feb Food     7500
Mar Food     4000
```

and replace the target dataset/table contents with it.

So remember:

```
UPDATE
"Change particular existing rows."

OVERWRITE
"Replace the target data with this new result."
```

---

# 5. OVERWRITE vs MERGE

This connects directly to our previous lesson.

### Current small pipeline

```
ALL Silver
    ↓
Recalculate ALL Gold
    ↓
OVERWRITE Gold
```

Suppose Gold has 100 rows.

Recalculate 100 rows → replace Gold.

Perfectly reasonable.

---

### Future large pipeline

Imagine Gold contains:

```
10 million aggregate rows
```

and only September changed.

Rebuilding everything becomes wasteful.

Instead:

```
Silver Increment
       ↓
Identify affected month
       ↓
September
       ↓
Recalculate September
       ↓
MERGE
       ↓
Existing Gold
```

Now:

```
Old months → untouched

September existing rows
        ↓
UPDATE

September new rows
        ↓
INSERT
```

So:

```
OVERWRITE
    ↓
Replace everything

MERGE
    ↓
Change only what's necessary
```

---

# 6. Important Delta Lake Detail

There's one subtlety worth understanding.

With ordinary files, you can mentally imagine:

```
DELETE OLD FILES
      ↓
WRITE NEW FILES
```

With a **Delta table**, overwrite is transactional.

Suppose current Gold is:

```
Version 10

A.parquet
B.parquet
C.parquet
```

You overwrite it with newly calculated Gold.

Delta may conceptually create:

```
D.parquet
E.parquet
F.parquet
```

and record in `_delta_log` that the old files were removed from the **new logical table state** and the new files were added.

```
_delta_log

Version 11

REMOVE A
REMOVE B
REMOVE C

ADD D
ADD E
ADD F
```

Current table:

```
Version 11

D
E
F
```

The old files may physically remain for some time.

Why?

Because Delta may need them for:

```
Time Travel
RESTORE
Older versions
```

This will connect beautifully when we learn **VACUUM**.

---

# 7. Full Overwrite vs Selective Overwrite

There's also a more advanced distinction.

A normal full overwrite conceptually says:

```
Replace the entire dataset
```

But Spark/Delta can also support patterns where only specific partitions or rows satisfying a condition are replaced.

For example, if data is partitioned by month, you might want:

```
Replace September

but

DO NOT TOUCH
January-August
```

That's a **selective/dynamic overwrite pattern**, depending on the API and configuration used.

For now, keep your main mental model simple:

> **Our current Gold pipeline uses full overwrite because we're rebuilding the complete Gold dataset.**

Later, selective overwrite is another possible optimization alongside `MERGE`.

---

# 8. When Should We Use OVERWRITE?

Good use cases include:

**Small derived tables**

```
Silver
   ↓
Recalculate entire Gold
   ↓
OVERWRITE
```

**Complete snapshot loads**

The source gives you a complete authoritative snapshot:

```
Today's complete customer snapshot
             ↓
          OVERWRITE
             ↓
Current customer table
```

**Rebuilding derived datasets**

If the entire target can cheaply and safely be regenerated from upstream data:

```
Source of Truth
      ↓
Recalculate
      ↓
OVERWRITE target
```

---

# 9. When Should We Avoid Full OVERWRITE?

Suppose Silver contains billions of rows and only 0.01% changed.

Doing:

```
Read billions
     ↓
Recalculate everything
     ↓
Overwrite everything
```

could be extremely expensive.

That's when we consider:

```
Incremental processing
Partition-level processing
MERGE
Selective overwrite
```

depending on the workload.

---

# Interview Answer

### "What is OVERWRITE?"

> **"Overwrite is a write mode rather than a standalone DML operation. It replaces existing target data with the output being written. For example, in a Bronze-Silver-Gold pipeline, if I read the full Silver history and completely recompute my Gold aggregates, I can write the resulting DataFrame to Gold using overwrite because that DataFrame represents the complete desired state of Gold. As the dataset scales, I may replace full-table overwrite with incremental processing, MERGE, or selective partition replacement to avoid unnecessary recomputation."**

And if they ask:

### "How is OVERWRITE different from MERGE?"

> **"Overwrite replaces the target data with the newly generated dataset, whereas MERGE compares source and target rows using a matching condition and selectively updates, inserts, or potentially deletes records."**

## Keep this map in your notes

```
                DATA CHANGING OPERATIONS

                    ┌─────────────┐
                    │    DML      │
                    └──────┬──────┘
                           │
          ┌────────┬───────┼───────┐
          ↓        ↓       ↓       ↓
       INSERT    UPDATE   DELETE   MERGE
          │        │       │       │
        Add      Change   Remove  Match +
        rows      rows     rows   take action


                 WRITE BEHAVIOUR

          ┌────────────┬─────────────┐
          ↓            ↓
       APPEND       OVERWRITE
          │            │
      Add output    Replace target
      to existing   with new output
```

**One-line memory trick:**

> **INSERT adds, UPDATE changes, DELETE removes, MERGE decides per match, OVERWRITE replaces the target result.**