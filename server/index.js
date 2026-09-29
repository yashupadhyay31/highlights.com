// ─────────────────────────────────────────────────────────────────────────────
// server/index.js  –  Highlights.com Express + MongoDB API Server
// ─────────────────────────────────────────────────────────────────────────────
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
require('dotenv').config({ path: '../.env' });   // reads root .env

const eventsRouter   = require('./routes/events');
const usersRouter    = require('./routes/users');
const votesRouter    = require('./routes/votes');
const watchlistRouter = require('./routes/watchlist');
const marketsRouter  = require('./routes/markets');

const app  = express();
const PORT = process.env.SERVER_PORT || 4000;

// ── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

// ── Global Rate Limit (100 req / 15 min per IP) ───────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
}));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/events',    eventsRouter);
app.use('/api/users',     usersRouter);
app.use('/api/votes',     votesRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/markets',   marketsRouter);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error Handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── MongoDB Connection ────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env — please add it and restart.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  dbName: 'highlightsDB'
})
.then(() => {
  console.log('✅  MongoDB Atlas connected — highlightsDB');
  app.listen(PORT, () => {
    console.log(`🚀  Highlights API server running on http://localhost:${PORT}`);
    console.log(`    Health:  http://localhost:${PORT}/api/health`);
  });
})
.catch(err => {
  console.error('❌  MongoDB connection failed:', err.message);
  process.exit(1);
});
