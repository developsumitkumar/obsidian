SELECT * FROM stg_pan_numbers_dataset
WHERE length(pan_number) <> 10 ;

SELECT substring('ABZXG1254F', 1, 5);
SELECT 'AHGVE' ~ '^[A-Z]{5}$';
SELECT 'AH12E' ~ '^[A-Z]{5}$';

SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE SUBSTRING(pan_number, 1, 5) != '^[A-Z]{5}$';
-- this does not work as this != compares exact text, it doesn't understand regex
-- 9035 rows

-- Solution !~ / ~
SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE SUBSTRING(pan_number, 1, 5) ~ '^[A-Z]{5}$';
--  7036 rows

SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE SUBSTRING(pan_number, 1, 5) !~ '^[A-Z]{5}$';
-- 1999 rows


-- ------------------- Adjucent Repetation ---------------
select 'AABCD' ~ '([A-Z])\1'; -- true
select 'AXBCD' ~ '([A-Z])\1'; -- false

SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE SUBSTRING(pan_number, 1, 5) !~ '([A-Z])\\1';
-- 9035 rows 

-- After executing the block of lines from the script 
select fn_check_adjacent_repetition('AABCD'); --True
select fn_check_adjacent_repetition('AXBCD'); --False

-- --------------- Solution for 2.1 ------------

SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE pan_number is NOT NULL -- important catch not to miss 
and fn_check_adjacent_repetition(
    substring(pan_number, 1, 5)) = True;
-- returns the rows which have same adjacent characters 
-- 1241 rows

SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE pan_number is NOT NULL
and fn_check_adjacent_repetition(
    substring(pan_number, 1, 5)) = False;
-- returns the rows which do not have same adjacent characters 
-- 7794 rows

-- --------------------Solution for 2.2 -----------------------

select fn_check_sequence('ACEVD');

SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE pan_number is NOT NULL
and fn_check_sequence(
    substring(pan_number, 1, 5)) = True;
-- 0 rows as there are no value in a row that have first 5 alphabets in sequence 


------------------- Digits --------------
select '1234A' ~ '^[0-9]'; -- true
select '5A261' ~ '^[0-9]'; -- true

select '1234B' ~ '^[0-9]{4}$'; -- is returning flase why ??
-- use substring when checking for length less than the actual length 
select '5A261' ~ '^[0-9]{5}$'; -- false

select '7856' ~ '^[0-9]{4}$';-- true
select '75B6' ~ '^[0-9]{4}$'; -- false

select substring('7856A56A', 1, 4) ~ '^[0-9]{4}$';-- true
select substring('75B6A56A', 1, 4) ~ '^[0-9]{4}$';-- false 

select '12345ABC54254HHGFG' ~ '^[0-9]{5}';

select substring('AHGVE1276F', 10, 1);   -- F
select substring('AHGVE1276F', 9, 1);    -- 6

select substring('AHGVE12', 10, 1);        -- 7-character string
select substring('AHGVE1276FX', 10, 1);    -- 11-character string

--------- Combination -----------

-- -----basic validation of the format AAAAA1111A
SELECT DISTINCT pan_number
from stg_pan_numbers_dataset
WHERE pan_number is NOT NULL
AND length(pan_number)= 10
AND (
    substring(pan_number, 1, 5) ~ '^[A-Z]{5}$'
    AND
    substring(pan_number, 6, 4) ~ '^[0-9]{4}$'
    AND
     substring(pan_number, 10, 1) ~ '^[A-Z]{1}$'
)





-- we check that 1st 5 are alphabets and not sequential also 
-- not same adjacent  and then 
-- 4 digits (no same adjacent not sequencial ) then a alphabet
WITH pan AS(  
SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE pan_number is NOT NULL
AND length(pan_number) = 10 

AND 
(   
    fn_check_adjacent_repetition(
    substring(pan_number, 1, 5)) = false
AND
    fn_check_sequence(
    substring(pan_number, 1, 5)) = false
AND
    fn_check_adjacent_repetition(
    substring(pan_number, 6, 4)) = false 
AND
    fn_check_sequence(
    substring(pan_number, 6, 4)) = false
AND 
    substring(pan_number, 10, 1) ~ '^[A-Z]{1}$'    -- its double checking here in cte and outside cte 
                                                
) 
)
SELECT DISTINCT pan_number
FROM pan
WHERE  (
    substring(pan_number, 1, 5) ~ '^[A-Z]{5}$'
    AND
    substring(pan_number, 6, 4) ~ '^[0-9]{4}$'
    AND
     substring(pan_number, 10, 1) ~ '^[A-Z]{1}$'
)
-- 3180 rows



********************************************
-- more correct way 


WITH pan AS(  
SELECT pan_number
FROM stg_pan_numbers_dataset
WHERE pan_number is NOT NULL
AND length(pan_number) = 10 
AND 
(   
    fn_check_adjacent_repetition(
    substring(pan_number, 1, 5)) = false
AND
    fn_check_sequence(
    substring(pan_number, 1, 5)) = false
AND
    fn_check_adjacent_repetition(
    substring(pan_number, 6, 4)) = false 
AND
    fn_check_sequence(
    substring(pan_number, 6, 4)) = false
                                                
) 
)
SELECT DISTINCT pan_number
FROM pan
WHERE  (
    substring(pan_number, 1, 5) ~ '^[A-Z]{5}$'
    AND
    substring(pan_number, 6, 4) ~ '^[0-9]{4}$'
    AND
     substring(pan_number, 10, 1) ~ '^[A-Z]{1}$'
)
-- 3180 rows