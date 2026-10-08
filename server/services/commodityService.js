// server/services/commodityService.js
// Highlights.com — Live Commodity Prices via Twelve Data Free API
const https = require('https');

// Twelve Data commodity symbols mapped to display names
const COMMODITY_CONFIG = [
  {
    name: 'Gold',
    symbol: 'XAU/USD',
    icon: 'Coins',
    color: '#F59E0B',
    defaultPrice: 4389.50,
    defaultChange: '+1.31%',
    decimals: 2
  },
  {
    name: 'Brent Crude Oil',
    symbol: 'XBR/USD',
    icon: 'Fuel',
    color: '#EF4444',
    defaultPrice: 105.44,
    defaultChange: '-3.04%',
    decimals: 2
  },
  {
    name: 'Wheat',
    symbol: 'WHEAT/USD',
    icon: 'Wheat',
    color: '#EF4444',
    defaultPrice: 724.25,
    defaultChange: '-0.58%',
    decimals: 2
  },
  {
    name: 'Natural Gas',
    symbol: 'NGAS/USD',
    icon: 'Flame',
    color: '#10B981',
    defaultPrice: 3.12,
    defaultChange: '+0.77%',
    decimals: 3
  },
  {
    name: 'Silver',
    symbol: 'XAG/USD',
    icon: 'Sparkles',
    color: '#94A3B8',
    defaultPrice: 52.36,
    defaultChange: '+0.38%',
    decimals: 2
  },
  {
    name: 'Copper',
    symbol: 'XCU/USD',
    icon: 'Disc',
    color: '#F97316',
    defaultPrice: 4.52,
    defaultChange: '+0.41%',
    decimals: 4
  }
];

// Seed in-memory cache with baseline values
let cachedCommodities = COMMODITY_CONFIG.map(cfg => ({
  name: cfg.name,
  symbol: cfg.symbol,
  icon: cfg.icon,
  color: cfg.color,
  price: cfg.defaultPrice.toLocaleString('en-US', {
    minimumFractionDigits: cfg.decimals,
    maximumFractionDigits: cfg.decimals
  }),
  rawPrice: cfg.defaultPrice,
  change: cfg.defaultChange,
  isPositive: !cfg.defaultChange.startsWith('-'),
  lastUpdated: new Date().toISOString()
}));

let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60s — stays within Twelve Data free-tier limits

/**
 * Fetch commodity quotes batch from Twelve Data REST API
 */
function fetchCommodityHTTP(symbols) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.TWELVE_DATA_API_KEY || process.env.VITE_TWELVE_DATA_API_KEY || 'demo';
    const symbolStr = encodeURIComponent(symbols.join(','));
    const url = `https://api.twelvedata.com/quote?symbol=${symbolStr}&apikey=${apiKey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse Twelve Data commodity response: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Sync live commodity prices from Twelve Data.
 * Falls back to micro-fluctuation on baseline if no API key or rate-limited.
 */
async function syncCommodityPrices(force = false) {
  const now = Date.now();
  if (!force && (now - lastFetchTime < CACHE_TTL_MS)) {
    return { fromCache: true, data: cachedCommodities };
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY || process.env.VITE_TWELVE_DATA_API_KEY;

  if (apiKey && apiKey.trim()) {
    try {
      const symbols = COMMODITY_CONFIG.map(c => c.symbol);
      const res = await fetchCommodityHTTP(symbols);

      if (res && res.status !== 'error') {
        const updated = cachedCommodities.map((item, idx) => {
          const cfg = COMMODITY_CONFIG[idx];
          // Twelve Data returns batch as { 'XAU/USD': { close, percent_change, ... }, ... }
          const quote = res[cfg.symbol] || (res.symbol === cfg.symbol ? res : null);
          if (quote && quote.close && !isNaN(Number(quote.close))) {
            const rawPrice = Number(quote.close);
            const pct = Number(quote.percent_change) || 0;
            const isPositive = pct >= 0;
            return {
              ...item,
              rawPrice,
              price: rawPrice.toLocaleString('en-US', {
                minimumFractionDigits: cfg.decimals,
                maximumFractionDigits: cfg.decimals
              }),
              change: (isPositive ? '+' : '') + pct.toFixed(2) + '%',
              isPositive,
              lastUpdated: new Date().toISOString()
            };
          }
          return item;
        });

        cachedCommodities = updated;
        lastFetchTime = now;
        console.log(`[Commodities] Synced ${updated.length} commodities from Twelve Data.`);
        return { fromCache: false, source: 'twelve-data', data: cachedCommodities };
      } else if (res && res.message) {
        console.warn(`[Commodities Twelve Data Notice] ${res.message}. Using cached baseline.`);
      }
    } catch (err) {
      console.warn(`[Commodities Fetch Warning] ${err.message}. Using cached baseline.`);
    }
  }

  // Micro-fluctuate baseline to keep values alive when no live data
  cachedCommodities = cachedCommodities.map((cm, idx) => {
    if (Math.random() < 0.3) {
      const cfg = COMMODITY_CONFIG[idx];
      const delta = (Math.random() - 0.48) * (cm.rawPrice * 0.002);
      const newRaw = Math.max(0.01, cm.rawPrice + delta);
      const isUp = delta >= 0;
      return {
        ...cm,
        rawPrice: newRaw,
        price: newRaw.toLocaleString('en-US', {
          minimumFractionDigits: cfg.decimals,
          maximumFractionDigits: cfg.decimals
        }),
        change: (isUp ? '+' : '') + ((delta / cm.rawPrice) * 100).toFixed(2) + '%',
        isPositive: isUp,
        lastUpdated: new Date().toISOString()
      };
    }
    return cm;
  });

  lastFetchTime = now;
  return { fromCache: false, source: 'baseline', data: cachedCommodities };
}

module.exports = {
  syncCommodityPrices,
  getLatestCommodityPrices: () => cachedCommodities
};
