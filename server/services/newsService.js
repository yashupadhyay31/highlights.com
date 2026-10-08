// server/services/newsService.js
const https   = require('https');
const Event   = require('../models/Event');
const { deduplicateEvents } = require('./deduplicationService');

// ─── Keyword to Category Mapping ──────────────────────────────────────────────
const KEYWORD_CATEGORY_MAP = [
  { keywords: ['war', 'military', 'airstrike', 'troops', 'nato', 'missile', 'battle', 'conflict', 'fighting', 'attack', 'bombing', 'army', 'navy', 'combat'], category: 'conflict' },
  { keywords: ['earthquake', 'flood', 'flooding', 'hurricane', 'tsunami', 'wildfire', 'volcano', 'cyclone', 'disaster', 'storm', 'tornado', 'typhoon', 'landslide', 'avalanche', 'blizzard', 'heatwave', 'quake', 'calamity'], category: 'calamity' },
  { keywords: ['drought', 'pollution', 'deforestation', 'climate', 'ecological', 'river', 'water', 'emissions', 'environment', 'environmental', 'nature', 'natural', 'wildlife', 'species', 'forest', 'ocean', 'sea', 'ecosystem', 'biodiversity', 'fauna', 'flora', 'habitat', 'conservation', 'extinction', 'planet', 'plastic', 'recycle', 'greenhouse', 'renewable', 'glacier'], category: 'environmental' },
  { keywords: ['corruption', 'fraud', 'bribery', 'embezzlement', 'money laundering', 'scam', 'scandal', 'bribe', 'graft'], category: 'corruption' },
  { keywords: ['crime', 'cartel', 'arrest', 'murder', 'shooting', 'terror', 'drug', 'heist', 'smuggling', 'kidnapping', 'gang', 'homicide'], category: 'crime' },
  { keywords: ['cyber', 'hack', 'data breach', 'ransomware', 'ai', 'technology', 'digital', 'software', 'chip', 'tech', 'satellite', 'blackout', 'grid', 'outage'], category: 'technology' },
  { keywords: ['election', 'protest', 'demonstration', 'coup', 'parliament', 'president', 'government', 'political', 'vote', 'summit', 'minister', 'diplomacy', 'lawmaker'], category: 'politics' },
  { keywords: ['sanction', 'trade', 'tariff', 'economy', 'recession', 'gdp', 'inflation', 'bank', 'stock', 'market', 'financial'], category: 'corruption' }
];

const SEVERITY_HIGH = ['nuclear', 'mass casualty', 'genocide', 'hundreds killed', 'thousands displaced', 'category 5', 'magnitude 7', 'magnitude 8'];
const SEVERITY_MEDIUM = ['dozens killed', 'dozens injured', 'evacuated', 'strike', 'clash', 'protests', 'arrested'];

const COUNTRY_COORDS = {
  // ── Middle East ──────────────────────────────────────────────────────────────
  'saudi arabia':       { lat: 23.885,  lng: 45.079,   region: 'Middle East' },
  'united arab emirates': { lat: 23.424, lng: 53.847,  region: 'Middle East' },
  'uae':                { lat: 23.424,  lng: 53.847,   region: 'Middle East' },
  'north korea':        { lat: 40.339,  lng: 127.510,  region: 'Asia Pacific' },
  'south korea':        { lat: 35.907,  lng: 127.766,  region: 'Asia Pacific' },
  'south africa':       { lat: -30.559, lng: 22.937,   region: 'Africa' },
  'south sudan':        { lat: 6.877,   lng: 31.307,   region: 'Africa' },
  'costa rica':         { lat: 9.748,   lng: -83.753,  region: 'North America' },
  'dominican republic': { lat: 18.736,  lng: -70.162,  region: 'North America' },
  'el salvador':        { lat: 13.794,  lng: -88.896,  region: 'North America' },
  'new zealand':        { lat: -40.900, lng: 174.885,  region: 'Asia Pacific' },
  'papua new guinea':   { lat: -6.314,  lng: 143.955,  region: 'Asia Pacific' },
  'sierra leone':       { lat: 8.460,   lng: -11.779,  region: 'Africa' },
  'trinidad and tobago': { lat: 10.691, lng: -61.222,  region: 'South America' },
  'united kingdom':     { lat: 55.378,  lng: -3.435,   region: 'Europe' },
  'united states':      { lat: 37.090,  lng: -95.712,  region: 'North America' },
  'central african republic': { lat: 6.611, lng: 20.939, region: 'Africa' },
  'democratic republic of the congo': { lat: -4.038, lng: 21.758, region: 'Africa' },
  'burkina faso':       { lat: 12.364,  lng: -1.561,   region: 'Africa' },
  'equatorial guinea':  { lat: 1.650,   lng: 10.267,   region: 'Africa' },
  'israel':             { lat: 31.046,  lng: 34.851,   region: 'Middle East' },
  'gaza':               { lat: 31.354,  lng: 34.308,   region: 'Middle East' },
  'west bank':          { lat: 31.952,  lng: 35.233,   region: 'Middle East' },
  'palestine':          { lat: 31.952,  lng: 35.233,   region: 'Middle East' },
  'iran':               { lat: 32.427,  lng: 53.688,   region: 'Middle East' },
  'iraq':               { lat: 33.223,  lng: 43.679,   region: 'Middle East' },
  'syria':              { lat: 34.802,  lng: 38.996,   region: 'Middle East' },
  'lebanon':            { lat: 33.854,  lng: 35.862,   region: 'Middle East' },
  'jordan':             { lat: 30.585,  lng: 36.238,   region: 'Middle East' },
  'turkey':             { lat: 38.963,  lng: 35.243,   region: 'Middle East' },
  'yemen':              { lat: 15.552,  lng: 48.516,   region: 'Middle East' },
  'oman':               { lat: 21.512,  lng: 55.922,   region: 'Middle East' },
  'qatar':              { lat: 25.354,  lng: 51.183,   region: 'Middle East' },
  'kuwait':             { lat: 29.311,  lng: 47.481,   region: 'Middle East' },
  'bahrain':            { lat: 25.930,  lng: 50.637,   region: 'Middle East' },
  // ── Europe ───────────────────────────────────────────────────────────────────
  'ukraine':            { lat: 48.379,  lng: 31.165,   region: 'Europe' },
  'russia':             { lat: 61.524,  lng: 105.318,  region: 'Europe' },
  'france':             { lat: 46.227,  lng: 2.213,    region: 'Europe' },
  'germany':            { lat: 51.165,  lng: 10.451,   region: 'Europe' },
  'uk':                 { lat: 55.378,  lng: -3.435,   region: 'Europe' },
  'britain':            { lat: 55.378,  lng: -3.435,   region: 'Europe' },
  'england':            { lat: 52.355,  lng: -1.174,   region: 'Europe' },
  'italy':              { lat: 41.871,  lng: 12.567,   region: 'Europe' },
  'spain':              { lat: 40.463,  lng: -3.749,   region: 'Europe' },
  'poland':             { lat: 51.919,  lng: 19.145,   region: 'Europe' },
  'romania':            { lat: 45.943,  lng: 24.966,   region: 'Europe' },
  'netherlands':        { lat: 52.132,  lng: 5.291,    region: 'Europe' },
  'belgium':            { lat: 50.503,  lng: 4.469,    region: 'Europe' },
  'sweden':             { lat: 60.128,  lng: 18.643,   region: 'Europe' },
  'norway':             { lat: 60.472,  lng: 8.468,    region: 'Europe' },
  'denmark':            { lat: 56.263,  lng: 9.501,    region: 'Europe' },
  'finland':            { lat: 61.924,  lng: 25.748,   region: 'Europe' },
  'portugal':           { lat: 39.399,  lng: -8.224,   region: 'Europe' },
  'austria':            { lat: 47.516,  lng: 14.550,   region: 'Europe' },
  'switzerland':        { lat: 46.818,  lng: 8.227,    region: 'Europe' },
  'hungary':            { lat: 47.162,  lng: 19.503,   region: 'Europe' },
  'czech republic':     { lat: 49.817,  lng: 15.472,   region: 'Europe' },
  'czechia':            { lat: 49.817,  lng: 15.472,   region: 'Europe' },
  'slovakia':           { lat: 48.668,  lng: 19.699,   region: 'Europe' },
  'serbia':             { lat: 44.016,  lng: 21.005,   region: 'Europe' },
  'croatia':            { lat: 45.100,  lng: 15.200,   region: 'Europe' },
  'greece':             { lat: 39.074,  lng: 21.824,   region: 'Europe' },
  'bulgaria':           { lat: 42.733,  lng: 25.485,   region: 'Europe' },
  'belarus':            { lat: 53.709,  lng: 27.953,   region: 'Europe' },
  'moldova':            { lat: 47.411,  lng: 28.369,   region: 'Europe' },
  'albania':            { lat: 41.153,  lng: 20.168,   region: 'Europe' },
  'kosovo':             { lat: 42.602,  lng: 20.902,   region: 'Europe' },
  'north macedonia':    { lat: 41.608,  lng: 21.745,   region: 'Europe' },
  'bosnia':             { lat: 43.915,  lng: 17.679,   region: 'Europe' },
  'latvia':             { lat: 56.879,  lng: 24.603,   region: 'Europe' },
  'lithuania':          { lat: 55.169,  lng: 23.881,   region: 'Europe' },
  'estonia':            { lat: 58.595,  lng: 25.013,   region: 'Europe' },
  'ireland':            { lat: 53.412,  lng: -8.243,   region: 'Europe' },
  'iceland':            { lat: 64.963,  lng: -19.020,  region: 'Europe' },
  'luxembourg':         { lat: 49.815,  lng: 6.129,    region: 'Europe' },
  // ── Asia Pacific ─────────────────────────────────────────────────────────────
  'china':              { lat: 35.861,  lng: 104.195,  region: 'Asia Pacific' },
  'india':              { lat: 20.593,  lng: 78.962,   region: 'Asia Pacific' },
  'taiwan':             { lat: 23.697,  lng: 120.960,  region: 'Asia Pacific' },
  'japan':              { lat: 36.204,  lng: 138.252,  region: 'Asia Pacific' },
  'pakistan':           { lat: 30.375,  lng: 69.345,   region: 'Asia Pacific' },
  'myanmar':            { lat: 16.871,  lng: 96.195,   region: 'Asia Pacific' },
  'afghanistan':        { lat: 33.930,  lng: 67.709,   region: 'Asia Pacific' },
  'indonesia':          { lat: -0.789,  lng: 113.921,  region: 'Asia Pacific' },
  'philippines':        { lat: 12.879,  lng: 121.774,  region: 'Asia Pacific' },
  'vietnam':            { lat: 14.058,  lng: 108.277,  region: 'Asia Pacific' },
  'thailand':           { lat: 15.870,  lng: 100.992,  region: 'Asia Pacific' },
  'malaysia':           { lat: 4.210,   lng: 108.984,  region: 'Asia Pacific' },
  'bangladesh':         { lat: 23.684,  lng: 90.356,   region: 'Asia Pacific' },
  'sri lanka':          { lat: 7.873,   lng: 80.771,   region: 'Asia Pacific' },
  'nepal':              { lat: 28.394,  lng: 84.124,   region: 'Asia Pacific' },
  'cambodia':           { lat: 12.565,  lng: 104.990,  region: 'Asia Pacific' },
  'laos':               { lat: 19.856,  lng: 102.495,  region: 'Asia Pacific' },
  'mongolia':           { lat: 46.862,  lng: 103.846,  region: 'Asia Pacific' },
  'uzbekistan':         { lat: 41.299,  lng: 63.239,   region: 'Asia Pacific' },
  'kazakhstan':         { lat: 48.019,  lng: 66.923,   region: 'Asia Pacific' },
  'azerbaijan':         { lat: 40.143,  lng: 47.576,   region: 'Asia Pacific' },
  'georgia':            { lat: 42.315,  lng: 43.356,   region: 'Asia Pacific' },
  'armenia':            { lat: 40.069,  lng: 45.038,   region: 'Asia Pacific' },
  'singapore':          { lat: 1.352,   lng: 103.819,  region: 'Asia Pacific' },
  'australia':          { lat: -25.274, lng: 133.775,  region: 'Asia Pacific' },
  // ── North America ────────────────────────────────────────────────────────────
  'usa':                { lat: 37.090,  lng: -95.712,  region: 'North America' },
  'america':            { lat: 37.090,  lng: -95.712,  region: 'North America' },
  'canada':             { lat: 56.130,  lng: -106.346, region: 'North America' },
  'mexico':             { lat: 23.634,  lng: -102.552, region: 'North America' },
  'cuba':               { lat: 21.521,  lng: -77.781,  region: 'North America' },
  'haiti':              { lat: 18.971,  lng: -72.285,  region: 'North America' },
  'honduras':           { lat: 15.200,  lng: -86.241,  region: 'North America' },
  'guatemala':          { lat: 15.783,  lng: -90.230,  region: 'North America' },
  'nicaragua':          { lat: 12.865,  lng: -85.207,  region: 'North America' },
  'panama':             { lat: 8.537,   lng: -80.782,  region: 'North America' },
  'jamaica':            { lat: 18.109,  lng: -77.297,  region: 'North America' },
  // ── South America ────────────────────────────────────────────────────────────
  'brazil':             { lat: -14.235, lng: -51.925,  region: 'South America' },
  'colombia':           { lat: 4.571,   lng: -74.297,  region: 'South America' },
  'venezuela':          { lat: 6.423,   lng: -66.589,  region: 'South America' },
  'argentina':          { lat: -38.416, lng: -63.616,  region: 'South America' },
  'chile':              { lat: -35.675, lng: -71.542,  region: 'South America' },
  'peru':               { lat: -9.189,  lng: -75.015,  region: 'South America' },
  'bolivia':            { lat: -16.290, lng: -63.588,  region: 'South America' },
  'ecuador':            { lat: -1.831,  lng: -78.183,  region: 'South America' },
  'paraguay':           { lat: -23.442, lng: -58.443,  region: 'South America' },
  'uruguay':            { lat: -32.522, lng: -55.765,  region: 'South America' },
  'guyana':             { lat: 4.860,   lng: -58.930,  region: 'South America' },
  'suriname':           { lat: 3.919,   lng: -56.027,  region: 'South America' },
  // ── Africa ───────────────────────────────────────────────────────────────────
  'nigeria':            { lat: 9.082,   lng: 8.675,    region: 'Africa' },
  'ethiopia':           { lat: 9.145,   lng: 40.489,   region: 'Africa' },
  'kenya':              { lat: -0.023,  lng: 37.906,   region: 'Africa' },
  'sudan':              { lat: 12.862,  lng: 30.217,   region: 'Africa' },
  'somalia':            { lat: 5.152,   lng: 46.199,   region: 'Africa' },
  'egypt':              { lat: 26.820,  lng: 30.802,   region: 'Africa' },
  'libya':              { lat: 26.335,  lng: 17.228,   region: 'Africa' },
  'algeria':            { lat: 28.033,  lng: 1.659,    region: 'Africa' },
  'morocco':            { lat: 31.791,  lng: -7.092,   region: 'Africa' },
  'ghana':              { lat: 7.946,   lng: -1.023,   region: 'Africa' },
  'tanzania':           { lat: -6.369,  lng: 34.888,   region: 'Africa' },
  'mozambique':         { lat: -18.665, lng: 35.529,   region: 'Africa' },
  'zambia':             { lat: -13.133, lng: 27.849,   region: 'Africa' },
  'zimbabwe':           { lat: -19.015, lng: 29.154,   region: 'Africa' },
  'angola':             { lat: -11.202, lng: 17.873,   region: 'Africa' },
  'cameroon':           { lat: 7.369,   lng: 12.354,   region: 'Africa' },
  'senegal':            { lat: 14.497,  lng: -14.452,  region: 'Africa' },
  'mali':               { lat: 17.570,  lng: -3.996,   region: 'Africa' },
  'niger':              { lat: 17.607,  lng: 8.081,    region: 'Africa' },
  'chad':               { lat: 15.454,  lng: 18.732,   region: 'Africa' },
  'mauritania':         { lat: 21.007,  lng: -10.940,  region: 'Africa' },
  'madagascar':         { lat: -18.766, lng: 46.869,   region: 'Africa' },
  'rwanda':             { lat: -1.940,  lng: 29.873,   region: 'Africa' },
  'congo':              { lat: -0.228,  lng: 15.827,   region: 'Africa' },
  'uganda':             { lat: 1.373,   lng: 32.290,   region: 'Africa' },
  'malawi':             { lat: -13.254, lng: 34.301,   region: 'Africa' },
  'zambia':             { lat: -13.133, lng: 27.849,   region: 'Africa' },
  'gabon':              { lat: -0.803,  lng: 11.609,   region: 'Africa' },
  'togo':               { lat: 8.619,   lng: 0.824,    region: 'Africa' },
  'benin':              { lat: 9.307,   lng: 2.315,    region: 'Africa' },
  'guinea':             { lat: 9.945,   lng: -9.696,   region: 'Africa' },
  'tunisia':            { lat: 33.886,  lng: 9.537,    region: 'Africa' },
};

// Sort entries longest-first so multi-word names (e.g. "saudi arabia") win over
// their substrings (e.g. "arabia" doesn't exist, but avoids partial matches like
// "iran" inside "ukraine" which is handled by the word-boundary regex below).
const COUNTRY_COORDS_SORTED = Object.entries(COUNTRY_COORDS)
  .sort((a, b) => b[0].length - a[0].length);

const CATEGORY_SUBCATEGORY = {
  conflict: 'Armed Conflict & Military Operations',
  calamity: 'Natural Disaster & Emergency Response',
  corruption: 'Financial Crime & Institutional Fraud',
  crime: 'Criminal Activity & Security Threat',
  politics: 'Political Crisis & Civil Unrest',
  environmental: 'Ecological & Water Security',
  technology: 'Cyber Warfare & Digital Threats',
};

const CATEGORY_COLORS = {
  conflict: '#EF4444',
  calamity: '#06B6D4',
  corruption: '#F59E0B',
  crime: '#EC4899',
  politics: '#8B5CF6',
  environmental: '#22C55E',
  technology: '#3B82F6',
};

function detectCategory(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();

  for (const { keywords, category } of KEYWORD_CATEGORY_MAP) {
    if (keywords.some(k => text.includes(k))) return category;
  }

  // Fallback heuristic for environmental/nature topics before generic politics
  if (/\b(nature|wildlife|animal|forest|sea|ocean|lake|river|tree|species|rain|weather|climate|park|conservation|sanctuary|reef|coral|fauna|flora)\b/i.test(text)) {
    return 'environmental';
  }

  return 'politics';
}

function detectSeverity(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  if (SEVERITY_HIGH.some(k => text.includes(k))) return 'critical';
  if (SEVERITY_MEDIUM.some(k => text.includes(k))) return 'high';
  return 'medium';
}

function detectCoords(title = '', description = '', author = '') {
  const text = `${title} ${description} ${author}`.toLowerCase();
  // Use word-boundary regex to avoid false positives (e.g. "iran" inside "ukraine").
  // Entries are pre-sorted longest-first so multi-word country names win.
  for (const [country, coords] of COUNTRY_COORDS_SORTED) {
    // Escape special regex chars in country name, then wrap in word boundaries
    const escaped = country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`);
    if (regex.test(text)) {
      return { ...coords, country: country.replace(/\b\w/g, l => l.toUpperCase()) };
    }
  }
  // Stable fallback – no random coordinates so pins don't jump between renders
  return {
    lat: 0,
    lng: 0,
    country: 'International',
    region: 'Global'
  };
}

// Reliable HTTP GET using native https with headers, timeout, and redirect support
function httpGetJson(urlStr) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlStr);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Highlights/1.0',
        'Accept': 'application/json, text/plain, */*'
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            const err = new Error(parsed?.message || `HTTP ${res.statusCode}`);
            err.status = res.statusCode;
            err.data = parsed;
            return reject(err);
          }
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse response (HTTP ${res.statusCode}): ${e.message}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Connection timed out while contacting Currents API'));
    });

    req.on('error', (err) => {
      reject(new Error(`Network error contacting Currents API: ${err.message}`));
    });

    req.end();
  });
}

/**
 * Format a Currents API article into an Event document
 */
function articleToEvent(article, index) {
  const category = detectCategory(article.title, article.description);
  const severity = detectSeverity(article.title, article.description);
  const coords   = detectCoords(article.title, article.description, article.author);
  const pubDate  = article.published ? new Date(article.published) : new Date();

  return {
    externalId:         article.id || `currents-${index}-${Date.now()}`,
    title:              article.title || 'Untitled Report',
    summary:            article.description || article.title || '',
    category,
    subcategory:        CATEGORY_SUBCATEGORY[category] || 'Breaking News',
    severity,
    tags:               [category, coords.region || 'Global', 'live'],
    color:              CATEGORY_COLORS[category] || '#6B7280',
    location: {
      lat:     coords.lat,
      lng:     coords.lng,
      city:    coords.country,
      country: coords.country,
      region:  coords.region
    },
    verificationStatus: 'UNVERIFIED',
    isHotAlert:         severity === 'critical',
    isLive:             true,
    sourceUrl:          article.url,
    sources: [
      {
        name:        article.author || 'News Wire',
        type:        'Media',
        credibility: 70,
        url:         article.url
      }
    ],
    communityTrust: {
      trustVotes:      0,
      disputeVotes:    0,
      trustPercentage: 100
    },
    publishedAt:        isNaN(pubDate.getTime()) ? new Date() : pubDate,
    date:               article.published ? article.published.split(' ')[0] : new Date().toISOString().split('T')[0]
  };
}

let lastSyncTimestamp = 0;
const SYNC_COOLDOWN_MS = 60 * 1000; // 1-minute cooldown

/**
 * Sync latest news from Currents API directly into MongoDB Atlas.
 * Upserts by externalId so duplicates are avoided.
 * Gracefully handles rate limits and API errors.
 */
async function syncCurrentsNews({ limit = 30, force = false } = {}) {
  const apiKey = process.env.CURRENTS_API_KEY || process.env.VITE_CURRENTS_API_KEY;

  if (!apiKey) {
    console.warn('[NewsService] CURRENTS_API_KEY is not configured in .env. Skipping live sync.');
    return {
      success: false,
      error: 'Missing CURRENTS_API_KEY',
      rateLimited: false
    };
  }

  // Check cooldown unless forced
  const now = Date.now();
  if (!force && (now - lastSyncTimestamp < SYNC_COOLDOWN_MS)) {
    return {
      success: true,
      cached: true,
      message: 'Sync recently completed. Serving existing database news.'
    };
  }

  const url = `https://api.currentsapi.services/v1/latest-news?language=en&apiKey=${encodeURIComponent(apiKey)}`;

  try {
    console.log('[NewsService] Fetching latest live news from Currents API...');
    const data = await httpGetJson(url);

    if (data.status === 'error') {
      const isRateLimit = data.code === 429 || /rate limit|quota/i.test(data.message || '');
      console.warn(`[NewsService] Currents API returned error (${data.code}): ${data.message}`);
      return {
        success: false,
        error: data.message,
        rateLimited: isRateLimit
      };
    }

    const rawArticles = (data.news || []).slice(0, limit);
    if (rawArticles.length === 0) {
      console.log('[NewsService] No articles returned by Currents API.');
      return { success: true, count: 0, upserted: 0, matched: 0 };
    }

    const events = rawArticles.map(articleToEvent);

    // Bulk upsert into MongoDB
    const ops = events.map(ev => ({
      updateOne: {
        filter: { externalId: ev.externalId },
        update: { $set: ev },
        upsert: true
      }
    }));

    const result = await Event.bulkWrite(ops);
    const upsertedCount = result.upsertedCount || 0;
    const modifiedCount = result.modifiedCount || 0;

    // Run AI Cluster Deduplication & Source Merging Engine
    let dedupStats = { clustersFound: 0, mergedEventsCount: 0, removedDuplicatesCount: 0 };
    try {
      dedupStats = await deduplicateEvents();
    } catch (dErr) {
      console.warn('[NewsService] Automated deduplication step encountered a non-fatal warning:', dErr.message);
    }

    lastSyncTimestamp = Date.now();
    console.log(`[NewsService] Successfully synced ${rawArticles.length} live articles to MongoDB Atlas (upserted: ${upsertedCount}, updated: ${modifiedCount}, deduplicated clusters: ${dedupStats.mergedEventsCount}).`);

    return {
      success: true,
      count: rawArticles.length,
      upserted: upsertedCount,
      modified: modifiedCount,
      matched: result.matchedCount || 0,
      deduplication: dedupStats
    };
  } catch (err) {
    const isRateLimit = err.status === 429 || /rate limit|quota/i.test(err.message || '');
    if (isRateLimit) {
      console.warn('[NewsService] Currents API rate limit exceeded. Existing MongoDB events will be served.');
    } else {
      console.error('[NewsService] Failed to fetch or sync news from Currents API:', err.message);
    }

    return {
      success: false,
      error: err.message,
      rateLimited: isRateLimit
    };
  }
}

module.exports = {
  syncCurrentsNews,
  articleToEvent
};
