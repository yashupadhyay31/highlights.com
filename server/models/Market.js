// server/models/Market.js
const mongoose = require('mongoose');

const TickSchema = new mongoose.Schema({
  symbol:     { type: String, required: true, index: true },
  name:       String,
  price:      String,    // formatted display string e.g. "23,456.78"
  rawPrice:   { type: Number, required: true },
  change:     String,    // e.g. "+1.23%"
  isPositive: Boolean,
  type:       { type: String, enum: ['stock', 'commodity', 'forex'], required: true, index: true },
  recordedAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

// TTL index — auto-expire ticks older than 7 days
TickSchema.index({ recordedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

module.exports = mongoose.model('Market', TickSchema);
