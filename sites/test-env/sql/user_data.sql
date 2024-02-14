SELECT id, email, first_name, last_name, company_name, job_position
FROM users
WHERE email = {param('email')}