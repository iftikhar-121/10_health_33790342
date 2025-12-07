const express = require('express');
const { query, body } = require('express-validator');
const router = express.Router();

router.get('/search', (req, res) => {
  res.render('search', { title: 'Search Workouts' });
});

router.get('/search-result',
  query('q').optional().trim(),
  query('type').optional().trim(),
  query('intensity').optional().trim(),
  query('mode').optional().isIn(['exact','partial']).default('partial'),
  async (req, res, next) => {
    try {
      const { q = '', type = '', intensity = '', mode = 'partial' } = req.query;
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
      const sql = `SELECT w.*, u.username FROM workouts w JOIN users u ON w.user_id = u.user_id ${where} ORDER BY w.date DESC LIMIT 100`;
      const [rows] = await req.db.query(sql, params);
      res.render('list', { title: 'Search Results', items: rows });
    } catch (err) { next(err); }
  }
);

router.get('/list', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = 20;
    const offset = (page - 1) * pageSize;
    const [[{ total }]] = await req.db.query('SELECT COUNT(*) AS total FROM workouts');
    const [rows] = await req.db.query(
      'SELECT w.*, u.username FROM workouts w JOIN users u ON w.user_id = u.user_id ORDER BY w.date DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    res.render('list', { title: 'Recent Workouts', items: rows, page, totalPages });
  } catch (err) { next(err); }
});

router.get('/add-workout', async (req, res, next) => {
  try {
    const [users] = await req.db.query('SELECT user_id, username FROM users ORDER BY username');
    res.render('addworkout', { title: 'Add Workout', errors: [], values: {}, users });
  } catch (err) { next(err); }
});

router.post('/workout-added',
  body('user_id').isInt({ min: 1 }).toInt(),
  body('date').isISO8601(),
  body('type').isIn(['cardio','strength','flexibility','balance','sport','other']),
  body('duration_minutes').isInt({ min: 0 }).toInt(),
  body('intensity').isIn(['low','medium','high']),
  body('notes').optional().trim(),
  async (req, res, next) => {
    const { user_id, date, type, duration_minutes, intensity } = req.body;
    const notes = req.sanitize(req.body.notes || '');
    try {
      await req.db.execute(
        'INSERT INTO workouts (user_id, date, type, duration_minutes, intensity, notes) VALUES (?,?,?,?,?,?)',
        [user_id, date, type, duration_minutes, intensity, notes || null]
      );
      res.redirect('/workouts/list');
    } catch (err) {
      try {
        const [users] = await req.db.query('SELECT user_id, username FROM users ORDER BY username');
        res.status(400).render('addworkout', { title: 'Add Workout', errors: ['Unable to save workout'], values: req.body, users });
      } catch (e) { next(err); }
    }
  }
);

module.exports = router;
