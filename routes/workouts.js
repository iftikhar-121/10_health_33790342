const express = require('express');
const { query, body } = require('express-validator');
const router = express.Router();

router.get('/search', (req, res) => {
  res.render('search', { title: 'Search Workouts' });
});

router.get('/search-result',
  query('q').optional().trim().escape(),
  query('type').optional().trim().escape(),
  query('intensity').optional().trim().escape(),
  async (req, res, next) => {
    // Placeholder; will implement DB query in next wave
    res.render('list', { title: 'Results', items: [] });
  }
);

router.get('/list', async (req, res, next) => {
  try {
    const [rows] = await req.db.query('SELECT w.*, u.username FROM workouts w JOIN users u ON w.user_id = u.user_id ORDER BY date DESC LIMIT 50');
    res.render('list', { title: 'Recent Workouts', items: rows });
  } catch (err) { next(err); }
});

router.get('/add-workout', (req, res) => {
  res.render('addworkout', { title: 'Add Workout', errors: [], values: {} });
});

router.post('/workout-added',
  body('user_id').isInt({ min: 1 }),
  body('date').isISO8601(),
  body('type').isIn(['cardio','strength','flexibility','balance','sport','other']),
  body('duration_minutes').isInt({ min: 0 }),
  body('intensity').isIn(['low','medium','high']),
  body('notes').optional().trim().escape(),
  async (req, res, next) => {
    const { user_id, date, type, duration_minutes, intensity, notes } = req.body;
    try {
      await req.db.execute(
        'INSERT INTO workouts (user_id, date, type, duration_minutes, intensity, notes) VALUES (?,?,?,?,?,?)',
        [user_id, date, type, duration_minutes, intensity, notes || null]
      );
      res.redirect('/workouts/list');
    } catch (err) { next(err); }
  }
);

module.exports = router;
