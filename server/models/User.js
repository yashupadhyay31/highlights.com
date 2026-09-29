// server/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Auth
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },

  // Profile
  alias:        { type: String, required: true, unique: true, trim: true },
  realName:     String,
  avatar:       String,

  // Role
  role: {
    type: String,
    enum: ['guest', 'user', 'reporter', 'admin'],
    default: 'user',
    index: true
  },

  // Reporter specific
  reporterProfile: {
    trustScore:      { type: Number, default: 0, min: 0, max: 200 },
    tier:            { type: String, enum: ['Rookie', 'Veteran', 'Virtuoso'], default: 'Rookie' },
    approvedReports: { type: Number, default: 0 },
    falseReports:    { type: Number, default: 0 },
    pendingReports:  { type: Number, default: 0 },
    identityVerified: { type: Boolean, default: false },
    deviceFingerprint: String
  },

  // Activity
  watchlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  isActive:   { type: Boolean, default: true },
  lastLoginAt: Date
}, {
  timestamps: true,
  versionKey: false
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Instance method: compare password
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Never return password in API responses
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
