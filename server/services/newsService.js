// server/services/newsService.js
const https   = require('https');
const Event   = require('../models/Event');

// ─── Keyword to Category Mapping ──────────────────────────────────────────────
const KEYWORD_CATEGORY_MAP = [
  { keywords: ['war', 'military', 'airstrike', 'troops', 'nato', 'missile', 'battle', 'conflict', 'fighting', 'attack', 'bombing'], category: 'conflict' },
  { keywords: ['earthquake', 'flood', 'hurricane', 'tsunami', 'wildfire', 'volcano', 'cyclone', 'disaster', 'storm', 'tornado'], category: 'calamity' },
  { keywords: ['corruption', 'fraud', 'bribery', 'embezzlement', 'money laundering', 'scam', 'scandal', 'bribe'], category: 'corruption' },
  { keywords: ['crime', 'cartel', 'arrest', 'murder', 'shooting', 'terror', 'drug', 'heist', 'smuggling', 'kidnapping'], category: 'crime' },
  { keywords: ['election', 'protest', 'demonstration', 'coup', 'parliament', 'president', 'government', 'political', 'vote', 'summit'], category: 'politics' },
  { keywords: ['flood', 'drought', 'pollution', 'deforestation', 'climate', 'ecological', 'river', 'water', 'emissions'], category: 'environmental' },
  { keywords: ['cyber', 'hack', 'data breach', 'ransomware', 'ai', 'technology', 'digital', 'software', 'chip', 'tech'], category: 'technology' },
  { keywords: ['sanction', 'trade', 'tariff', 'economy', 'recession', 'gdp', 'inflation', 'bank'], category: 'corruption' }
];

const SEVERITY_HIGH = ['nuclear', 'mass casualty', 'genocide', 'hundreds killed', 'thousands displaced', 'category 5', 'magnitude 7', 'magnitude 8'];
const SEVERITY_MEDIUM = ['dozens killed', 'dozens injured', 'evacuated', 'strike', 'clash', 'protests', 'arrested'];

const COUNTRY_COORDS = {
  'ukraine': { lat: 48.3794, lng: 31.1656, region: 'Europe' },
  'russia': { lat: 61.524, lng: 105.318, region: 'Europe' },
  'israel': { lat: 31.046, lng: 34.851, region: 'Middle East' },
  'gaza': { lat: 31.354, lng: 34.308, region: 'Middle East' },
  'iran': { lat: 32.427, lng: 53.688, region: 'Middle East' },
  'usa': { lat: 37.09, lng: -95.712, region: 'North America' },
  'united states': { lat: 37.09, lng: -95.712, region: 'North America' },
  'china': { lat: 35.861, lng: 104.195, region: 'Asia Pacific' },
  'india': { lat: 20.593, lng: 78.962, region: 'Asia Pacific' },
  'taiwan': { lat: 23.697, lng: 120.960, region: 'Asia Pacific' },
  'france': { lat: 46.227, lng: 2.213, region: 'Europe' },
  'germany': { lat: 51.165, lng: 10.451, region: 'Europe' },
  'uk': { lat: 55.378, lng: -3.435, region: 'Europe' },
  'united kingdom': { lat: 55.378, lng: -3.435, region: 'Europe' },
  'brazil': { lat: -14.235, lng: -51.925, region: 'South America' },
  'nigeria': { lat: 9.082, lng: 8.675, region: 'Africa' },
  'sudan': { lat: 12.862, lng: 30.217, region: 'Africa' },
  'kenya': { lat: -0.023, lng: 37.906, region: 'Africa' },
  'pakistan': { lat: 30.375, lng: 69.345, region: 'Asia Pacific' },
  'north korea': { lat: 40.339, lng: 127.510, region: 'Asia Pacific' },
  'syria': { lat: 34.802, lng: 38.996, region: 'Middle East' },
  'myanmar': { lat: 16.871, lng: 96.195, region: 'Asia Pacific' },
  'japan': { lat: 36.204, lng: 138.252, region: 'Asia Pacific' },
  'turkey': { lat: 38.963, lng: 35.243, region: 'Middle East' },
  'saudi arabia': { lat: 23.885, lng: 45.079, region: 'Middle East' },
  'venezuela': { lat: 6.423, lng: -66.589, region: 'South America' },
  'mexico': { lat: 23.634, lng: -102.552, region: 'North America' },
  'colombia': { lat: 4.571, lng: -74.297, region: 'South America' },
  'ethiopia': { lat: 9.145, lng: 40.489, region: 'Africa' },
  'somalia': { lat: 5.152, lng: 46.199, region: 'Africa' },
  'afghanistan': { lat: 33.93, lng: 67.709, region: 'Asia Pacific' },
  'haiti': { lat: 18.971, lng: -72.285, region: 'North America' },
};

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
  for (const [country, coords] of Object.entries(COUNTRY_COORDS)) {
    if (text.includes(country)) {
      return { ...coords, country: country.replace(/\b\w/g, l => l.toUpperCase()) };
    }
  }
  return {
    lat: Number(((Math.random() - 0.5) * 120).toFixed(4)),
    lng: Number(((Math.random() - 0.5) * 340).toFixed(4)),
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

    lastSyncTimestamp = Date.now();
    console.log(`[NewsService] Successfully synced ${rawArticles.length} live articles to MongoDB Atlas (upserted: ${upsertedCount}, updated: ${modifiedCount}).`);

    return {
      success: true,
      count: rawArticles.length,
      upserted: upsertedCount,
      modified: modifiedCount,
      matched: result.matchedCount || 0
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
