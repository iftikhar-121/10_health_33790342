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
 GET `/api/items` → JSON list of workouts.
  - Filters: `?search=`, `?type=cardio|strength|flexibility|balance|sport|other`, `?intensity=low|medium|high`
  - Ranges: `?minDuration=`, `?maxDuration=`
  - Sort: `?sort=date|duration|intensity` (whitelisted)
  - Example: `/api/items?search=run&minDuration=20&sort=duration`

## Pages
 - Home `/`
 - About `/about`
 - Workouts Search `/workouts/search` → results `/workouts/search-result?q=...&mode=partial|exact&intensity=...&type=...`
 - Workouts List `/workouts/list?page=1` (pagination)
 - Add Workout `/workouts/add-workout`
 - Register `/register`, Login `/login`

## Deployment (VM)
1. Ensure `.env` matches:
```
HEALTH_HOST=localhost
HEALTH_USER=health_app
HEALTH_PASSWORD=qwertyuiop
HEALTH_DATABASE=health
HEALTH_BASE_PATH=http://localhost:8000
PORT=8000
SESSION_SECRET=supersecretchangeit
```
2. Run DB scripts: `create_db.sql` then `insert_test_data.sql`
3. Install: `npm install`
4. Start:
   - With forever: `forever start index.js`
   - Or pm2: `pm2 start index.js --name health`
5. Verify URLs (see `links.txt`).


## Troubleshooting
- Ensure MySQL is running and credentials match `.env`.
- If port 8000 is busy, update `PORT` and `.env`.

## VM URLs
See `links.txt` for deployed links.
