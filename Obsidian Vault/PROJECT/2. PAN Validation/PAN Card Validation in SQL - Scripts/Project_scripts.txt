
--- PAN Number Validation Project using SQL ---

-- Create the stage table to store original given dataset
drop table if exists stg_pan_numbers_dataset;
create table stg_pan_numbers_dataset
(
	pan_number text
);


-- 1. Identify and handle missing data
select * from stg_pan_numbers_dataset where pan_number is null; 


-- 2. Check for duplicates
select pan_number, count(1) 
from stg_pan_numbers_dataset 
where pan_number is not null
group by pan_number
having count(1) > 1; 

select distinct * from stg_pan_numbers_dataset;


-- 3. Handle leading/trailing spaces
select *
from stg_pan_numbers_dataset 
where pan_number <> trim(pan_number)


-- 4. Correct letter case
select *
from stg_pan_numbers_dataset 
where pan_number <> upper(pan_number)


-- New cleaned table:
create table pan_numbers_dataset_cleaned
as
select distinct upper(trim(pan_number)) as pan_number
from stg_pan_numbers_dataset 
where pan_number is not null
and TRIM(pan_number) <> ''



-- Function to check if adjacent characters are repetative. 
-- Returns true if adjacent characters are adjacent else returns false
create or replace function fn_check_adjacent_repetition(p_str text)
returns boolean
language plpgsql
as $$
begin
	for i in 1 .. (length(p_str) - 1)
	loop
		if substring(p_str, i, 1) = substring(p_str, i+1, 1)
		then 
			return true;
		end if;
	end loop;
	return false;
end;
$$



-- Function to check if characters are sequencial such as ABCDE, LMNOP, XYZ etc. 
-- Returns true if characters are sequencial else returns false
CREATE or replace function fn_check_sequence(p_str text)
returns boolean
language plpgsql
as $$
begin
	for i in 1 .. (length(p_str) - 1)
	loop
		if ascii(substring(p_str, i+1, 1)) - ascii(substring(p_str, i, 1)) <> 1
		then 
			return false;
		end if;
	end loop;
	return true;
end;
$$


-- Valid Invalid PAN categorization
create or replace view vw_valid_invalid_pans 
as 
with cte_cleaned_pan as
		(select distinct upper(trim(pan_number)) as pan_number
		from stg_pan_numbers_dataset 
		where pan_number is not null
		and TRIM(pan_number) <> ''),
	cte_valid_pan as
		(select *
		from cte_cleaned_pan
		where fn_check_adjacent_repetition(pan_number) = 'false'
		and fn_check_sequence(substring(pan_number,1,5)) = 'false'
		and fn_check_sequence(substring(pan_number,6,4)) = 'false'
		and pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$')
select cln.pan_number
, case when vld.pan_number is null 
			then 'Invalid PAN' 
	   else 'Valid PAN' 
  end as status
from cte_cleaned_pan cln
left join cte_valid_pan vld on vld.pan_number = cln.pan_number;

	
-- Summary report
with cte as 
	(SELECT 
	    (SELECT COUNT(*) FROM stg_pan_numbers_dataset) AS total_processed_records,
	    COUNT(*) FILTER (WHERE vw.status = 'Valid PAN') AS total_valid_pans,
	    COUNT(*) FILTER (WHERE vw.status = 'Invalid PAN') AS total_invalid_pans
	from  vw_valid_invalid_pans vw)
select total_processed_records, total_valid_pans, total_invalid_pans
, total_processed_records - (total_valid_pans+total_invalid_pans) as missing_incomplete_PANS
from cte;
  
