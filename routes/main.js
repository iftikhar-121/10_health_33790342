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
    res.redirect('/');
  });
});

// Legacy aliases so /search still works
router.get('/search', (req, res) => {
  res.redirect('/workouts/search');
});

router.get('/search-result', (req, res) => {
  const qsIndex = req.url.indexOf('?');
  const qs = qsIndex !== -1 ? req.url.substring(qsIndex) : '';
  res.redirect(`/workouts/search-result${qs}`);
});

module.exports = router;
