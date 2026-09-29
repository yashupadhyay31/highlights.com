/**
 * newsService.js
 * Fetches live news from Currents API and maps articles
 * to the highlights.com internal event schema.
 */

const API_KEY = import.meta.env.VITE_CURRENTS_API_KEY;

// Vite dev-server proxies /currents-api → https://api.currentsapi.services
// so no CORS issues in development.
const BASE_URL = '/currents-api/v1';

// ─── Category / Keyword Mapping ──────────────────────────────────────────────
// Maps Currents API topic keywords → internal category ids
const KEYWORD_CATEGORY_MAP = [
  { keywords: ['war', 'military', 'airstrike', 'troops', 'nato', 'missile', 'battle', 'conflict', 'fighting', 'attack'], category: 'conflict' },
  { keywords: ['earthquake', 'flood', 'hurricane', 'tsunami', 'wildfire', 'volcano', 'cyclone', 'disaster', 'storm'], category: 'calamity' },
  { keywords: ['corruption', 'fraud', 'bribery', 'embezzlement', 'money laundering', 'scam', 'scandal'], category: 'corruption' },
  { keywords: ['crime', 'cartel', 'arrest', 'murder', 'shooting', 'terror', 'drug', 'heist', 'smuggling'], category: 'crime' },
  { keywords: ['election', 'protest', 'demonstration', 'coup', 'parliament', 'president', 'government', 'political', 'vote'], category: 'politics' },
  { keywords: ['flood', 'drought', 'pollution', 'deforestation', 'climate', 'ecological', 'river', 'water'], category: 'environmental' },
  { keywords: ['cyber', 'hack', 'data breach', 'ransomware', 'ai', 'technology', 'digital', 'software', 'chip'], category: 'technology' },
  { keywords: ['sanction', 'trade', 'tariff', 'economy', 'recession', 'gdp', 'stock', 'inflation', 'bank'], category: 'corruption' }, // economy → corruption bucket
];

// Maps category id → severity heuristic keywords
const SEVERITY_HIGH = ['nuclear', 'mass casualty', 'genocide', 'hundreds killed', 'thousands displaced', 'category 5', 'magnitude 7', 'magnitude 8'];
const SEVERITY_MEDIUM = ['dozens killed', 'dozens injured', 'evacuated', 'strike', 'clash', 'protests', 'arrested'];

// Country → rough lat/lng centroids
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  for (const { keywords, category } of KEYWORD_CATEGORY_MAP) {
    if (keywords.some(k => text.includes(k))) return category;
  }
  return 'politics'; // fallback
}

function detectSeverity(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (SEVERITY_HIGH.some(k => text.includes(k))) return 'critical';
  if (SEVERITY_MEDIUM.some(k => text.includes(k))) return 'high';
  return 'medium';
}

function detectCoords(title, description, author) {
  const text = `${title} ${description} ${author || ''}`.toLowerCase();
  for (const [country, coords] of Object.entries(COUNTRY_COORDS)) {
    if (text.includes(country)) {
      return { ...coords, country: country.replace(/\b\w/g, l => l.toUpperCase()) };
    }
  }
  // Random world scatter for unresolved articles
  return {
    lat: (Math.random() - 0.5) * 120,
    lng: (Math.random() - 0.5) * 340,
    country: 'International',
    region: 'Global'
  };
}

function relativeTime(published) {
  try {
    const diff = Date.now() - new Date(published).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return 'recently';
  }
}

function articleToEvent(article, index) {
  const category = detectCategory(article.title, article.description || '');
  const severity = detectSeverity(article.title, article.description || '');
  const coords = detectCoords(article.title, article.description || '', article.author || '');

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

  return {
    id: `live-${article.id || index}-${Date.now()}`,
    title: article.title,
    summary: article.description || article.title,
    category,
    subcategory: CATEGORY_SUBCATEGORY[category] || 'Breaking News',
    severity,
    timestamp: relativeTime(article.published),
    date: article.published ? article.published.split(' ')[0] : new Date().toISOString().split('T')[0],
    location: {
      lat: coords.lat,
      lng: coords.lng,
      city: coords.country,
      country: coords.country,
      region: coords.region,
    },
    verificationStatus: 'UNVERIFIED',
    isHotAlert: severity === 'critical',
    isLive: true, // flag to distinguish live vs mock
    sourceUrl: article.url,
    sources: [
      {
        name: article.author || 'News Wire',
        type: 'Media',
        credibility: 70,
        url: article.url,
      }
    ],
    tags: [category, coords.region || 'Global', 'live'],
    color: CATEGORY_COLORS[category] || '#6B7280',
    communityTrust: { trustVotes: 0, disputeVotes: 0, trustPercentage: 100 },
    reporter: null,
    casualties: null,
    intelligence: null,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch latest news from Currents API.
 * @param {object} opts
 * @param {string} [opts.language='en']
 * @param {string} [opts.keywords=''] - Free-text keyword filter
 * @param {number} [opts.limit=20]
 * @returns {Promise<Array>} Array of event objects shaped for the app
 */
export async function fetchLiveNews({ language = 'en', keywords = '', limit = 30 } = {}) {
  const params = new URLSearchParams({ language, apiKey: API_KEY });
  if (keywords) params.set('keywords', keywords);

  const url = `${BASE_URL}/latest-news?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Currents API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const articles = (data.news || []).slice(0, limit);
  return articles.map(articleToEvent);
}

/**
 * Fetch news for a specific category/keyword combination.
 */
export async function fetchNewsByKeywords(keywords, limit = 20) {
  return fetchLiveNews({ keywords, limit });
}
