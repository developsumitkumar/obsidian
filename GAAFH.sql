SELECT * FROM zomato_customers_india;


-- --------------------GROUP BY--------------------------
-- zomato wants to see how many orders are placed by each city.
-- groups rows that have the same values in one or more colums.
-- grouping orders by restaurant or city in report.

-- ----------------------ALIAS----------------------------
-- a temporary name for a column or table 
-- like giving a nickname to a person so we can call them easily. 
-- 

-- Count -> number of customers in each city. 
-- Sum -> total money spent by each city.

-- --------------------HAVING-------------------------------
-- FILTERS GROUPS AFTER AGGREGATION 
-- analogy-> first we make a list of groups, then you remove some based on conditions
-- diffrent from where -> WHERE filters before grouping.
-- 						 HAVING filters after grouping.

 SELECT city, COUNT(*) AS new_column
 FROM zomato_customers_india
 GROUP BY city;
 
 SELECT city,  MIN(total_spent) AS least_revenue
 FROM zomato_customers_india
 GROUP BY city;
 
 SELECT city, COUNT(*) as alis
 FROM zomato_customers_india
 GROUP BY city 
 HAVING COUNT(*) > 10;
 
 -- ---------------------LIKE-----------------------
 SELECT * FROM zomato_customers_india
 WHERE email LIKE '%.com%'
 AND state LIKE '%ut%';
 
 -- ----------------------AVERAGE-------------------------
 -- Q. Find average total orders 
 SELECT state, AVG(total_orders) as total_avg_order
 FROM zomato_customers_india
 GROUP BY state 
 HAVING COUNT(*) > 5;
 
 
