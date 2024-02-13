SELECT id, first_name, last_name, email, staff, company_name, job_position
FROM users
WHERE email = {ref('email')}