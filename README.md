# Health Fitness Tracker - Lab 10

A comprehensive health and fitness tracking web application built with Node.js, Express, EJS, and MySQL. Features workout tracking, external API integration, authentication, and advanced search capabilities.

---

## 🚀 Quick Setup for Markers

### Database Credentials (for marking only)
**MySQL User:** `health_app`  
**MySQL Password:** `qwertyuiop`  
**Database Name:** `health`  
**Server Port:** `8000`

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create MySQL User and Database**
   ```bash
   # Create the MySQL user and grant permissions
   mysql -u root -p < setup_user.sql
   
   # Create database structure (tables: users, workouts, audit_log)
   mysql -u root -p < create_db.sql
   
   # Insert test data
   mysql -u health_app -pqwertyuiop < insert_test_data.sql
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory with the following:
   ```
   HEALTH_HOST=localhost
   HEALTH_USER=health_app
   HEALTH_PASSWORD=qwertyuiop
   HEALTH_DATABASE=health
   HEALTH_BASE_PATH=http://localhost:8000
   PORT=8000
   SESSION_SECRET=supersecretchangeit
   API_NINJAS_KEY=m6bIgjvZITaf0V73DET4gw==rytwQggM7vb77QJ4
   ```
   
   **Note:** The API-Ninjas key is included for marking purposes. In production, this would never be committed.

4. **Start the Application**
   ```bash
   npm start
   # or
   node index.js
   ```
   
   Visit: **http://localhost:8000**

5. **Test Login Credentials**
   - **Username:** `gold`
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

## 📝 Notes for Markers

1. **Database credentials are included in this README for marking convenience only.** This violates normal security practices but is requested for easier setup.

2. **API Key is provided** - The API-Ninjas key in the `.env` example is a working key for marking purposes.

3. **Test user credentials** are pre-configured for immediate testing (gold/smiths).

4. **External API fallback** - If the API-Ninjas service is unavailable, the app falls back to hardcoded exercise suggestions.

5. **File structure is intentionally minimal** - only necessary files included for submission (no debug scripts, backup files, or unnecessary configs).

**Note:** The app works without the API key (uses fallback exercises), but real API data demonstrates advanced integration skills.

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
