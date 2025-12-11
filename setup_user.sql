-- Create MySQL user and grant permissions for Health app
-- Run this with: mysql -u root -p < setup_user.sql

-- Drop user if exists (MySQL 5.7+)
DROP USER IF EXISTS 'health_app'@'localhost';

-- Create the user with password
CREATE USER 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop';

-- Grant all privileges on the health database
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SELECT User, Host FROM mysql.user WHERE User = 'health_app';
SHOW GRANTS FOR 'health_app'@'localhost';
