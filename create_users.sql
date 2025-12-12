-- Create users table
CREATE TABLE users (
  userId INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  active TINYINT(1) DEFAULT 1,
  PRIMARY KEY (userId)
);

-- Create stored procedure
DELIMITER //

CREATE PROCEDURE addUser(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_type VARCHAR(50),
    IN p_active TINYINT
)
BEGIN
    INSERT INTO users (email, password, type, active)
    VALUES (p_email, p_password, p_type, p_active);
END//

DELIMITER ;

-- Example call:
CALL addUser('test@example.com', '123456', 'admin', 1);

SELECT * FROM `users`;
