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
  { keywords: ['war', 'military', 'airstrike', 'troops', 'nato', 'missile', 'battle', 'conflict', 'fighting', 'attack', 'bombing', 'army', 'navy', 'combat'], category: 'conflict' },
  { keywords: ['earthquake', 'flood', 'flooding', 'hurricane', 'tsunami', 'wildfire', 'volcano', 'cyclone', 'disaster', 'storm', 'tornado', 'typhoon', 'landslide', 'avalanche', 'blizzard', 'heatwave', 'quake', 'calamity'], category: 'calamity' },
  { keywords: ['drought', 'pollution', 'deforestation', 'climate', 'ecological', 'river', 'water', 'emissions', 'environment', 'environmental', 'nature', 'natural', 'wildlife', 'species', 'forest', 'ocean', 'sea', 'ecosystem', 'biodiversity', 'fauna', 'flora', 'habitat', 'conservation', 'extinction', 'planet', 'plastic', 'recycle', 'greenhouse', 'renewable', 'glacier'], category: 'environmental' },
  { keywords: ['corruption', 'fraud', 'bribery', 'embezzlement', 'money laundering', 'scam', 'scandal', 'bribe', 'graft'], category: 'corruption' },
  { keywords: ['crime', 'cartel', 'arrest', 'murder', 'shooting', 'terror', 'drug', 'heist', 'smuggling', 'gang', 'homicide'], category: 'crime' },
  { keywords: ['cyber', 'hack', 'data breach', 'ransomware', 'ai', 'technology', 'digital', 'software', 'chip', 'tech', 'satellite', 'blackout', 'grid', 'outage'], category: 'technology' },
  { keywords: ['election', 'protest', 'demonstration', 'coup', 'parliament', 'president', 'government', 'political', 'vote', 'summit', 'minister', 'diplomacy', 'lawmaker'], category: 'politics' },
  { keywords: ['sanction', 'trade', 'tariff', 'economy', 'recession', 'gdp', 'inflation', 'bank', 'stock', 'market', 'financial'], category: 'corruption' }
];

// Maps category id → severity heuristic keywords
const SEVERITY_HIGH = ['nuclear', 'mass casualty', 'genocide', 'hundreds killed', 'thousands displaced', 'category 5', 'magnitude 7', 'magnitude 8'];
const SEVERITY_MEDIUM = ['dozens killed', 'dozens injured', 'evacuated', 'strike', 'clash', 'protests', 'arrested'];

const COUNTRY_COORDS = {
  // ── Multi-word names first (longest-match priority handled by COUNTRY_COORDS_SORTED) ──
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
  'west bank':          { lat: 31.952,  lng: 35.233,   region: 'Middle East' },
  'north macedonia':    { lat: 41.608,  lng: 21.745,   region: 'Europe' },
  'czech republic':     { lat: 49.817,  lng: 15.472,   region: 'Europe' },
  'sri lanka':          { lat: 7.873,   lng: 80.771,   region: 'Asia Pacific' },
  // ── Middle East ───────────────────────────────────────────────────────────────
  'israel':             { lat: 31.046,  lng: 34.851,   region: 'Middle East' },
  'gaza':               { lat: 31.354,  lng: 34.308,   region: 'Middle East' },
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
  // ── Europe ────────────────────────────────────────────────────────────────────
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
  'gabon':              { lat: -0.803,  lng: 11.609,   region: 'Africa' },
  'togo':               { lat: 8.619,   lng: 0.824,    region: 'Africa' },
  'benin':              { lat: 9.307,   lng: 2.315,    region: 'Africa' },
  'guinea':             { lat: 9.945,   lng: -9.696,   region: 'Africa' },
  'tunisia':            { lat: 33.886,  lng: 9.537,    region: 'Africa' },
};

// Pre-sort by name length descending so multi-word names always match before
// any shorter substring could (e.g. "south africa" wins before "africa").
const COUNTRY_COORDS_SORTED = Object.entries(COUNTRY_COORDS)
  .sort((a, b) => b[0].length - a[0].length);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  for (const { keywords, category } of KEYWORD_CATEGORY_MAP) {
    if (keywords.some(k => text.includes(k))) return category;
  }

  // Fallback heuristic for environmental/nature topics before generic politics
  if (/\b(nature|wildlife|animal|forest|sea|ocean|lake|river|tree|species|rain|weather|climate|park|conservation|sanctuary|reef|coral|fauna|flora)\b/i.test(text)) {
    return 'environmental';
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
  // Word-boundary regex prevents "iran" from matching inside "ukraine", etc.
  // Sorted longest-first so multi-word entries win over shorter substrings.
  for (const [country, coords] of COUNTRY_COORDS_SORTED) {
    const escaped = country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`);
    if (regex.test(text)) {
      return { ...coords, country: country.replace(/\b\w/g, l => l.toUpperCase()) };
    }
  }
  // Stable fallback – no random coords so map pins don't jump on re-render
  return {
    lat: 0,
    lng: 0,
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
  // 1. First priority: Check Backend Express + MongoDB Atlas (/api/events/live)
  try {
    const backendRes = await fetch(`/api/events/live?limit=${limit}`);
    if (backendRes.ok) {
      const dbArticles = await backendRes.json();
      if (Array.isArray(dbArticles) && dbArticles.length > 0) {
        return dbArticles.map(doc => ({
          ...doc,
          id: doc._id || doc.id || doc.externalId,
          timestamp: doc.publishedAt ? relativeTime(doc.publishedAt) : 'recently'
        }));
      }
    }
  } catch (backendErr) {
    console.warn('[Highlights Frontend] Backend live endpoint unavailable, trying direct API:', backendErr.message);
  }

  // 2. Direct Currents API fallback via Vite proxy
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
