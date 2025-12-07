const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
});

router.use(apiLimiter);

router.get('/items', async (req, res, next) => {
  try {
    const { search = '', type = '', intensity = '', minDuration = '', maxDuration = '', sort = 'date' } = req.query;
    const clauses = [];
    const params = [];
    if (search) { clauses.push('(type LIKE ? OR notes LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (type) { clauses.push('type = ?'); params.push(type); }
    if (intensity) { clauses.push('intensity = ?'); params.push(intensity); }
    if (minDuration) { clauses.push('duration_minutes >= ?'); params.push(parseInt(minDuration, 10)); }
    if (maxDuration) { clauses.push('duration_minutes <= ?'); params.push(parseInt(maxDuration, 10)); }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const sortWhitelist = { date: 'date DESC', duration: 'duration_minutes DESC', intensity: 'intensity ASC' };
    const orderBy = sortWhitelist[sort] || sortWhitelist.date;
    const sql = `SELECT id, user_id, date, type, duration_minutes, intensity, notes FROM workouts ${where} ORDER BY ${orderBy} LIMIT 200`;
    const [rows] = await req.db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
