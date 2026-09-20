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
SELECT  patient_id, 
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