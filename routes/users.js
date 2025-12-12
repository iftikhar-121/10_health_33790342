// User Routes - Registration, login, and authentication
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const router = express.Router();

// Middleware to protect routes - redirects to login if not authenticated
function redirectLogin(req, res, next) {
  if (!req.session.user) {
    // Use the detected base path for redirect
    return res.redirect((res.locals.basePath || '') + '/login');
  }
  next();
}

// Audit logging function for tracking user actions and security events
async function logAudit(req, { username, action, status, details }) {
  try {
    await req.db.execute(
      'INSERT INTO audit_log (username, action, status, ip, user_agent, details) VALUES (?,?,?,?,?,?)',
      [username || 'unknown', action, status, req.ip, req.headers['user-agent'] || '', details || null]
    );
  } catch (e) {
    // swallow audit errors
  }
}

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', errors: [], values: {} });
});

// Handle user registration with validation and password hashing
router.post('/registered',
  body('username').trim().isLength({ min: 3 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('first_name').trim().isLength({ min: 1 }).escape(),
  body('last_name').trim().isLength({ min: 1 }).escape(),
  body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  async (req, res, next) => {
    const { username, email, first_name, last_name, password } = req.body;
    const values = { username, email, first_name, last_name };
    try {
      const result = validationResult(req);
      const errors = result.isEmpty() ? [] : result.array().map(e => e.msg);
      // Duplicate checks
      const [u] = await req.db.execute('SELECT user_id FROM users WHERE username = ?', [username]);
      const [e] = await req.db.execute('SELECT user_id FROM users WHERE email = ?', [email]);
      if (u.length) errors.push('Username already taken');
      if (e.length) errors.push('Email already registered');
      // Basic validator outcome (we could use validationResult, but keeping minimal)
      if (errors.length) {
        return res.status(400).render('register', { title: 'Register', errors, values });
      }
      const hashed = await bcrypt.hash(password, 10);
      await req.db.execute(
        'INSERT INTO users (username, email, hashed_password, first_name, last_name) VALUES (?,?,?,?,?)',
        [username, email, hashed, first_name, last_name]
      );
      res.render('login', { title: 'Login', message: 'Registration successful. Please login.' });
    } catch (err) { next(err); }
  }
);

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', message: null });
});

// Handle login with bcrypt password verification and session creation
router.post('/loggedin', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [rows] = await req.db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.render('login', { title: 'Login', message: 'Invalid credentials.' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.hashed_password);
    if (!ok) {
      await logAudit(req, { username, action: 'login', status: 'failure', details: 'Bad password' });
      return res.render('login', { title: 'Login', message: 'Invalid credentials.' });
    }
    req.session.user = { user_id: user.user_id, username: user.username };
    await logAudit(req, { username, action: 'login', status: 'success' });
    // Redirect with basePath
    res.redirect((res.locals.basePath || '') + '/');
  } catch (err) { next(err); }
});

router.get('/protected', redirectLogin, (req, res) => {
  res.render('protected', { title: 'Protected', user: req.session.user });
});

module.exports = router;