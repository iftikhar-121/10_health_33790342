-- 1. Create and Select the Database FIRST 
CREATE DATABASE IF NOT EXISTS health;
USE health;

-- 2. Drop existing tables if they exist
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS users;

-- 3. Fitness Tracker Schema (from your version) 
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  type ENUM('cardio','strength','flexibility','balance','sport','other') NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes >= 0),
  intensity ENUM('low','medium','high') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, date),
  CONSTRAINT fk_workouts_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  details TEXT,
  attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username_time (username, attempt_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;