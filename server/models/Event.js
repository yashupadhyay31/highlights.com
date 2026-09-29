// server/models/Event.js
const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  type:        { type: String, enum: ['Media', 'Government', 'NGO', 'Witness', 'Wire', 'Other'], default: 'Wire' },
  credibility: { type: Number, min: 0, max: 100, default: 70 },
  url:         { type: String }
}, { _id: false });

const LocationSchema = new mongoose.Schema({
  lat:     { type: Number, required: true },
  lng:     { type: Number, required: true },
  city:    { type: String },
  country: { type: String },
  region:  { type: String }
}, { _id: false });

const CommunityTrustSchema = new mongoose.Schema({
  trustVotes:      { type: Number, default: 0 },
  disputeVotes:    { type: Number, default: 0 },
  trustPercentage: { type: Number, default: 100 }
}, { _id: false });

const ReporterRefSchema = new mongoose.Schema({
  alias:      String,
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  level:      String,
  trustScore: Number
}, { _id: false });

const EventSchema = new mongoose.Schema({
  // Identity
  externalId:  { type: String, index: true },   // Currents API article id
  title:       { type: String, required: true, index: 'text' },
  summary:     { type: String, index: 'text' },

  // Classification
  category:    {
    type: String,
    enum: ['conflict', 'calamity', 'corruption', 'crime', 'politics', 'environmental', 'technology'],
    required: true,
    index: true
  },
  subcategory: String,
  severity:    {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },
  tags:        [{ type: String }],
  color:       String,

  // Geo
  location: { type: LocationSchema, required: true },

  // Verification
  verificationStatus: {
    type: String,
    enum: ['VERIFIED', 'UNVERIFIED', 'UNDER_REVIEW', 'DISPUTED', 'NEEDS_CORRECTION'],
    default: 'UNVERIFIED',
    index: true
  },

  // Flags
  isHotAlert:  { type: Boolean, default: false, index: true },
  isLive:      { type: Boolean, default: false },  // true = came from Currents API
  sourceUrl:   { type: String },

  // Relations
  sources:       [SourceSchema],
  communityTrust: { type: CommunityTrustSchema, default: {} },
  reporter:      ReporterRefSchema,

  // Timestamps
  publishedAt:   { type: Date, default: Date.now, index: true },
  date:          String
}, {
  timestamps: true,     // adds createdAt, updatedAt
  versionKey: false
});

// Text search index
EventSchema.index({ title: 'text', summary: 'text', 'location.country': 'text' });

// Geo index for proximity searches
EventSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Event', EventSchema);
