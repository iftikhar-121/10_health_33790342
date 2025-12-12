// Main Routes - Home, about, logout, and legacy redirects
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Health Fitness Tracker' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    // Redirect with basePath
    res.redirect((res.locals.basePath || '') + '/');
  });
});

// Legacy aliases so /search still works
router.get('/search', (req, res) => {
  // Redirect with basePath
  res.redirect((res.locals.basePath || '') + '/workouts/search');
});

router.get('/search-result', (req, res) => {
  const qsIndex = req.url.indexOf('?');
  const qs = qsIndex !== -1 ? req.url.substring(qsIndex) : '';
  // Redirect with basePath
  res.redirect(`${res.locals.basePath || ''}/workouts/search-result${qs}`);
});

module.exports = router;