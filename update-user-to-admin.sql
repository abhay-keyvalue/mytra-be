-- Update user role from CUSTOMER to ADMIN
-- User: admin@myntra.com
-- ID: 7280aa9e-0bea-4800-9cb7-666287fb7ee9

-- Update the specific user to ADMIN role
UPDATE users 
SET role = 'ADMIN', 
    updated_at = NOW()
WHERE email = 'admin@myntra.com';

-- Verify the update
SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at
FROM users
WHERE email = 'admin@myntra.com';
