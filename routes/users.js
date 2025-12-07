const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const router = express.Router();

function redirectLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', errors: [], values: {} });
});

router.post('/registered',
  body('username').trim().isLength({ min: 3 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('first_name').trim().isLength({ min: 1 }).escape(),
  body('last_name').trim().isLength({ min: 1 }).escape(),
  body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  async (req, res, next) => {
    const { username, email, first_name, last_name, password } = req.body;
    try {
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

router.post('/loggedin', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [rows] = await req.db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.render('login', { title: 'Login', message: 'Invalid credentials.' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.hashed_password);
    if (!ok) return res.render('login', { title: 'Login', message: 'Invalid credentials.' });
    req.session.user = { user_id: user.user_id, username: user.username };
    res.redirect('/');
  } catch (err) { next(err); }
});

router.get('/protected', redirectLogin, (req, res) => {
  res.render('protected', { title: 'Protected', user: req.session.user });
});

module.exports = router;
