WITH city_avg AS (
    SELECT city, AVG(total_spent) AS avg_spend
    FROM zomato_customers_india
    WHERE is_verified = true
    GROUP BY city
),
customer_tiers AS (
    SELECT c.id, c.name, c.city, c.total_spent, c.total_orders, c.is_verified,
        CASE
            WHEN c.total_spent >= 40000 THEN 'Gold'
            WHEN c.total_spent >= 15000 THEN 'Silver'
            ELSE 'Bronze'
        END AS loyalty_tier,
        CASE
            WHEN c.total_spent > ca.avg_spend THEN 'Above City Average'
            ELSE 'Below City Average'
        END AS vs_city_avg
    FROM zomato_customers_india c
    JOIN city_avg ca ON ca.city = c.city
    WHERE c.is_verified = true
),
ranked_final AS (
    SELECT *,
        RANK() OVER (PARTITION BY city ORDER BY total_spent DESC) AS city_rank
    FROM customer_tiers
)
SELECT loyalty_tier,
    COUNT(*) AS customer_count,
    ROUND(SUM(total_spent)::numeric, 2) AS tier_total_revenue,
    ROUND(AVG(total_spent)::numeric, 2) AS tier_avg_spend,
    COUNT(CASE WHEN vs_city_avg = 'Above City Average' THEN 1 END) AS above_city_avg_count,
    COUNT(CASE WHEN city_rank = 1 THEN 1 END) AS number_1_in_their_city_count
FROM ranked_final
GROUP BY loyalty_tier
ORDER BY CASE loyalty_tier WHEN 'Gold' THEN 1 WHEN 'Silver' THEN 2 ELSE 3 END;