-- **Q1.** Find all Zomato customers whose `total_spent` is above the overall average spend
SELECT name, city , total_spent
FROM zomato_customers_india
WHERE total_spent > (SELECT AVG (total_spent) FROM zomato_customers_india);


-- Q3. Find the Zomato customer(s) with the HIGHEST `total_orders`

SELECT name, city, total_orders
FROM zomato_customers_india
WHERE total_orders = (SELECT MAX(total_orders) FROM zomato_customers_india);

-- Q7. Find all Zomato customers whose `total_orders` is below the average `total_orders`.
SELECT name , city , total_orders
FROM zomato_customers_india
WHERE total_orders < (SELECT AVG(total_orders) FROM zomato_customers_india);

-- Q10.** Find all Zomato customers who prefer the SAME payment method as the customer with the highest `total_spent`.
SELECT name , preferred_payment, total_spent
FROM zomato_customers_india
WHERE preferred_payment = (
			SELECT preferred_payment 
            FROM zomato_customers_india
            WHERE total_spent = (
					SELECT MAX(total_spent)
                    FROM zomato_customers_india)
            )
ORDER BY total_spent DESC;


-- **Q13.** Find all Zomato customers whose `city` average `total_spent` exceeds ₹25,000.




-- **Q15.** Find any duplicate customer signups in `zomato_customers` sharing the same `email`.

-- **Q17.** Find all Zomato customers whose `total_spent` is above the average `total_spent` for THEIR OWN `favourite_cuisine` group.
-- **Q19.** Find the SECOND highest `total_spent` value among Zomato customers (without window functions).
-- **Q22.** Find every Zomato customer whose `total_spent` is above THEIR OWN city's average — restricted to only verified (`is_verified = 1`) customers, in both the comparison and the result.
-- **Q26.** Find all Zomato customers who signed up (`created_at`) BEFORE the earliest-registered patient's `registration_date` in the Hospital database.
-- **Q28.** Identify Zomato customers who are the ONLY customer from their `pincode`.
-- **Q30.** For each Zomato `city`, find the customer with the HIGHEST `total_spent` (full row, no window functions).


