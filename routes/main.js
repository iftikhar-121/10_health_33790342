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
    // FIX 1: Use basePath for logout redirect
    res.redirect((res.locals.basePath || '') + '/');
  });
});

router.get('/search', (req, res) => {
  // FIX 2: Use basePath
  res.redirect((res.locals.basePath || '') + '/workouts/search');
});

router.get('/search-result', (req, res) => {
  const qsIndex = req.url.indexOf('?');
  const qs = qsIndex !== -1 ? req.url.substring(qsIndex) : '';
  // FIX 3: Use basePath
  res.redirect(`${res.locals.basePath || ''}/workouts/search-result${qs}`);
});

module.exports = router;