SELECT email
FROM users
WHERE id = {param('user_id') + 1}