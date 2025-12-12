// Health Fitness Tracker - Main Application Entry Point
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const sanitizer = require('express-sanitizer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 8000;

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

// !!! CRITICAL FIX: Trust the VM proxy so cookies work !!!
app.set('trust proxy', 1); 

// Configure EJS templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security and parsing middleware
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sanitizer());

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    // 'lax' helps ensure the cookie is sent during redirects
    sameSite: 'lax' 
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/usr', express.static(path.join(__dirname, 'public')));

// Make database connection available
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Middleware to detect Base Path and User Session
app.use((req, res, next) => {
  const match = req.originalUrl.match(/^\/usr\/\d+/);
  const basePath = match ? match[0] : '';
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
app.use('/', userRoutes);
app.use('/workouts', workoutRoutes);
app.use('/api', apiRoutes);

app.get('/healthz', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT 1 AS ok');
    res.json({ ok: rows[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB unavailable' });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'Error', message: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`Health Fitness Tracker running on http://localhost:${PORT}`);
});