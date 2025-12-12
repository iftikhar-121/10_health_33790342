// Main Routes - Home, about, logout, and legacy redirects
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // DISABLE CACHE so the user sees the 'Logged In' state immediately
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.render('index', { title: 'Health Fitness Tracker' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    // Clear the cookie and redirect
    res.clearCookie('connect.sid'); 
    res.redirect((res.locals.basePath || '') + '/');
  });
});

// Legacy aliases
router.get('/search', (req, res) => {
  res.redirect((res.locals.basePath || '') + '/workouts/search');
});

router.get('/search-result', (req, res) => {
  const qsIndex = req.url.indexOf('?');
  const qs = qsIndex !== -1 ? req.url.substring(qsIndex) : '';
  res.redirect(`${res.locals.basePath || ''}/workouts/search-result${qs}`);
});

module.exports = router;