// Health Fitness Tracker - Main Application Entry Point
// Lab 10 - Node.js + Express + EJS + MySQL

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const sanitizer = require('express-sanitizer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 8000;

// MySQL connection pool for efficient database access
const pool = mysql.createPool({
  host: process.env.HEALTH_HOST,
  user: process.env.HEALTH_USER,
  password: process.env.HEALTH_PASSWORD,
  database: process.env.HEALTH_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();

// Configure EJS templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security and parsing middleware
app.use(helmet()); // Security headers
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON bodies
app.use(sanitizer()); // XSS prevention
// Session management for authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
// Also serve static files under the VM subpath if needed
app.use('/usr', express.static(path.join(__dirname, 'public')));

// Make database connection available to all routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Middleware to detect Base Path and User Session
app.use((req, res, next) => {
  // 1. Auto-detect base path (e.g., /usr/142) from the URL
  const match = req.originalUrl.match(/^\/usr\/\d+/);
  const basePath = match ? match[0] : '';
  
  // 2. Make variables available to all templates and routes
  res.locals.basePath = basePath;
  res.locals.user = req.session.user || null;
  
  next();
});

// Route handlers
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const apiRoutes = require('./routes/api');

app.use('/', mainRoutes);
app.use('/', userRoutes); // /register, /login, etc.
app.use('/workouts', workoutRoutes); // /workouts/search, /workouts/list
app.use('/api', apiRoutes); // /api/items

// Health check
app.get('/healthz', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT 1 AS ok');
    res.json({ ok: rows[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB unavailable' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'Error', message: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`Health Fitness Tracker running on http://localhost:${PORT}`);
});