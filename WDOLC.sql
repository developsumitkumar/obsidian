 select * from zomato_customers_india;

-- WHERE (the where clause filters rows based on a condition )
select name, city, total_orders from zomato_customers_india
where city= 'mumbai';
select name from zomato_customers_india
where id =2;

-- DISTINCT (distinct removes duplicate values )
 select distinct city from zomato_customers_india;

-- ORDER BY (used to sort the result )
select name, total_spent 
from zomato_customers_india 
order by total_spent desc;

-- LIMIT (used to fetch only specific number of rows)
select * from zomato_customers_india
where id <= 15
order by total_spent desc
limit 15;

-- AND / OR / NOT (conditional statements)
select total_spent, name, id  from zomato_customers_india
where city = 'Bangalore' AND state =  'Delhi'
order by id desc;

-- HomeWork

-- Q1 - get all the customes who live in mumbai 
select * from zomato_customers_india
where city = 'Mumbai';

-- Q2 - show unique cities where customes live 
select distinct city from zomato_customers_india;

-- Q3 - show customers who have more than 5 orders
select * from zomato_customers_india
where total_orders >5;

-- Q4 - 

-- Q5 - 




-- Q6.  list customers from bangalore who have spent more than 2000
select * from zomato_customers_india
where city = 'Bangalore' and total_spent >2000;

-- Q7 find customer who used either UPI or Credit Card as preferred_payment 
select * from zomato_customers_india
where preferred_payment = 'UPI' or preferred_payment = 'Credit Card';
-- or 
select * from zomato_customers_india
where preferred_payment in ('UPI', 'Credit Card');

-- Q8 show customers who have ordered between 5 and 15 
select * from zomato_customers_india
where total_orders <15 and total_orders >5; 
-- or
select * from zomato_customers_india
where total_orders between 5 and 15;

-- Q9 show top 5 spenders who are verified users 
select * from zomato_customers_india
where is_verified= 1
order by total_spent desc
limit 5;

-- Q10 show customers who do not live in mumbai
select * from zomato_customers_india
where city != 'Mumbai'; 
-- or 
select * from zomato_customers_india
where city <> 'Mumbai';

-- Q11 find who live in mumbai delhi bangalore and have more than 20 orders and spent more than 5000
select * from zomato_customers_india
where city in('Delhi', 'Mumbai', 'Bangalore')
and total_orders >20
and total_spent > 5000;

-- 12 identify customers who have registered before 2023 and have not logged in in the last 6 months 
select * from zomato_customers_india
where created_at < 2023-01-01 
and last_login < 2025-02-01;

-- Q13 Show the top 10 customers who odered the least (lowest total_orders) but spent the most(higest total_spent).
select * from zomato_customers_india
order by  total_orders asc, total_spent desc, name asc
limit 10;

-- Find customers who do not prefer UPI and have ordered more than 10 times and live in any city except delhi or mumbai 
select * from zomato_customers_india
where preferred_payment != 'UPI' 
and city not in ('Delhi', 'Mumbai') 
and total_orders > 10;
-- or
select * from zomato_customers_india
where city not in ('Delhi', 'Mumbai')
and preferred_payment <> 'UPI'
and total_orders > 10;
-- or
select * from zomato_customers_india
where total_orders > 10
and preferred_payment != 'UPI'
and city not in ('Delhi', 'Mumbai')
order by total_orders;

-- Q15 find customers where favourite_cuisine is null or empty but total spent is more than 2000
select * from zomato_customers_india
where total_spent > 2000
and (favourite_cuisine is null or favourite_cuisine = '');









 




