# Health Fitness Tracker

Node.js + Express + EJS + MySQL app for Lab 10. Tracks workouts with search, add, optional authentication, and a JSON API.

## Quick Start
1. Create `.env` with:
```
HEALTH_HOST=localhost
HEALTH_USER=health_app
HEALTH_PASSWORD=qwertyuiop
HEALTH_DATABASE=health
HEALTH_BASE_PATH=http://localhost:8000
PORT=8000
SESSION_SECRET=supersecretchangeit
```
2. Install dependencies: `npm install`
3. Create database and schema:
   - Create database `health`
   - Run `create_db.sql`
   - Run `insert_test_data.sql`
4. Start the app: `npm start` and visit `http://localhost:8000`

## API
- GET `/api/items` → JSON list of workouts. Supports `?search=`, `?type=`, `?minDuration=`, `?maxDuration=`, `?sort=date|duration|intensity` (to be implemented in later waves).

## Troubleshooting
- Ensure MySQL is running and credentials match `.env`.
- If port 8000 is busy, update `PORT` and `.env`.

## VM URLs
See `links.txt` for deployed links.
