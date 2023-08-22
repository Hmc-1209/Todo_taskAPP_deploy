-- Prevent recreating database
DROP DATABASE IF EXISTS Todo_taskAPP;
DROP USER IF EXISTS 'Todo_taskApp_root'@'localhost';
DROP USER IF EXISTS 'Todo_taskApp_admin'@'%';
DROP USER IF EXISTS 'Todo_taskApp_user'@'%';

-- Setting configuration
SOURCE ~/Documents/Todo_taskAPP_server/DataBase/config.sql;

CREATE DATABASE Todo_taskAPP;
USE Todo_taskAPP;

-- Create root user
SET @create_user_sql = CONCAT('CREATE USER ''Todo_taskApp_root''@''localhost'' IDENTIFIED BY ''', @db_password, ''';');
PREPARE stmt FROM @create_user_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
GRANT ALL PRIVILEGES ON *.* TO 'Todo_taskApp_root'@'localhost';

-- Create admin user
SET @create_user_sql = CONCAT('CREATE USER ''Todo_taskApp_admin''@''%'' IDENTIFIED BY ''', @db_password, ''';');
PREPARE stmt FROM @create_user_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, EXECUTE, INDEX ON Todo_taskAPP.* TO 'Todo_taskApp_admin'@'%';

-- Create normal user
SET @create_user_sql = CONCAT('CREATE USER ''Todo_taskApp_user''@''%'' IDENTIFIED BY ''', @db_password, ''';');
PREPARE stmt FROM @create_user_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
GRANT SELECT, INSERT, UPDATE, DELETE ON Todo_taskAPP.* TO 'Todo_taskApp_user'@'%';

-- Create USER table
CREATE TABLE User(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    user_password VARCHAR(64) NOT NULL,
    user_birthdate DATE
);

-- Create REPOSITORY table
CREATE TABLE Repository(
    repo_id INT AUTO_INCREMENT PRIMARY KEY,
    repo_name VARCHAR(25) NOT NULL,
    creator_id INT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES User(user_id)
);

-- Create TASK table
CREATE TABLE Task(
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(25) NOT NULL,
    task_description VARCHAR(255),
    task_due_date DATE,
    task_finish INT NOT NULL,
    creator_id INT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES User(user_id),
    belongs_to_repository_id INT NOT NULL,
    FOREIGN KEY (belongs_to_repository_id) REFERENCES Repository(repo_id)
);

-- Create TAG table
CREATE TABLE Tag(
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(10) NOT NULL,
    creator_id INT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES User(user_id),
    belongs_to_repository_id INT NOT NULL,
    FOREIGN KEY (belongs_to_repository_id) REFERENCES Repository(repo_id)
);