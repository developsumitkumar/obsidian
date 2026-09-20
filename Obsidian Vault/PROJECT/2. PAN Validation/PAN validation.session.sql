SELECT * FROM stg_pan_numbers_dataset
WHERE pan_number IS NULL;

SELECT * FROM stg_pan_numbers_dataset
WHERE pan_number <> UPPER(pan_number);