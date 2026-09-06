WITH 
cleaned AS (
    SELECT DISTINCT upper(trim(pan_number)) AS pan_number
    FROM stg_pan_numbers_dataset
    WHERE pan_number IS NOT NULL
    AND trim(pan_number) <> ''
),

pan AS (
    SELECT pan_number
    FROM stg_pan_numbers_dataset
    WHERE pan_number IS NOT NULL
    AND length(pan_number) = 10
    AND (
        fn_check_adjacent_repetition(substring(pan_number, 1, 5)) = false
        AND fn_check_sequence(substring(pan_number, 1, 5)) = false
        AND fn_check_adjacent_repetition(substring(pan_number, 6, 4)) = false
        AND fn_check_sequence(substring(pan_number, 6, 4)) = false
    )
),

valid AS (
    SELECT DISTINCT pan_number
    FROM pan
    WHERE (
        substring(pan_number, 1, 5) ~ '^[A-Z]{5}$'
        AND substring(pan_number, 6, 4) ~ '^[0-9]{4}$'
        AND substring(pan_number, 10, 1) ~ '^[A-Z]{1}$'
    )
)
SELECT cleaned.pan_number,
       CASE WHEN valid.pan_number IS NULL THEN 'Invalid PAN'
            ELSE 'Valid PAN'
       END AS status
FROM cleaned
LEFT JOIN valid  ON valid.pan_number = cleaned.pan_number;





---- GROUP COUNT ----

SELECT status, COUNT(*)
FROM (
    WITH 
cleaned AS (
    SELECT DISTINCT upper(trim(pan_number)) AS pan_number
    FROM stg_pan_numbers_dataset
    WHERE pan_number IS NOT NULL
    AND trim(pan_number) <> ''
),

pan AS (
    SELECT pan_number
    FROM stg_pan_numbers_dataset
    WHERE pan_number IS NOT NULL
    AND length(pan_number) = 10
    AND (
        fn_check_adjacent_repetition(substring(pan_number, 1, 5)) = false
        AND fn_check_sequence(substring(pan_number, 1, 5)) = false
        AND fn_check_adjacent_repetition(substring(pan_number, 6, 4)) = false
        AND fn_check_sequence(substring(pan_number, 6, 4)) = false
    )
),

valid AS (
    SELECT DISTINCT pan_number
    FROM pan
    WHERE (
        substring(pan_number, 1, 5) ~ '^[A-Z]{5}$'
        AND substring(pan_number, 6, 4) ~ '^[0-9]{4}$'
        AND substring(pan_number, 10, 1) ~ '^[A-Z]{1}$'
    )
)
SELECT cleaned.pan_number,
       CASE WHEN valid.pan_number IS NULL THEN 'Invalid PAN'
            ELSE 'Valid PAN'
       END AS status
FROM cleaned
LEFT JOIN valid  ON valid.pan_number = cleaned.pan_number
) categorized

GROUP by status;
