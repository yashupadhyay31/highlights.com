// ─────────────────────────────────────────────────────────────────────────────
// server/index.js  –  Highlights.com Express + MongoDB API Server
// ─────────────────────────────────────────────────────────────────────────────
const path       = require('path');
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

// Support running from highlights.com or highlights.com/server
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { syncCurrentsNews } = require('./services/newsService');
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

// ── Start Express Server & MongoDB Connection ───────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀  Highlights API server running on http://localhost:${PORT}`);
  console.log(`    Health:  http://localhost:${PORT}/api/health`);
  console.log(`    Sync:    POST http://localhost:${PORT}/api/events/sync`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌  Port ${PORT} is already in use. Please stop the other process or set SERVER_PORT in .env.`);
  } else {
    console.error('❌  Server error:', err.message);
  }
});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('⚠️   MONGO_URI is not set in .env. Server will run with database features disabled.');
} else {
  const connectDB = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        dbName: 'highlightsDB',
        serverSelectionTimeoutMS: 5000 // Timeout faster for clear feedback
      });
      console.log('✅  MongoDB Atlas connected — highlightsDB');

      // Ingest latest live news into MongoDB on startup
      syncCurrentsNews({ limit: 30 })
        .catch(err => console.warn('[NewsService Startup]', err.message));

      // Automated periodic sync every 15 minutes
      setInterval(() => {
        syncCurrentsNews({ limit: 30 })
          .catch(err => console.warn('[NewsService Scheduled]', err.message));
      }, 15 * 60 * 1000);
    } catch (err) {
      console.error('❌  MongoDB Atlas connection failed:', err.message);
      console.error('👉  Atlas Troubleshooting Checklist:');
      console.error('    1. IP Whitelist: Go to MongoDB Atlas -> Network Access -> Add IP -> "Allow Access From Anywhere" (0.0.0.0/0).');
      console.error('    2. Database User: Ensure user "yashupadhyay" exists under Atlas -> Database Access with read/write privileges.');
      console.error('    3. Cluster Status: Check if your cluster is paused or active in MongoDB Atlas.');
      console.error('    (Server is still running at http://localhost:' + PORT + ' to allow retrying...)');
    }
  };

  connectDB();
}
