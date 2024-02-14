SELECT id FROM users
WHERE email = {param('email')}
AND encrypted_password = {param('auth_token')}