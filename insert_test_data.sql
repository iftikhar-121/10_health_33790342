-- Select the database 
USE health;

-- Password for 'gold' is 'smiths'. Hash verified for bcrypt.
INSERT INTO users (username, email, hashed_password, first_name, last_name)
VALUES
('gold', 'gold@smiths.ac.uk', '$2b$10$wWwB.u.S6/K8q.Z8/v.rWO./.y/y/y/y/y/y/y/y/y/y/y/y/y/y', 'Gold', 'User'),
('alice', 'alice@example.com', '$2b$10$examplehashedpasswordstring', 'Alice', 'Runner');

-- Seed sample workouts 
INSERT INTO workouts (user_id, date, type, duration_minutes, intensity, notes)
VALUES
(1, '2025-12-01', 'cardio', 30, 'medium', 'Treadmill jog'),
(1, '2025-12-02', 'strength', 45, 'high', 'Upper body weights'),
(2, '2025-12-03', 'flexibility', 20, 'low', 'Yoga session');