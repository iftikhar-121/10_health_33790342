# Health Fitness Tracker

A comprehensive health and fitness tracking web application built with **Node.js**, **Express**, **EJS**, and **MySQL**.

## ⚠️ Important Deployment Notes (VM / Proxy)

When testing this application on the Goldsmiths VM environment (`/usr/142`), please be aware of the following behaviors caused by the server's proxy and caching settings:

1.  **Login Page Behavior:**
   * **Observation:** After entering valid credentials (`gold`/`smiths`) and clicking Login, the page may reload without immediately showing the "Logged In" dashboard.
   * **Verification:** **The login is successful.** Please simply click the **"Search"** or **"My Workouts"** links in the navigation bar. You will see that the session is active and you have full access to protected features.

2.  **Adding Workouts:**
   * **Observation:** Submitting the "Add Workout" form may result in a "URL Not Found" or 404 error page upon redirection.
   * **Verification:** **The workout data is saved successfully.** Please navigate back to **"My Workouts"** (List View), and you will confirm the new entry has been recorded in the database.

*Note: The application functions without these quirks in a standard local environment (`localhost`).*

## Install & Configuration

1.  **Install Dependencies**
   ```bash
   npm install
   ```

2.  **Environment Configuration**
   Create a `.env` file in the root directory (this file is git-ignored):
   ```env
   HEALTH_HOST=localhost
   HEALTH_USER=health_app
   HEALTH_PASSWORD=qwertyuiop
   HEALTH_DATABASE=health
   HEALTH_BASE_PATH=http://localhost:8000
   PORT=8000
   SESSION_SECRET=supersecretchangeit
   # API key provided for marking convenience
   API_NINJAS_KEY=m6bIgjvZITaf0V73DET4gw==rytwQggM7vb77QJ4
   ```

## Database Setup

Initialize the MySQL database tables and seed test data:

```sql
SOURCE create_db.sql;
SOURCE insert_test_data.sql;
```

- `create_db.sql`: Sets up the users, workouts, and audit_log tables.
- `insert_test_data.sql`: Populates the database with initial data and the admin user.

## Running the App

Start the server:

```bash
node index.js
```

- Local URL: http://localhost:8000
- VM Deployment: The application automatically detects subpaths (e.g., /usr/142) via middleware configuration in index.js.

## Features

### Core Functionality
- **User Authentication:** Secure Registration and Login using bcrypt hashing and express-session.
- **Workout Management:** Full Create-Read functionality for workout sessions (Date, Type, Duration, Intensity, Notes).
- **Advanced Search:** Filter workouts by type, intensity levels, or keyword matching.
- **Pagination:** Efficiently lists user history 20 items per page.

### Advanced Techniques
- **External API Integration:** Connects to the API-Ninjas Exercise Database. When adding a workout, the app fetches and displays dynamic exercise suggestions based on the selected workout type (e.g., selecting "Cardio" suggests "Running" or "Cycling").
- **Security Hardening:** Uses helmet for HTTP security headers and express-sanitizer to prevent XSS attacks.
- **Input Validation:** server-side validation using express-validator to ensure data integrity.
- **Audit Logging:** Tracks critical user actions (logins, failures) in a dedicated database table.

## Project Structure
- `index.js`: Application entry point, server configuration, and custom middleware.
- `routes/`: Modular route handlers (users.js, workouts.js, main.js, api.js).
- `services/`: Logic for external API integration (exerciseService.js).
- `views/`: EJS templates for the frontend UI.
- `public/`: Static assets (CSS, client-side JS).

## Test User Credentials
The database script creates a default user for marking purposes:

- **Username:** gold
- **Password:** smiths

(If login fails for any reason, please use the Register page to create a new user account.)

## Links
Direct links to the deployed application pages can be found in the `links.txt` file.
   - **Password:** `smiths`

---

## 📋 Features Implemented

### Core Functionality (10 Compulsory Requirements)
1. ✅ MySQL database with 3 tables (users, workouts, audit_log)
2. ✅ Add workout functionality with validation
3. ✅ List workouts (paginated, filtered by logged-in user)
4. ✅ Search workouts with multiple filters
5. ✅ User registration with password hashing (bcrypt)
6. ✅ User login with session management
7. ✅ Authentication protection on workout routes
8. ✅ Dynamic data display with EJS templating
9. ✅ Responsive UI with modern CSS
10. ✅ Error handling throughout

### Advanced Techniques (7 Implemented)
1. ✅ **External API Integration** - API-Ninjas Exercise Database
2. ✅ **Security Headers** - helmet middleware
3. ✅ **Input Validation** - express-validator with validationResult
4. ✅ **Input Sanitization** - express-sanitizer (XSS prevention)
5. ✅ **Rate Limiting** - 60 requests/minute on API endpoints
6. ✅ **Audit Logging** - tracks login attempts with IP/user agent
7. ✅ **Pagination** - 10 items per page on workout list

---

## 🌐 Application Routes

### Public Pages
- `GET /` - Home page
- `GET /about` - About page
- `GET /register` - User registration form
- `POST /registered` - Process registration
- `GET /login` - Login form
- `POST /loggedin` - Process login

### Protected Pages (require login)
- `GET /workouts/list` - View user's workouts (paginated)
- `GET /workouts/add-workout` - Add workout form with API suggestions
- `POST /workouts/workout-added` - Process workout submission
- `GET /workouts/search` - Search form
- `GET /workouts/search-result` - Search results
- `GET /logout` - Logout

### API Endpoints
- `GET /api/items` - JSON API for workouts
  - Query parameters: `search`, `type`, `intensity`, `minDuration`, `maxDuration`, `sort`
  - Example: `/api/items?type=cardio&intensity=high&minDuration=30`

---

## 🗄️ Database Structure

### Users Table
- `user_id` (PK, AUTO_INCREMENT)
- `username` (UNIQUE)
- `email` (UNIQUE)
- `hashed_password`
- `first_name`, `last_name`
- `created_at`

### Workouts Table
- `workout_id` (PK, AUTO_INCREMENT)
- `user_id` (FK → users)
- `date`, `type`, `duration_minutes`, `intensity`, `notes`
- `created_at`

### Audit_Log Table
- `log_id` (PK, AUTO_INCREMENT)
- `username`, `action`, `status`
- `ip`, `user_agent`, `details`
- `timestamp`

---

## 🔧 Technologies Used

- **Backend:** Node.js v18+, Express v4.19.2
- **Templating:** EJS v3.1.9
- **Database:** MySQL v8.0+ (mysql2 driver)
- **Security:** bcrypt, helmet, express-sanitizer
- **Validation:** express-validator
- **External API:** API-Ninjas Exercise Database
- **Session Management:** express-session

---


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
API_NINJAS_KEY=your_api_key_here
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
