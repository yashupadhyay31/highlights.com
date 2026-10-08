const mongoose = require('mongoose');
const router   = require('express').Router();
const Event    = require('../models/Event');
const { requireAuth, requireRole } = require('../middleware/auth');
const { syncCurrentsNews } = require('../services/newsService');
const { deduplicateEvents } = require('../services/deduplicationService');
const { syncSocialFirehose } = require('../services/firehoseService');

// ── GET & POST /api/events/sync ── trigger Currents API sync into MongoDB Atlas ──
const handleSync = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || req.body?.limit || 30);
    const force = req.query.force === 'true' || req.body?.force === true;
    const result = await syncCurrentsNews({ limit, force });
    res.json(result);
  } catch (err) { next(err); }
};
router.get('/sync', handleSync);
router.post('/sync', handleSync);

// ── GET & POST /api/events/firehose/sync ── trigger RSS/Telegram/Twitter ingestion ──
const handleFirehoseSync = async (_req, res, next) => {
  try {
    const result = await syncSocialFirehose();
    res.json(result);
  } catch (err) { next(err); }
};
router.get('/firehose/sync', handleFirehoseSync);
router.post('/firehose/sync', handleFirehoseSync);

// ── GET /api/events/firehose ── retrieve firehose events ──
router.get('/firehose', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 30);
    const events = await Event.find({ tags: 'firehose' }).sort({ publishedAt: -1 }).limit(limit).lean();
    res.json(events);
  } catch (err) { next(err); }
});

// ── GET & POST /api/events/deduplicate ── trigger AI cluster merging manually ──
const handleDeduplicate = async (_req, res, next) => {
  try {
    const stats = await deduplicateEvents();
    res.json({ success: true, ...stats });
  } catch (err) { next(err); }
};
router.get('/deduplicate', handleDeduplicate);
router.post('/deduplicate', handleDeduplicate);

// ── GET /api/events/live ── get latest live news events from MongoDB ─────────
router.get('/live', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 30);
    let liveEvents = await Event.find({ isLive: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    // If no live events in DB yet, attempt initial sync
    if (liveEvents.length === 0) {
      await syncCurrentsNews({ limit });
      liveEvents = await Event.find({ isLive: true })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
    }

    res.json(liveEvents);
  } catch (err) { next(err); }
});

// ── GET /api/events ── list with filters, pagination ──────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const {
      category, severity, region, verificationStatus,
      search, page = 1, limit = 50, sortBy = 'publishedAt'
    } = req.query;

    const filter = {};
    if (category && category !== 'all')            filter.category = category;
    if (severity && severity !== 'all')            filter.severity = severity;
    if (verificationStatus && verificationStatus !== 'all') filter.verificationStatus = verificationStatus;
    if (region && region !== 'all')                filter['location.region'] = new RegExp(region, 'i');
    if (search)                                    filter.$text = { $search: search };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ [sortBy]: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Event.countDocuments(filter)
    ]);

    res.json({ events, total, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
});

// ── GET /api/events/hot ── isHotAlert events ──────────────────────────────────
router.get('/hot', async (_req, res, next) => {
  try {
    const hot = await Event.find({ isHotAlert: true })
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();
    res.json(hot);
  } catch (err) { next(err); }
});

// ── GET /api/events/:id ── single event (by ObjectId or externalId) ─────────
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let event = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id).lean();
    }
    if (!event) {
      event = await Event.findOne({ externalId: id }).lean();
    }
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) { next(err); }
});

// ── POST /api/events ── create (reporter+) ────────────────────────────────────
router.post('/', requireAuth, requireRole('reporter', 'admin'), async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      verificationStatus: 'UNDER_REVIEW',
      isLive: false,
      reporter: {
        alias:      req.user.alias,
        userId:     req.user._id,
        level:      req.user.reporterProfile?.tier,
        trustScore: req.user.reporterProfile?.trustScore
      }
    });
    res.status(201).json(event);
  } catch (err) { next(err); }
});

// ── PATCH /api/events/:id/moderate ── admin moderation ───────────────────────
router.patch('/:id/moderate', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { decision } = req.body; // 'approve' | 'reject' | 'correct'
    const statusMap = { approve: 'VERIFIED', reject: 'DISPUTED', correct: 'NEEDS_CORRECTION' };
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: statusMap[decision] || 'UNDER_REVIEW' },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) { next(err); }
});

// ── POST /api/events/bulk-upsert ── internal: cache live news articles ────────
// Called by the server's own news sync job — not exposed to public clients
router.post('/bulk-upsert', async (req, res, next) => {
  try {
    const { articles } = req.body; // array of event-shaped objects
    if (!Array.isArray(articles)) return res.status(400).json({ error: 'articles must be an array' });

    const ops = articles.map(a => ({
      updateOne: {
        filter: { externalId: a.externalId },
        update: { $setOnInsert: { ...a, publishedAt: a.publishedAt || new Date() } },
        upsert: true
      }
    }));
    const result = await Event.bulkWrite(ops);
    res.json({ upserted: result.upsertedCount, matched: result.matchedCount });
  } catch (err) { next(err); }
});

module.exports = router;
