SELECT staff AS role, COUNT(*) AS count
FROM users
GROUP BY staff
ORDER BY count DESC;
