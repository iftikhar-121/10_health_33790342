// Workout Routes - Add, list, and search workout functionality
const express = require('express');
const { query, body, validationResult } = require('express-validator');
const router = express.Router();

// Middleware to protect routes - redirects to login if not authenticated
function redirectLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/search', (req, res) => {
  res.render('search', { title: 'Search Workouts' });
});

router.get('/search-result',
  query('q').optional().trim(),
  query('type').optional().trim(),
  query('intensity').optional().trim(),
  query('mode').optional().isIn(['exact','partial']).default('partial'),
  query('sort').optional().isIn(['date','duration','intensity']).default('date'),
  async (req, res, next) => {
    try {
      const { q = '', type = '', intensity = '', mode = 'partial', sort = 'date' } = req.query;
      const clauses = [];
      const params = [];
      if (q) {
        if (mode === 'exact') {
          clauses.push('(w.type = ? OR w.notes = ?)');
          params.push(q, q);
        } else {
          clauses.push('(w.type LIKE ? OR w.notes LIKE ?)');
          params.push(`%${q}%`, `%${q}%`);
        }
      }
      if (type) { clauses.push('w.type = ?'); params.push(type); }
      if (intensity) { clauses.push('w.intensity = ?'); params.push(intensity); }
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const sortWhitelist = { date: 'w.date DESC', duration: 'w.duration_minutes DESC', intensity: "FIELD(w.intensity,'high','medium','low') ASC" };
      const orderBy = sortWhitelist[sort] || sortWhitelist.date;
      const sql = `SELECT w.*, u.username FROM workouts w JOIN users u ON w.user_id = u.user_id ${where} ORDER BY ${orderBy} LIMIT 100`;
      const [rows] = await req.db.query(sql, params);
      res.render('list', { title: 'Search Results', items: rows });
    } catch (err) { next(err); }
  }
);

// Display logged-in user's workout history with pagination
router.get('/list', redirectLogin, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = 20;
    const offset = (page - 1) * pageSize;
    const userId = req.session.user.user_id;
    
    const [[{ total }]] = await req.db.query('SELECT COUNT(*) AS total FROM workouts WHERE user_id = ?', [userId]);
    const [rows] = await req.db.query(
      'SELECT w.*, u.username FROM workouts w JOIN users u ON w.user_id = u.user_id WHERE w.user_id = ? ORDER BY w.date DESC LIMIT ? OFFSET ?',
      [userId, pageSize, offset]
    );
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    res.render('list', { title: 'My Workouts', items: rows, page, totalPages });
  } catch (err) { next(err); }
});

// Show add workout form with exercise suggestions from external API
router.get('/add-workout', redirectLogin, async (req, res, next) => {
  const { fetchExerciseSuggestions } = require('../services/exerciseService');
  try {
    const workoutType = req.query.type || 'cardio';
    const suggestions = await fetchExerciseSuggestions(workoutType);
    res.render('addworkout', { 
      title: 'Add Workout', 
      errors: [], 
      values: { type: workoutType },
      suggestions 
    });
  } catch (err) {
    res.render('addworkout', { 
      title: 'Add Workout', 
      errors: [], 
      values: {},
      suggestions: []
    });
  }
});

// Process workout submission with validation
router.post('/workout-added', redirectLogin,
  body('date').isISO8601(),
  body('type').isIn(['cardio','strength','flexibility','balance','sport','other']),
  body('duration_minutes').isInt({ min: 0 }).toInt(),
  body('intensity').isIn(['low','medium','high']),
  body('notes').optional().trim(),
  async (req, res, next) => {
    const { date, type, duration_minutes, intensity } = req.body;
    const notes = req.sanitize(req.body.notes || '');
    const user_id = req.session.user.user_id;
    
    try {
      const result = validationResult(req);
      const errors = result.isEmpty() ? [] : result.array().map(e => e.msg);
      if (errors.length) {
        return res.status(400).render('addworkout', { title: 'Add Workout', errors, values: req.body });
      }
      await req.db.execute(
        'INSERT INTO workouts (user_id, date, type, duration_minutes, intensity, notes) VALUES (?,?,?,?,?,?)',
        [user_id, date, type, duration_minutes, intensity, notes || null]
      );
      res.redirect('/workouts/list');
    } catch (err) {
      res.status(400).render('addworkout', { title: 'Add Workout', errors: ['Unable to save workout'], values: req.body });
    }
  }
);

module.exports = router;
