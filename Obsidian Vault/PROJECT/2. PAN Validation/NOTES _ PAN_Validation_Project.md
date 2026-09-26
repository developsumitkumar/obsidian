---
title: PAN Number Validation — SQL Project Notes
tags:
  - sql
  - postgresql
  - regex
  - data-cleaning
  - project
date: 2026-09-04
---

# PAN Number Validation — SQL Project

> [!info] Goal
> Clean 10,000 raw PAN entries → validate against format `AAAAA1234A` → categorize Valid/Invalid → summary report. All in PostgreSQL.


## 1. Data Cleaning

```sql
SELECT * FROM stg_pan_numbers_dataset WHERE pan_number IS NULL;          -- 965 missing
SELECT pan_number, COUNT(1) FROM stg_pan_numbers_dataset
GROUP BY pan_number HAVING COUNT(1) > 1;                                  -- 6 duplicate groups
SELECT * FROM stg_pan_numbers_dataset WHERE pan_number <> trim(pan_number); -- 9 space issues
SELECT * FROM stg_pan_numbers_dataset WHERE pan_number <> upper(pan_number); -- 990 case issues
```

**Cleaned table:**
```sql
SELECT DISTINCT upper(trim(pan_number)) AS pan_number
FROM stg_pan_numbers_dataset
WHERE pan_number IS NOT NULL AND trim(pan_number) <> '';
-- 9025 rows
```

> [!question]- Doubt: is `trim(pan_number) <> ''` even needed if we later check `length = 10`?
> No — redundant for format validation. A space fails `[A-Z]`/`[0-9]` regex anyway, so `length=10` + the character-class checks already reject space-padded PANs. `trim <> ''` matters only *upstream*, to discard pure-blank junk before validation even starts.

---

## 2. Format Validation — building blocks

| Rule | Tool |
|---|---|
| Exact length | `length(pan_number) = 10` |
| Isolate a section | `substring(str, start, length)` |
| Match a pattern | `~` (matches) / `!~` (does not match) |
| Full-string anchor | `^...$` — required or partial matches sneak through |

> [!example] Hint — why `^` and `$` both matter
> `'75B6' ~ '^[0-9]'` → **true** (only checks the *first* char!)
> `'75B6' ~ '^[0-9]{4}$'` → **false** (correctly checks all 4, start to end)

```sql
-- first 5 = letters
substring(pan_number, 1, 5) ~ '^[A-Z]{5}$'
-- next 4 = digits
substring(pan_number, 6, 4) ~ '^[0-9]{4}$'
-- last char = letter
substring(pan_number, 10, 1) ~ '^[A-Z]{1}$'
```

> [!question]- Doubt: does `!=` work instead of `!~` for pattern checks?
> No — `!=`/`=` compare exact literal text only. `'ABC' != '^[A-Z]{3}$'` is true simply because the strings differ character-for-character; it never interprets `^`, `[]`, `{}` as regex syntax. Only `~`/`!~` understand regex.

### Adjacent repetition & sequence — needs real functions, not just regex

```sql
create or replace function fn_check_adjacent_repetition(p_str text)
returns boolean language plpgsql as $$
begin
  for i in 1 .. (length(p_str) - 1) loop
    if substring(p_str,i,1) = substring(p_str,i+1,1) then return true; end if;
  end loop;
  return false;
end; $$;
```
Loops through each character, compares to its neighbor. `true` = bad (repeat found).

```sql
create or replace function fn_check_sequence(p_str text)
returns boolean language plpgsql as $$
begin
  for i in 1 .. (length(p_str) - 1) loop
    if ascii(substring(p_str,i+1,1)) - ascii(substring(p_str,i,1)) <> 1 then return false; end if;
  end loop;
  return true;
end; $$;
```
Uses `ascii()` — consecutive letters always differ by exactly 1. `true` = bad (is a sequence).

> [!question]- Doubt: `AND` vs `OR` when combining "not repeating" + "not sequence"?
> Need **`AND`**: both "no repetition" AND "no sequence" must hold together for a PAN to be clean. `OR` wrongly lets a PAN pass if it's clean on just *one* of the two rules while failing the other.

> [!question]- Doubt: does `length(pan_number)=10` alone guard against short/long strings?
> No — a malformed string could pass individual substring checks by coincidence (e.g. position 10 of an 11-char string might still be a letter). Explicit `length(pan_number) = 10` is a **required**, separate condition — not automatically implied by the substring checks.

### Full valid-PAN query
```sql
WITH pan AS (
  SELECT pan_number FROM stg_pan_numbers_dataset
  WHERE pan_number IS NOT NULL AND length(pan_number) = 10
  AND fn_check_adjacent_repetition(substring(pan_number,1,5)) = false
  AND fn_check_sequence(substring(pan_number,1,5)) = false
  AND fn_check_adjacent_repetition(substring(pan_number,6,4)) = false
  AND fn_check_sequence(substring(pan_number,6,4)) = false
)
SELECT DISTINCT pan_number FROM pan
WHERE substring(pan_number,1,5) ~ '^[A-Z]{5}$'
AND substring(pan_number,6,4) ~ '^[0-9]{4}$'
AND substring(pan_number,10,1) ~ '^[A-Z]{1}$';
-- 3180 valid rows
```

---

## 3. Categorization — LEFT JOIN + CASE WHEN

> [!tip] Concept
> `LEFT JOIN` cleaned (everyone) → valid (only the good ones). No match on the right (`NULL`) = Invalid.

```sql
WITH cleaned AS (...), pan AS (...), valid AS (...),
categorized AS (
    SELECT cleaned.pan_number,
           CASE WHEN valid.pan_number IS NULL THEN 'Invalid PAN' ELSE 'Valid PAN' END AS status
    FROM cleaned LEFT JOIN valid ON valid.pan_number = cleaned.pan_number
)
SELECT status, COUNT(*) FROM categorized GROUP BY status;
-- Invalid PAN: 5845 | Valid PAN: 3180
```

> [!question]- Doubt: can a CTE contain its own nested `WITH` inside it?
> No — flatten everything into **one** `WITH`, chaining CTEs by commas as siblings (`cleaned`, `pan`, `valid`, `categorized`, ...), never `WITH` inside another CTE's body.

---

## 4. Summary Report — `COUNT(*) FILTER (WHERE ...)`

> [!example] Hint — FILTER in one pass vs. separate subqueries
> ```sql
> SELECT
>   COUNT(*) AS total,
>   COUNT(*) FILTER (WHERE age >= 18) AS adults,
>   COUNT(*) FILTER (WHERE age < 18) AS minors
> FROM people;
> ```
> One scan, multiple conditional counts — cleaner than 3 separate `(SELECT COUNT... WHERE...)` subqueries.

```sql
WITH cleaned AS (...), pan AS (...), valid AS (...), categorized AS (...),
report AS (
    SELECT
        (SELECT COUNT(*) FROM stg_pan_numbers_dataset) AS total_processed_records,
        COUNT(*) FILTER (WHERE status = 'Valid PAN') AS total_valid_pans,
        COUNT(*) FILTER (WHERE status = 'Invalid PAN') AS total_invalid_pans
    FROM categorized
)
SELECT total_processed_records, total_valid_pans, total_invalid_pans,
       total_processed_records - (total_valid_pans + total_invalid_pans) AS missing_incomplete_pans
FROM report;
```

**Final numbers:** 10000 total → 3180 valid + 5845 invalid + 975 missing/blank.

---

## Related
- [[SQL Data Modelling Complete Training Guide]]
- [[PySpark Tutorial Notes]]
