-- ------------------------------------- Creating the Table ----------------------
-- create table stg_pan_numbers_dataset
-- (
-- 	pan_number text
-- );

-- --------------------------------The RAW Table
SELECT * FROM stg_pan_numbers_dataset;
-- result  10000rows


-- --------------Identify Aand Handle mIssing Data----------

SELECT * FROM stg_pan_numbers_dataset
where pan_number is NULL;
-- result 965 entries

-- ------------------------ CHeck for Duplicates --------

select pan_number, count(1)
FROM stg_pan_numbers_dataset
GROUP BY pan_number
having count(1) > 1;

--result 6 rows 

 --------------------handling leading or trailing spaces-------------------

 SELECT *
FROM stg_pan_numbers_dataset 
WHERE pan_number <> trim(pan_number);
-- result 9 rows

-- correct letter case 
SELECT * FROM stg_pan_numbers_dataset
where pan_number <> upper(pan_number);
-- result 990 rows



-- ----------------------Solution for Problem Statement 01-----------
-------------------------------  CLEANED PAN NUMBER   ---------------------

SELECT DISTINCT upper(trim(pan_number)) AS pan_number
FROM stg_pan_numbers_dataset
where pan_number IS NOT NULL
and trim(pan_number) <> '' ;
-- 9025 rows