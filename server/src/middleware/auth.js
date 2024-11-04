const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '24h';

const authRequired = !!(AUTH_USERNAME && AUTH_PASSWORD);

const authenticateToken = (req, res, next) => {
  if (!authRequired) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { 
  authenticateToken, 
  authRequired, 
  JWT_SECRET, 
  AUTH_USERNAME, 
  AUTH_PASSWORD,
  TOKEN_EXPIRY 
};