const express = require('express');
const router = express.Router();

router.get('/items', async (req, res, next) => {
  try {
    const [rows] = await req.db.query('SELECT id, user_id, date, type, duration_minutes, intensity, notes FROM workouts ORDER BY date DESC LIMIT 100');
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
