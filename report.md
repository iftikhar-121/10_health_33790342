# Report (Lab 10 Health Fitness Tracker)

## Outline
This app lets users log fitness workouts, search/filter them, and view lists via a web UI and JSON API.

## Architecture
Express/EJS web tier with sessions, validator/sanitizer; MySQL data tier; audit logging; API with filters/sort.

## Data Model
Tables: users (accounts), workouts (entries), audit_log (events). Workouts link to users by user_id.

## User Functionality
Home/About pages; search and list workouts; add workout form with validation; optional register/login; API endpoint.

## Advanced Techniques
Audit logging; API rate limiting; pagination; safe parameterized queries.

## AI Declaration
Assistance used to scaffold code and documentation structure.