// server/models/Vote.js
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true, index: true },
  type:    { type: String, enum: ['trust', 'dispute'], required: true }
}, {
  timestamps: true,
  versionKey: false
});

// One vote per user per event
VoteSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
