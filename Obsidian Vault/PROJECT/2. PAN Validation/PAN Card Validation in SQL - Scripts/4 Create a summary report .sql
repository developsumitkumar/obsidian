WITH cleaned AS (
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
),
categorized AS (
    SELECT cleaned.pan_number,
           CASE WHEN valid.pan_number IS NULL THEN 'Invalid PAN'
                ELSE 'Valid PAN'
           END AS status
    FROM cleaned
    LEFT JOIN valid ON valid.pan_number = cleaned.pan_number
),
report AS (
    SELECT
        (SELECT COUNT(*) FROM stg_pan_numbers_dataset) AS total_processed_records,
        COUNT(*) FILTER (WHERE status = 'Valid PAN') AS total_valid_pans,
        COUNT(*) FILTER (WHERE status = 'Invalid PAN') AS total_invalid_pans
    FROM categorized
)
SELECT total_processed_records,
       total_valid_pans,
       total_invalid_pans,
       total_processed_records - (total_valid_pans + total_invalid_pans) AS missing_incomplete_pans
FROM report;