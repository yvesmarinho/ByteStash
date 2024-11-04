const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, AUTH_USERNAME, AUTH_PASSWORD, authRequired, TOKEN_EXPIRY } = require('../middleware/auth');

const router = express.Router();

router.get('/config', (req, res) => {
  res.json({ authRequired });
});

router.get('/verify', (req, res) => {
  if (!authRequired) {
    return res.status(200).json({ valid: true });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

router.post('/login', (req, res) => {
  if (!authRequired) {
    return res.status(400).json({ error: 'Authentication is not required' });
  }

  const { username, password } = req.body;

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;