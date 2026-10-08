// server/routes/markets.js
const router = require('express').Router();
const Market = require('../models/Market');
const { syncMarketIndices, getLatestStockIndices } = require('../services/marketService');
const { syncForexRates, getLatestForexRates } = require('../services/forexService');
const { syncCommodityPrices, getLatestCommodityPrices } = require('../services/commodityService');

// ── GET /api/markets/forex ── live forex rates from Twelve Data ───────────────
router.get('/forex', async (req, res, next) => {
  try {
    const force = req.query.force === 'true';
    const result = await syncForexRates(force);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/markets/commodities ── live commodity prices from Twelve Data ────
router.get('/commodities', async (req, res, next) => {
  try {
    const force = req.query.force === 'true';
    const result = await syncCommodityPrices(force);
    res.json(result);
  } catch (err) {
    next(err);
  }
});



// ── GET /api/markets/indices ── live global stock indices from Twelve Data ────
router.get('/indices', async (req, res, next) => {
  try {
    const force = req.query.force === 'true';
    const result = await syncMarketIndices(force);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/markets/latest ── latest tick per symbol ─────────────────────────
router.get('/latest', async (req, res, next) => {
  try {
    // Aggregate: most recent tick per symbol
    const ticks = await Market.aggregate([
      { $sort: { recordedAt: -1 } },
      { $group: { _id: '$symbol', tick: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$tick' } },
      { $sort: { type: 1, symbol: 1 } }
    ]);

    if (!ticks || ticks.length === 0) {
      // Fallback to in-memory cached indices
      return res.json(getLatestStockIndices());
    }

    res.json(ticks);
  } catch (err) { next(err); }
});

// ── GET /api/markets/history/:symbol ── last N ticks for a symbol ─────────────
router.get('/history/:symbol', async (req, res, next) => {
  try {
    const { limit = 60 } = req.query;
    const ticks = await Market.find({ symbol: req.params.symbol.toUpperCase() })
      .sort({ recordedAt: -1 })
      .limit(Number(limit))
      .lean();
    res.json(ticks.reverse()); // chronological order
  } catch (err) { next(err); }
});

// ── POST /api/markets/snapshot ── bulk record a market snapshot ───────────────
// Called internally by a cron/timer to persist a price snapshot
router.post('/snapshot', async (req, res, next) => {
  try {
    const { ticks } = req.body;   // array of Market-shaped objects
    if (!Array.isArray(ticks)) return res.status(400).json({ error: 'ticks must be an array' });

    const docs = ticks.map(t => ({ ...t, recordedAt: new Date() }));
    await Market.insertMany(docs, { ordered: false });
    res.json({ recorded: docs.length });
  } catch (err) { next(err); }
});

module.exports = router;
