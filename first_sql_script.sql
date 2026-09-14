-- CREATE TABLE users(
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- name VARCHAR(100) NOT NULL,
-- email VARCHAR (100) NOT NULL,
-- gender ENUM('Male', 'Female', 'Other'),
-- date_of_birth DATE,
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- );
select * from users;
--  SELECT id, email FROM users;
--  ALTER TABLE users ADD column is_active BOOLEAN DEFAULT true;
--  alter table users drop column is_active;
--  alter table users modify column name varchar(150)
alter table users modify column email varchar(100) after id;
alter table users modify column date_of_birth Date first;
rename table users to users1;




 
 
