#  SQL Mastery Capstone — Real-Time Business Project
### The Complete "Everything You've Learned" Project, Using `Hospital_Records` and `zomato_customers_india`

> This is your **final, cumulative project** — it deliberately combines every topic from the full course: **JOINs, Data Modelling, DDL/DML/DCL/TCL, Window Functions, Subqueries, CASE WHEN, and CTEs.** Nothing here is a toy dataset — it's built entirely on your two real databases, and structured the way an actual Data Analyst/Data Engineer would receive a business request on Day 1 of a job.

---

#  PART A — THE BUSINESS SCENARIO


> "Imagine you've just joined as a Junior Data Analyst. You support TWO business units: a **hospital chain** and a **food delivery company (Zomato-style)**. Your manager doesn't ask you 'please write me a JOIN query' — they ask you real questions like the ones below. Your job is to translate BUSINESS ENGLISH into SQL. That translation skill — not memorizing syntax — is what actually gets you hired and keeps you employed."

This project is split into **5 Milestones**, mirroring how a real analytics project unfolds. Each milestone builds on the last, uses a specific mix of concepts from the course, and ends with a checkpoint deliverable.

---

#  MILESTONE 1 — Data Understanding & Data Modelling Review
### *(Concepts used: Data Modelling, DDL)*

**Business ask:** *"Before you touch any data, draw me the relationships. I want to know how our hospital's data connects, end to end."*

**Task for students:**
1. Draw the full ER diagram for `Hospital_Records` from memory (no peeking): `patient → admission → diagnosis → treatment → prescription → medicine`, plus the side branches `patient → appointment → doctor → doctor_department → department`, and `patient → payment`, `patient → lab_test`, `patient → insurance`.
2. Identify every Primary Key and Foreign Key relationship, and label each relationship's cardinality (1:1, 1:M, M:M).
3. Do the same for `zomato_customers_india` — note that this is a SINGLE flat table (no relationships) — and discuss AS A CLASS why a real production Zomato database would NEVER be built this way (hint: `favourite_cuisine`, `preferred_payment`, `city`/`state` should really be normalized into lookup tables — this is a great callback to your Data Modelling & Normalization session).

**Checkpoint Deliverable:** A hand-drawn (or digital) ER diagram for both databases, submitted before moving to Milestone 2.

---

#  MILESTONE 2 — Data Quality Audit
### *(Concepts used: Subqueries, CASE WHEN, CTEs)*

**Business ask:** *"Before we trust ANY report built on this data, I need to know: how clean is it? Find me anything suspicious."*

### Task 2.1 — Find data quality issues in `treatment`
```sql
SELECT treatment_id, diagnosis_id, cost,
    CASE
        WHEN cost IS NULL THEN 'Missing Cost'
        WHEN cost = 0     THEN 'Zero Cost - Review'
        WHEN cost < 0     THEN 'Invalid Negative Cost'
        ELSE 'OK'
    END AS data_quality_flag
FROM treatment
WHERE cost IS NULL OR cost <= 0;
```

### Task 2.2 — Find duplicate customer signups in `zomato_customers_india`
```sql
WITH duplicate_emails AS (
    SELECT email
    FROM zomato_customers_india
    GROUP BY email
    HAVING COUNT(*) > 1
)
SELECT z.*
FROM zomato_customers_india z
JOIN duplicate_emails d ON d.email = z.email
ORDER BY z.email;
```

### Task 2.3 — Find patients with NO admission, NO appointment, AND NO lab_test (completely "orphan" patient records — possibly test data or data entry errors)
```sql
SELECT p.patient_id, p.first_name, p.last_name
FROM patient p
WHERE NOT EXISTS (SELECT 1 FROM admission a WHERE a.patient_id = p.patient_id)
  AND NOT EXISTS (SELECT 1 FROM appointment ap WHERE ap.patient_id = p.patient_id)
  AND NOT EXISTS (SELECT 1 FROM lab_test l WHERE l.patient_id = p.patient_id);
```

**Discussion point for class:** This task deliberately combines THREE `NOT EXISTS` checks with `AND` — ask students to explain, in plain English, why `AND` (not `OR`) is correct here. *(Answer: we want patients who fail ALL three checks — completely disconnected from the system — not patients missing just ONE type of record.)*

**Checkpoint Deliverable:** A short "Data Quality Report" (3-5 bullet points) summarizing what issues were found and how many rows are affected by each.

---

#  MILESTONE 3 — Core Business Reporting
### *(Concepts used: JOINs, GROUP BY, CASE WHEN, Conditional Aggregation)*

**Business ask:** *"I need our first real dashboard. Show me hospital revenue and Zomato customer health side by side."*

### Task 3.1 — Hospital: Revenue breakdown by bill status, with a health check flag
```sql
SELECT
    SUM(CASE WHEN bill_status = 'Paid'    THEN total_amount ELSE 0 END) AS total_paid,
    SUM(CASE WHEN bill_status = 'Pending' THEN total_amount ELSE 0 END) AS total_pending,
    COUNT(CASE WHEN bill_status = 'Pending' THEN 1 END) AS pending_bill_count,
    CASE
        WHEN SUM(CASE WHEN bill_status = 'Pending' THEN total_amount ELSE 0 END)
             > SUM(CASE WHEN bill_status = 'Paid' THEN total_amount ELSE 0 END) * 0.25
        THEN 'Collections Risk - Review'
        ELSE 'Healthy'
    END AS collections_health
FROM payment;
```

### Task 3.2 — Hospital: Department-wise appointment volume and completion rate
```sql
SELECT d.department_name,
    COUNT(*) AS total_appointments,
    COUNT(CASE WHEN ap.appoinment_status = 'Completed' THEN 1 END) AS completed_appointments,
    ROUND(
        COUNT(CASE WHEN ap.appoinment_status = 'Completed' THEN 1 END) * 100.0 / COUNT(*), 2
    ) AS completion_rate_pct
FROM appointment ap
JOIN doctor doc ON doc.doctor_id = ap.doctor_id
JOIN doctor_department dd ON dd.doctor_id = doc.doctor_id
JOIN department d ON d.department_id = dd.department_id
GROUP BY d.department_name
ORDER BY completion_rate_pct DESC;
```

### Task 3.3 — Zomato: City-wise customer health snapshot
```sql
SELECT city,
    COUNT(*) AS total_customers,
    COUNT(CASE WHEN is_verified = 1 THEN 1 END) AS verified_customers,
    ROUND(AVG(total_spent), 2) AS avg_spend,
    ROUND(AVG(total_orders), 1) AS avg_orders,
    CASE
        WHEN AVG(total_spent) >= 30000 THEN 'High-Value City'
        WHEN AVG(total_spent) >= 15000 THEN 'Growing City'
        ELSE 'Emerging City'
    END AS city_tier
FROM zomato_customers_india
GROUP BY city
ORDER BY avg_spend DESC;
```

**Checkpoint Deliverable:** Students run all three queries and write ONE sentence per query explaining, in business language (not SQL language), what the output tells management.

---

#  MILESTONE 4 — Advanced Analytics
### *(Concepts used: Window Functions, CTEs, Correlated Subqueries)*

**Business ask:** *"Basic reports are done. Now I need RANKINGS, TRENDS, and OUTLIERS — the kind of insight that actually changes decisions."*

### Task 4.1 — Hospital: Top treatment (by cost) per diagnosis, with rank
```sql
WITH ranked_treatments AS (
    SELECT t.treatment_id, t.diagnosis_id, d.diagnosis_name, t.treatment_name, t.cost,
        RANK() OVER (PARTITION BY t.diagnosis_id ORDER BY t.cost DESC) AS cost_rank
    FROM treatment t
    JOIN diagnosis d ON d.diagnosis_id = t.diagnosis_id
)
SELECT diagnosis_name, treatment_name, cost
FROM ranked_treatments
WHERE cost_rank = 1
ORDER BY cost DESC;
```

### Task 4.2 — Hospital: Running total of monthly collections (trend line for a chart)
```sql
WITH monthly_totals AS (
    SELECT DATE_FORMAT(bill_date, '%Y-%m') AS bill_month, SUM(total_amount) AS monthly_total
    FROM payment
    WHERE bill_status = 'Paid'
    GROUP BY DATE_FORMAT(bill_date, '%Y-%m')
)
SELECT bill_month, monthly_total,
    SUM(monthly_total) OVER (ORDER BY bill_month) AS running_total,
    LAG(monthly_total) OVER (ORDER BY bill_month) AS previous_month,
    monthly_total - LAG(monthly_total) OVER (ORDER BY bill_month) AS month_over_month_change
FROM monthly_totals
ORDER BY bill_month;
```

### Task 4.3 — Zomato: Top spender per city (full row, no window-function shortcuts — correlated subquery version, for interview practice)
```sql
SELECT c1.id, c1.name, c1.city, c1.total_spent
FROM zomato_customers_india c1
WHERE c1.total_spent = (
    SELECT MAX(c2.total_spent)
    FROM zomato_customers_india c2
    WHERE c2.city = c1.city
);
```

### Task 4.4 — Zomato: Loyalty tier assignment, ranked within tier, verified only
```sql
WITH tiered_customers AS (
    SELECT id, name, city, total_spent, is_verified,
        CASE
            WHEN total_spent >= 40000 THEN 'Gold'
            WHEN total_spent >= 15000 THEN 'Silver'
            ELSE 'Bronze'
        END AS loyalty_tier
    FROM zomato_customers_india
    WHERE is_verified = 1
)
SELECT *,
    RANK() OVER (PARTITION BY loyalty_tier ORDER BY total_spent DESC) AS rank_in_tier
FROM tiered_customers
ORDER BY
    CASE loyalty_tier WHEN 'Gold' THEN 1 WHEN 'Silver' THEN 2 ELSE 3 END,
    rank_in_tier;
```



---

#  MILESTONE 5 — The Executive Summary Query
### *(Concepts used: EVERYTHING — final capstone query)*

**Business ask:** *"I have 5 minutes with the CEO tomorrow. Give me ONE query that tells the whole Zomato customer story — tiering, verification, city ranking, and revenue contribution — all at once."*

This is the **hardest single query in the entire course** — intentionally combining CTE chaining, CASE WHEN, window functions, and conditional aggregation into one production-realistic report.

```sql
WITH city_avg AS (
    SELECT city, AVG(total_spent) AS avg_spend
    FROM zomato_customers_india
    WHERE is_verified = 1
    GROUP BY city
),
customer_tiers AS (
    SELECT c.id, c.name, c.city, c.total_spent, c.total_orders, c.is_verified,
        CASE
            WHEN c.total_spent >= 40000 THEN 'Gold'
            WHEN c.total_spent >= 15000 THEN 'Silver'
            ELSE 'Bronze'
        END AS loyalty_tier,
        CASE
            WHEN c.total_spent > ca.avg_spend THEN 'Above City Average'
            ELSE 'Below City Average'
        END AS vs_city_avg
    FROM zomato_customers_india c
    JOIN city_avg ca ON ca.city = c.city
    WHERE c.is_verified = 1
),
ranked_final AS (
    SELECT *,
        RANK() OVER (PARTITION BY city ORDER BY total_spent DESC) AS city_rank
    FROM customer_tiers
)
SELECT loyalty_tier,
    COUNT(*) AS customer_count,
    ROUND(SUM(total_spent), 2) AS tier_total_revenue,
    ROUND(AVG(total_spent), 2) AS tier_avg_spend,
    COUNT(CASE WHEN vs_city_avg = 'Above City Average' THEN 1 END) AS above_city_avg_count,
    COUNT(CASE WHEN city_rank = 1 THEN 1 END) AS number_1_in_their_city_count
FROM ranked_final
GROUP BY loyalty_tier
ORDER BY CASE loyalty_tier WHEN 'Gold' THEN 1 WHEN 'Silver' THEN 2 ELSE 3 END;
```

**What this single query demonstrates, concept by concept:**

| Concept                 | Where it appears                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| CTE chaining            | `city_avg` → `customer_tiers` → `ranked_final` (3 stages)                                               |
| CASE WHEN               | Loyalty tier labeling, above/below average labeling, custom ORDER BY sort                               |
| Window Function         | `RANK() OVER (PARTITION BY city ORDER BY total_spent DESC)`                                             |
| Conditional Aggregation | `COUNT(CASE WHEN...)` used twice in the final SELECT                                                    |
| JOIN                    | `customer_tiers` joining the customer table to the pre-aggregated `city_avg`                            |
| Filtering discipline    | `is_verified = 1` applied consistently at the SOURCE (inside `city_avg` too, not just the final output) |

**Checkpoint Deliverable (Final Project Submission):** We must, WITHOUT looking at this answer key, independently write a query of similar complexity answering: *"For each `admission_type` in the Hospital database, show patient count, total billing revenue, percentage of bills still Pending, and the single highest-cost treatment associated with that admission type."* This forces them to replicate the SAME multi-concept structure on a different dataset — proving genuine understanding, not memorization.

---

#  PART B — YOUR LIFETIME SQL REFERENCE
### *(Keep this section forever — it's your fast-recall map of the entire course)*

##  The Full Course, One Page

| # | Topic | Core Question It Answers | Your Go-To Pattern |
|---|---|---|---|
| 1 | **JOINs** | "I need data spread across multiple tables, combined." | `INNER/LEFT/RIGHT/FULL JOIN ... ON A.key = B.key` |
| 2 | **Data Modelling** | "How should my tables and relationships be structured?" | Entities → Attributes → PK/FK → Normalize (OLTP) or Denormalize (OLAP) |
| 3 | **DDL/DML/DCL/TCL/DQL** | "What TYPE of SQL command am I about to run, and how risky is it?" | Build=DDL, Change=DML, Access=DCL, Finalize/Undo=TCL, Read=DQL |
| 4 | **Window Functions** | "I need a calculation ACROSS rows, without collapsing them." | `FUNC() OVER (PARTITION BY ... ORDER BY ...)` |
| 5 | **Subqueries** | "I need to answer a smaller question FIRST, to answer the real question." | Scalar in WHERE / `IN` for lists / `EXISTS` for presence-absence |
| 6 | **CASE WHEN** | "I need custom IF-THEN-ELSE labeling logic." | `CASE WHEN cond THEN val ... ELSE default END` |
| 7 | **CTE** | "My subqueries are getting too nested to read." | `WITH stage1 AS (...), stage2 AS (...) SELECT ... FROM stage2` |

##  The 10 Silent Bugs That Catch Even Experienced Developers

1. **`NOT IN` + NULL in the subquery = entire query silently returns ZERO rows.** Always prefer `NOT EXISTS`.
2. **`WHERE` filter on a LEFT JOIN's right-table column silently turns it into an INNER JOIN.** Put the condition in `ON` instead.
3. **`WHEN` conditions in the wrong order in CASE WHEN** — a broader condition placed too early "steals" rows meant for a more specific one below it.
4. **`= NULL` never matches anything** — always use `IS NULL` / `IS NOT NULL`.
5. **Window functions cannot be filtered directly in `WHERE`** — wrap in a CTE/subquery and filter in the outer query.
6. **`SUM() OVER (PARTITION BY x)` without `ORDER BY`** gives the FLAT group total on every row, not a running total — add `ORDER BY` for cumulative behavior.
7. **`TRUNCATE` is DDL, not DML** — it resets table storage and generally can't be rolled back the way `DELETE` can.
8. **Recursive CTE with no stopping condition** = infinite recursion risk.
9. **Correlated subqueries recalculate PER OUTER ROW** — fine on 201 test rows, potentially very slow on millions in production. Know when to rewrite as a JOIN.
10. **`coverage_amount` in your `insurance` table is stored as VARCHAR, not a number** — always check a column's real data type before running `AVG()`/`SUM()`/comparisons on it; `CAST()` first if needed.

##  The One-Line Summary of Every Topic (for last-minute interview revision)

> **JOIN** — combine tables by matching a common column.
> **Data Modelling** — draw the blueprint before you build; normalize for consistency, denormalize for speed.
> **DDL/DML/DCL/TCL/DQL** — Build it / Change it / Control who touches it / Make it final or undo it / Just look at it.
> **Window Function** — calculate across related rows WITHOUT collapsing them.
> **Subquery** — answer the smaller question your main question depends on.
> **CASE WHEN** — SQL's IF-THEN-ELSE; order matters, first true condition wins.
> **CTE** — name each step of your thinking like a recipe, instead of nesting brackets.

##  Final Confidence Checklist — We Should Be Able To, Without Notes:

- [ ] Write a query joining 3+ tables and explain what happens to unmatched rows in each JOIN type.
- [ ] Draw an ER diagram for any 4-5 table business scenario from a one-paragraph description.
- [ ] Explain the risk level of any SQL command (DDL/DML/DCL/TCL/DQL) before running it.
- [ ] Write a query ranking rows within groups using a window function, AND explain RANK vs DENSE_RANK.
- [ ] Write a correlated subquery AND explain why it's slower than an equivalent JOIN at scale.
- [ ] Build a CASE WHEN with correctly ordered conditions, with ELSE, without the NULL trap.
- [ ] Refactor a 3-level nested subquery into a clean, chained CTE.
- [ ] Combine AT LEAST 3 of the above concepts into ONE query, like Milestone 5 above.

---

##  What should you remember forever from this entire course?

> **"SQL isn't about memorizing syntax — it's about translating a business question into a structured question a database can answer. Every topic in this course — JOINs, Subqueries, CTEs, Window Functions, CASE WHEN — is just a different TOOL for that same translation job. The real skill is knowing WHICH tool fits WHICH business question — and that only comes from practicing on real, messy, multi-table data like the two databases you've been working with all along."**




