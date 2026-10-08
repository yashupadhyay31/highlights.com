/**
 * src/data/marketService.js
 * Highlights.com — Twelve Data Free Market API Integration for World Stock Indices
 */

const VITE_TWELVE_DATA_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY || '';

/**
 * Fetch live stock indices from the backend (which caches Twelve Data API calls)
 * or directly from Twelve Data API as fallback.
 */
export async function fetchLiveMarketIndices(force = false) {
  // 1. Try Express backend endpoint (which manages Twelve Data calls and rate limiting)
  try {
    const res = await fetch(`/api/markets/indices${force ? '?force=true' : ''}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (_) {
    // Backend offline or unreachable, proceed to direct fallback
  }

  // 2. Direct Twelve Data client fallback if an API key is available
  if (VITE_TWELVE_DATA_KEY) {
    try {
      const symbols = 'SPX,IXIC,DJI,FTSE,GDAXI,N225,HSI,NIFTY,BSESN,FCHI,STOXX50E,AXJO,TSX,KS11';
      const url = `/twelve-data-api/quote?symbol=${encodeURIComponent(symbols)}&apikey=${VITE_TWELVE_DATA_KEY}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.status !== 'error') {
          return data;
        }
      }
    } catch (err) {
      console.warn('[Twelve Data Direct Fetch]', err.message);
    }
  }

  return null;
}

/**
 * Fetch live forex rates from the backend (which caches Twelve Data API calls).
 * Returns an array of forex pair objects or null on failure.
 */
export async function fetchLiveForexRates(force = false) {
  try {
    const res = await fetch(`/api/markets/forex${force ? '?force=true' : ''}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (_) {
    // Backend offline — caller will keep existing state
  }
  return null;
}

/**
 * Fetch live commodity prices from the backend (which caches Twelve Data API calls).
 * Returns an array of commodity objects or null on failure.
 */
export async function fetchLiveCommodityPrices(force = false) {
  try {
    const res = await fetch(`/api/markets/commodities${force ? '?force=true' : ''}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (_) {
    // Backend offline — caller will keep existing state
  }
  return null;
}


