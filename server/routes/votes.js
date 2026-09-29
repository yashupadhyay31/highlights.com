// server/routes/votes.js
const router = require('express').Router();
const Vote   = require('../models/Vote');
const Event  = require('../models/Event');
const { requireAuth } = require('../middleware/auth');

// ── POST /api/votes ── cast or change a vote ──────────────────────────────────
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { eventId, type } = req.body;
    if (!eventId || !['trust', 'dispute'].includes(type))
      return res.status(400).json({ error: 'eventId and type (trust|dispute) required' });

    // Upsert — user can switch their vote
    await Vote.findOneAndUpdate(
      { eventId, userId: req.user._id },
      { type },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // Recalculate trust stats from the Vote collection
    const [trustCount, disputeCount] = await Promise.all([
      Vote.countDocuments({ eventId, type: 'trust' }),
      Vote.countDocuments({ eventId, type: 'dispute' })
    ]);
    const total = trustCount + disputeCount;
    const trustPercentage = total > 0 ? Math.round((trustCount / total) * 100) : 100;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { communityTrust: { trustVotes: trustCount, disputeVotes: disputeCount, trustPercentage } },
      { new: true }
    );

    res.json({ communityTrust: updatedEvent?.communityTrust });
  } catch (err) { next(err); }
});

// ── GET /api/votes/:eventId ── get vote counts for an event ──────────────────
router.get('/:eventId', async (req, res, next) => {
  try {
    const [trustCount, disputeCount] = await Promise.all([
      Vote.countDocuments({ eventId: req.params.eventId, type: 'trust' }),
      Vote.countDocuments({ eventId: req.params.eventId, type: 'dispute' })
    ]);
    const total = trustCount + disputeCount;
    res.json({
      trustVotes: trustCount,
      disputeVotes: disputeCount,
      trustPercentage: total > 0 ? Math.round((trustCount / total) * 100) : 100
    });
  } catch (err) { next(err); }
});

module.exports = router;
