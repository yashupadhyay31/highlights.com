// server/middleware/auth.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'highlights_secret_change_me';

/**
 * requireAuth — verifies the Bearer token and attaches req.user
 */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided' });

    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive)
      return res.status(401).json({ error: 'User not found or inactive' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expired' });
    res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * requireRole(...roles) — must be used after requireAuth
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return res.status(403).json({ error: `Access denied — requires role: ${roles.join(' or ')}` });
    next();
  };
}

module.exports = { requireAuth, requireRole };
