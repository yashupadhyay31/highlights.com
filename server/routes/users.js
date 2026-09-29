// server/routes/users.js
const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const JWT_SECRET  = process.env.JWT_SECRET  || 'highlights_secret_change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// ── POST /api/users/register ──────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { email, alias, password, realName } = req.body;
    if (!email || !alias || !password)
      return res.status(400).json({ error: 'email, alias and password are required' });

    const existing = await User.findOne({ $or: [{ email }, { alias }] });
    if (existing) return res.status(409).json({ error: 'Email or alias already taken' });

    const user = await User.create({ email, alias, realName, passwordHash: password });
    const token = signToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
});

// ── POST /api/users/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user._id);
    res.json({ token, user });
  } catch (err) { next(err); }
});

// ── GET /api/users/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  res.json(req.user);
});

// ── PATCH /api/users/me ── update profile ────────────────────────────────────
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const allowed = ['alias', 'realName', 'avatar'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (err) { next(err); }
});

// ── GET /api/users/:id ── public reporter profile ────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('alias role reporterProfile createdAt')
      .lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

module.exports = router;
