// server/routes/watchlist.js
const router = require('express').Router();
const User   = require('../models/User');
const Event  = require('../models/Event');
const { requireAuth } = require('../middleware/auth');

// ── GET /api/watchlist ── get user's saved events ─────────────────────────────
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchlist')
      .lean();
    res.json(user?.watchlist || []);
  } catch (err) { next(err); }
});

// ── POST /api/watchlist/:eventId ── add to watchlist ─────────────────────────
router.post('/:eventId', requireAuth, async (req, res, next) => {
  try {
    const eventExists = await Event.exists({ _id: req.params.eventId });
    if (!eventExists) return res.status(404).json({ error: 'Event not found' });

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchlist: req.params.eventId } }
    );
    res.json({ saved: true, eventId: req.params.eventId });
  } catch (err) { next(err); }
});

// ── DELETE /api/watchlist/:eventId ── remove from watchlist ──────────────────
router.delete('/:eventId', requireAuth, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { watchlist: req.params.eventId } }
    );
    res.json({ saved: false, eventId: req.params.eventId });
  } catch (err) { next(err); }
});

module.exports = router;
