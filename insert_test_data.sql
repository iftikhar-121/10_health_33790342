-- Seed data for Fitness Tracker
-- Includes a sample user and workouts. If using optional auth, you may replace hashed_password with bcrypt hash.

INSERT INTO users (username, email, hashed_password, first_name, last_name)
VALUES
('gold', 'gold@example.com', '$2b$10$examplehashedpasswordstring000000000000000000000000', 'Gold', 'User'),
('alice', 'alice@example.com', '$2b$10$examplehashedpasswordstring000000000000000000000000', 'Alice', 'Runner');

-- Sample workouts for users
INSERT INTO workouts (user_id, date, type, duration_minutes, intensity, notes)
VALUES
(1, '2025-12-01', 'cardio', 30, 'medium', 'Treadmill jog'),
(1, '2025-12-02', 'strength', 45, 'high', 'Upper body weights'),
(2, '2025-12-03', 'flexibility', 20, 'low', 'Yoga session'),
(2, '2025-12-04', 'cardio', 60, 'high', 'Outdoor run in park');
