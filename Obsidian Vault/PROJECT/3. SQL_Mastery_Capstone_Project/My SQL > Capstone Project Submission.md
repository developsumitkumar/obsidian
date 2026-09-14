




# PART A — THE BUSINESS SCENARIO
##  MILESTONE 1 — Data Understanding & Data Modelling Review



1. Hospital Records ER Diagram 
This ER diagram maps `Hospital_Records`' 13 tables and their PK/FK relationships, using standard entity-box notation with cardinality labels (1:M). It highlights `Doctor_Department` and `Prescription` as junction tables resolving many-to-many relationships, and flags `Payment.patient_id` as a joinable but _undeclared_ foreign key — a genuine referential-integrity gap in the schema.
   
   ROUGH
![[Pasted image 20260914063310.png]]


 FINAL
![[Hospital_Records_ERD 1.png]]


2. Zomato Table (Technically NO ER Diagram)
   
   ![[Pasted image 20260914064033.png]]


This is a flat table (a single table) , it has many columns which seems the table to be complete but in flat tables there are no real relationships. When we are dealing with a small module/operation this table can still be relevant. But with increasing scope of data handling and management this is the exact issue with the schema here.



##  MILESTONE 2 — Data Quality Audit


Task 2.1 — Find data quality issues in `treatment`
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
![[Pasted image 20260914064915.png|700]]



Task 2.2 — Find duplicate customer signups in `zomato_customers_india`
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

![[Pasted image 20260914065300.png]]


--- 


# MILESTONE 3 — Core Business Reporting


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
![[Pasted image 20260914081035.png]]


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

![[Pasted image 20260914081144.png]]



--- 

### Task 3.3 — Zomato: City-wise customer health snapshot

### Postgre SQL
![[Pasted image 20260914083437.png]]
```sql
SELECT city,
    COUNT(*) AS total_customers,
    COUNT(CASE WHEN is_verified = true THEN 1 END) AS verified_customers,
    ROUND(AVG(total_spent)::numeric, 2) AS avg_spend,
    ROUND(AVG(total_orders)::numeric, 1) AS avg_orders,
    CASE
        WHEN AVG(total_spent) >= 30000 THEN 'High-Value City'
        WHEN AVG(total_spent) >= 15000 THEN 'Growing City'
        ELSE 'Emerging City'
    END AS city_tier
FROM zomato_customers_india
GROUP BY city
ORDER BY avg_spend DESC;
```
`total_spent` is stored as `FLOAT` / `double precision`. Postgres's two-argument `ROUND(value, decimal_places)` function is only defined for the `numeric` type — not for `double precision`. MySQL rounds floats directly without complaint; Postgres requires an explicit cast first.

> [!tip] `::numeric` actually is `::type` is Postgres's shorthand cast syntax — functionally identical to `CAST(value AS type)` in standard SQL, or `.cast()` in PySpark. It converts the floating-point average into the `numeric` type that the two-argument `ROUND()` actually supports.

> [!warning] 
`::type` cast — Postgres demands type precision that MySQL quietly fills in for you. Check boolean comparisons and float/numeric arguments first; that's where this bites most often.

### SQL
![[Pasted image 20260914084030.png]]
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


---

#  MILESTONE 4 — Advanced Analytics


### Task 4.1 — Hospital: Top treatment (by cost) per diagnosis, with rank

![[Pasted image 20260914084320.png]]
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

![[Pasted image 20260914090448.png]]

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



-- corrected code with YYYY- MM

WITH monthly_totals AS (

SELECT DATE_FORMAT(bill_date, 'YYYY-MM') AS bill_month, SUM(total_amount) AS monthly_total

FROM payment

WHERE bill_status = 'Paid'

GROUP BY DATE_FORMAT(bill_date, 'YYYY-MM')

)

SELECT bill_month, monthly_total,

SUM(monthly_total) OVER (ORDER BY bill_month) AS running_total,

LAG(monthly_total) OVER (ORDER BY bill_month) AS previous_month,

monthly_total - LAG(monthly_total) OVER (ORDER BY bill_month) AS month_over_month_change

FROM monthly_totals

ORDER BY bill_month;
```
> [!warning] 
> -- corrected code with YYYY- MM




### Task 4.3 — Zomato: Top spender per city (full row, no window-function shortcuts — correlated subquery version, for interview practice)

![[Pasted image 20260914090805.png]]

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

![[Pasted image 20260914092617.png]]
```sql
WITH tiered_customers AS (
    SELECT id, name, city, total_spent, is_verified,
        CASE
            WHEN total_spent >= 40000 THEN 'Gold'
            WHEN total_spent >= 15000 THEN 'Silver'
            ELSE 'Bronze'
        END AS loyalty_tier
    FROM zomato_customers_india
    WHERE is_verified = true  -- boolean as integer casting 
)
SELECT *,
    RANK() OVER (PARTITION BY loyalty_tier ORDER BY total_spent DESC) AS rank_in_tier
FROM tiered_customers
ORDER BY
    CASE loyalty_tier WHEN 'Gold' THEN 1 WHEN 'Silver' THEN 2 ELSE 3 END,
    rank_in_tier;
```

![[Pasted image 20260914092703.png]]

---
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
#  MILESTONE 5 — The Executive Summary Query
### *(Concepts used: EVERYTHING — final capstone query)*
PostgreSQL
![[Pasted image 20260914122220.png]]
```sql
WITH city_avg AS (

SELECT city, AVG(total_spent) AS avg_spend

FROM zomato_customers_india

WHERE is_verified = true

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

WHERE c.is_verified = true

),

ranked_final AS (

SELECT *,

RANK() OVER (PARTITION BY city ORDER BY total_spent DESC) AS city_rank

FROM customer_tiers

)

SELECT loyalty_tier,

COUNT(*) AS customer_count,

ROUND(SUM(total_spent)::numeric, 2) AS tier_total_revenue,

ROUND(AVG(total_spent)::numeric, 2) AS tier_avg_spend,

COUNT(CASE WHEN vs_city_avg = 'Above City Average' THEN 1 END) AS above_city_avg_count,

COUNT(CASE WHEN city_rank = 1 THEN 1 END) AS number_1_in_their_city_count

FROM ranked_final

GROUP BY loyalty_tier

ORDER BY CASE loyalty_tier WHEN 'Gold' THEN 1 WHEN 'Silver' THEN 2 ELSE 3 END;
```

MySql(Workbench)
![[Pasted image 20260914122321.png]]
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


## Final Confidence Checklist — We Should Be Able To, Without Notes:

#### - [ ] Write a query joining 3+ tables and explain what happens to unmatched rows in each JOIN type.
1. The 3-table join
![[Pasted image 20260914124456.png]]
```SQL
SELECT p.first_name, p.last_name, a.appoinment_date, a.appoinment_status, d.doctor_name, d.specialization
FROM patient p
INNER JOIN appointment a ON p.patient_id = a.patient_id
INNER JOIN doctor d ON a.doctor_id = d.doctor_id;
```
 2.**INNER JOIN** — a patient with zero appointments disappears entirely from the result, and an appointment pointing to a nonexistent doctor also disappears. Only rows with a match on _both_ joins survive.
 ![[Pasted image 20260914124653.png]]
 ```sql
 -- Patients who HAVE appointments (INNER JOIN drops everyone else silently)
SELECT p.patient_id, p.first_name, a.appoinment_id
FROM patient p
INNER JOIN appointment a ON p.patient_id = a.patient_id;
 ```

3. **LEFT JOIN** — every patient survives, even ones with no appointment. Unmatched rows get `NULL` in every appointment/doctor column
![[Pasted image 20260914124801.png]]
 ```sql
 -- ALL patients, with appointment info if it exists, NULL if not
SELECT p.patient_id, p.first_name, a.appoinment_id, a.appoinment_date
FROM patient p
LEFT JOIN appointment a ON p.patient_id = a.patient_id;
 ```
4. **RIGHT JOIN** — flips the priority: every appointment survives, even one whose `patient_id` doesn't exist in `patient` (a data integrity problem, but the join still shows it with `NULL` patient columns).
![[Pasted image 20260914124856.png]]
```sql
SELECT p.first_name, a.appoinment_id, a.patient_id
FROM patient p
RIGHT JOIN appointment a ON p.patient_id = a.patient_id;
```
5. **ANTI JOIN** (Postgres-specific syntax below, since ANTI isn't standard SQL keyword-wise — usually written as `NOT EXISTS` or `LEFT JOIN ... WHERE right.col IS NULL`) — returns _only_ the unmatched rows: patients who have **never** had an appointment.
![[Pasted image 20260914124957.png]]
```sql
   SELECT p.patient_id, p.first_name
FROM patient p
LEFT JOIN appointment a ON p.patient_id = a.patient_id
WHERE a.appoinment_id IS NULL;
```

#### - [ ] Draw an ER diagram for any 4-5 table business scenario from a one-paragraph description.
###### The scenario

> _A hospital wants to track patient billing. Each **patient** has a first name, last name, date of birth, and email. When a patient is admitted, an **admission** record is created with an admission date, discharge date, and room number — one patient can have multiple admissions over time. During an admission, doctors record one or more **diagnoses**, each with a diagnosis name, date, and severity level, tied to that specific admission. For every diagnosis, the hospital may issue a **payment** record capturing the bill amount, date, and status (Paid/Pending/Cancelled) — though in this hospital's current system, payments are just loosely linked by patient, not tied to any specific diagnosis or admission._
![[Hospital_Billing_ERD_from_paragraph.png|700]]


#### - [ ] Explain the risk level of any SQL command (DDL/DML/DCL/TCL/DQL) before running it.
1. **DQL — read-only, essentially zero risk**
```sql
SELECT * FROM stg_pan_numbers_dataset;
```



2. **DDL — structural changes, risk varies wildly by command**
```sql
CREATE TABLE stg_pan_numbers_dataset (pan_number text);   -- Low risk: additive, creates something new
DROP TABLE stg_pan_numbers_dataset;                        -- HIGH risk: destroys structure + all data inside it, often irreversible
ALTER TABLE patient ADD COLUMN middle_name text;            -- Low-medium risk: additive
ALTER TABLE patient DROP COLUMN email;                      -- HIGH risk: permanently deletes a column and all its data
```



3. **DML — modifies data, risk depends heavily on the WHERE clause**
```sql
INSERT INTO stg_pan_numbers_dataset (pan_number) VALUES ('ABCDE1234F');  -- Low risk: adds one row, easy to identify and undo
UPDATE patient SET email = 'new@mail.com' WHERE patient_id = 5;          -- Medium risk: correct WHERE = safe, wrong/missing WHERE = disaster
DELETE FROM payment WHERE bill_status = 'Cancelled';                      -- Medium-high risk: same WHERE-clause danger, and deletion is harder to undo than update
DELETE FROM payment;                                                       -- HIGH risk: no WHERE = wipes the entire table
```


4. **DCL — controls who can do what**
```sql
GRANT SELECT ON zomato_customers_india TO analyst_role;   -- Low-medium risk: expands access
REVOKE ALL ON zomato_customers_india FROM analyst_role;    -- Medium risk: could lock out legitimate users if run carelessly
```



5. **TCL — manages atomic groups of operations**
```sql
BEGIN;
UPDATE payment SET bill_status = 'Paid' WHERE bill_id = 10;
COMMIT;   -- makes it permanent
-- or:
ROLLBACK;  -- undoes everything since BEGIN, as if it never happened
```


#### - [ ] Write a query ranking rows within groups using a window function, AND explain RANK vs DENSE_RANK.

 1. The query — ranking patients by treatment cost within each diagnosis
```sql
SELECT diagnosis_id, treatment_name, cost,
       RANK() OVER (PARTITION BY diagnosis_id ORDER BY cost DESC) AS rank_within_diagnosis,
       DENSE_RANK() OVER (PARTITION BY diagnosis_id ORDER BY cost DESC) AS dense_rank_within_diagnosis
FROM treatment
ORDER BY diagnosis_id, cost DESC;
```

2. The query — ranking customers by spend within each city
```sql
SELECT city, name, total_spent,
       RANK() OVER (PARTITION BY city ORDER BY total_spent DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY city ORDER BY total_spent DESC) AS dense_rnk
FROM zomato_customers_india
ORDER BY city, total_spent DESC;
```


#### - [ ] Write a correlated subquery AND explain why it's slower than an equivalent JOIN at scale.

The correlated subquery
```sql
SELECT c.name, c.city, c.total_spent
FROM zomato_customers_india c
WHERE c.total_spent > (
    SELECT AVG(c2.total_spent)
    FROM zomato_customers_india c2
    WHERE c2.city = c.city
);
```
![[Pasted image 20260914160202.png]]


The equivalent JOIN version — same result, different mechanism
```sql
SELECT c.name, c.city, c.total_spent
FROM zomato_customers_india c
JOIN (
    SELECT city, AVG(total_spent) AS avg_spend
    FROM zomato_customers_india
    GROUP BY city
) city_avg ON city_avg.city = c.city
WHERE c.total_spent > city_avg.avg_spend;
```
![[Pasted image 20260914160134.png]]

A correlated subquery re-evaluates its inner query once per outer row because it depends on that row's value — at scale, this means potentially thousands of repeated micro-computations over the same data, whereas an equivalent JOIN pre-aggregates once and matches efficiently, doing the same total work in a single pass.



#### - [ ] Build a CASE WHEN with correctly ordered conditions, with ELSE, without the NULL trap.

![[Pasted image 20260914160452.png]]





#### - [ ] Refactor a 3-level nested subquery into a clean, chained CTE.


the 3-level nested version
```sql
SELECT p.first_name, p.last_name
FROM patient p
WHERE p.patient_id IN (
    SELECT a.patient_id
    FROM admission a
    WHERE a.admission_id IN (
        SELECT d.admission_id
        FROM diagnosis d
        WHERE d.diagnosis_id IN (
            SELECT t.diagnosis_id
            FROM treatment t
            WHERE t.cost > (
                SELECT AVG(cost) FROM treatment
            )
        )
    )
);
```
![[Pasted image 20260914160810.png]]



the refactored, chained CTE version
```sql
WITH hospital_avg AS (
    SELECT AVG(cost) AS avg_cost FROM treatment
),
expensive_treatments AS (
    SELECT t.diagnosis_id
    FROM treatment t, hospital_avg
    WHERE t.cost > hospital_avg.avg_cost
),
affected_admissions AS (
    SELECT d.admission_id
    FROM diagnosis d
    JOIN expensive_treatments et ON et.diagnosis_id = d.diagnosis_id
),
affected_patients AS (
    SELECT DISTINCT a.patient_id
    FROM admission a
    JOIN affected_admissions aa ON aa.admission_id = a.admission_id
)
SELECT p.first_name, p.last_name
FROM patient p
JOIN affected_patients ap ON ap.patient_id = p.patient_id;
```

![[Pasted image 20260914161129.png]]

#### - [ ] Combine AT LEAST 3 of the above concepts into ONE query, like Milestone 5 above.

Initially designed to rank treatments within each patient and filter for patients with multiple treatments — but the dataset's 1:1 patient-to-treatment cardinality meant this returned zero rows. Refactored to rank treatments hospital-wide instead (`RANK() OVER (ORDER BY cost DESC)`, no partition), removing the count filter, to produce a populated, meaningful result while still combining a 3+ table JOIN, a chained CTE, a window function, and a CASE WHEN in one query.
```sql
WITH patient_treatments AS (

SELECT p.patient_id, p.first_name, p.last_name,

t.treatment_id, t.treatment_name, t.cost

FROM patient p

JOIN admission a ON a.patient_id = p.patient_id

JOIN diagnosis d ON d.admission_id = a.admission_id

JOIN treatment t ON t.diagnosis_id = d.diagnosis_id

),

ranked_treatments AS (

SELECT *,

RANK() OVER (ORDER BY cost DESC) AS hospital_wide_rank

FROM patient_treatments

)

SELECT patient_id,

first_name,

last_name,

treatment_name,

cost,

hospital_wide_rank,

CASE

WHEN cost IS NULL THEN 'Cost Not Recorded'

WHEN cost >= 3000 THEN 'Premium Treatment'

WHEN cost >= 1500 THEN 'Standard Treatment'

WHEN cost > 0 THEN 'Basic Treatment'

ELSE 'Invalid Cost'

END AS cost_tier

FROM ranked_treatments

ORDER BY hospital_wide_rank;

```
![[Pasted image 20260914165737.png]]