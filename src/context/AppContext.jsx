import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_EVENTS, CATEGORIES, REPORTER_TIERS, MARKETS_DATA } from '../data/mockEvents';
import { fetchLiveNews } from '../data/newsService';
import { fetchLiveMarketIndices } from '../data/marketService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [liveEvents, setLiveEvents] = useState([]);
  const [newsStatus, setNewsStatus] = useState({ loading: false, error: null, lastUpdated: null });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null); // { event, screenX, screenY }
  const [activeRole, setActiveRole] = useState('guest'); // 'guest' | 'user' | 'reporter' | 'admin'
  const [activeNavTab, setActiveNavTab] = useState('explore'); // 'explore' | 'pulse' | 'briefings' | 'markets' | 'watchlist'
  const [selectedRegion, setSelectedRegion] = useState('all'); // 'all' | 'middle-east' | ...
  const [watchlist, setWatchlist] = useState(['ev-gaza-ops', 'ev-taiwan-strait']);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSeverity, setActiveSeverity] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'
  const [globeSubMode, setGlobeSubMode] = useState('3d'); // '3d' | '2d' | 'satellite'
  const [autoRotate, setAutoRotate] = useState(true);
  const [globeFlyTo, setGlobeFlyTo] = useState(null); // { lat, lng }
  const [zoomCommand, setZoomCommand] = useState(null); // { type: 'in' | 'out' | 'reset', ts }
  const [focusedIncident, setFocusedIncident] = useState(INITIAL_EVENTS[0] || null); // Middle East Escalation Card
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  
  // ── Live News Integration ───────────────────────────────────────────────
  const loadLiveNews = useCallback(async () => {
    setNewsStatus(prev => ({ ...prev, loading: true, error: null }));
    try {
      const freshArticles = await fetchLiveNews({ language: 'en', limit: 30 });
      setLiveEvents(freshArticles);
      setNewsStatus({ loading: false, error: null, lastUpdated: new Date() });
    } catch (err) {
      console.error('[Highlights] Live news fetch failed:', err);
      setNewsStatus(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  // Fetch on mount, then refresh every 5 minutes
  useEffect(() => {
    loadLiveNews();
    const interval = setInterval(loadLiveNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadLiveNews]);

  // Use ONLY live events when API is healthy; fall back to mock when API errors or returns nothing
  const allEvents = useMemo(() => {
    const apiWorking = !newsStatus.error && liveEvents.length > 0;
    return apiWorking ? liveEvents : events;
  }, [liveEvents, events, newsStatus.error]);

  // Real-Time Markets Data (Initialized with global indices from Twelve Data baseline)
  const [marketData, setMarketData] = useState(MARKETS_DATA);

  // Real-World Market Indices Sync via Twelve Data (Periodic Refresh)
  useEffect(() => {
    let isMounted = true;

    const syncTwelveDataIndices = async () => {
      try {
        const freshData = await fetchLiveMarketIndices();
        if (isMounted && Array.isArray(freshData) && freshData.length > 0) {
          setMarketData(prev => {
            const updatedStocks = prev.stocks.map(existing => {
              const match = freshData.find(
                item => (item.symbol && existing.symbol && item.symbol.toUpperCase() === existing.symbol.toUpperCase()) ||
                        (item.name && item.name.toLowerCase().includes(existing.name.toLowerCase().split(' ')[0]))
              );
              if (match) {
                return {
                  ...existing,
                  price: match.price || existing.price,
                  rawPrice: match.rawPrice || existing.rawPrice,
                  change: match.change || existing.change,
                  isPositive: match.isPositive !== undefined ? match.isPositive : existing.isPositive,
                  lastTick: Date.now()
                };
              }
              return existing;
            });
            return { ...prev, stocks: updatedStocks };
          });
        }
      } catch (err) {
        console.warn('[Twelve Data Periodic Sync]', err.message);
      }
    };

    // Run on initial mount
    syncTwelveDataIndices();

    // Periodically fetch real market quotes every 60s (adhering to Twelve Data free tier 8 calls/min)
    const syncInterval = setInterval(syncTwelveDataIndices, 60000);
    return () => {
      isMounted = false;
      clearInterval(syncInterval);
    };
  }, []);

  // Periodic Live Value Fluctuation for Displayed Market Assets
  useEffect(() => {
    const timer = setInterval(() => {
      setMarketData(prev => {
        const rand = Math.random();
        if (rand < 0.5 && prev.stocks.length > 0) {
          // Periodically update a stock index value as shown
          const sIdx = Math.floor(Math.random() * prev.stocks.length);
          const st = prev.stocks[sIdx];
          const delta = (Math.random() - 0.48) * (st.rawPrice * 0.0006);
          const newRaw = Math.max(1, st.rawPrice + delta);
          const isUp = delta >= 0;
          const updated = [...prev.stocks];
          updated[sIdx] = {
            ...st,
            rawPrice: newRaw,
            price: newRaw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: (isUp ? '+' : '') + ((delta / st.rawPrice) * 100).toFixed(2) + '%',
            isPositive: isUp,
            lastTick: Date.now()
          };
          return { ...prev, stocks: updated };
        } else if (rand < 0.8 && prev.commodities.length > 0) {
          const cIdx = Math.floor(Math.random() * prev.commodities.length);
          const cm = prev.commodities[cIdx];
          const delta = (Math.random() - 0.48) * (cm.rawPrice * 0.002);
          const newRaw = Math.max(0.1, cm.rawPrice + delta);
          const isUp = delta >= 0;
          const updated = [...prev.commodities];
          updated[cIdx] = {
            ...cm,
            rawPrice: newRaw,
            price: newRaw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: (isUp ? '+' : '') + ((delta / cm.rawPrice) * 100).toFixed(2) + '%',
            isPositive: isUp,
            lastTick: Date.now()
          };
          return { ...prev, commodities: updated };
        } else if (prev.forex.length > 0) {
          const fIdx = Math.floor(Math.random() * prev.forex.length);
          const fx = prev.forex[fIdx];
          const delta = (Math.random() - 0.49) * 0.0006;
          const newRaw = Math.max(0.01, fx.rawPrice + delta);
          const isUp = delta >= 0;
          const updated = [...prev.forex];
          updated[fIdx] = {
            ...fx,
            rawPrice: newRaw,
            price: newRaw.toFixed(4),
            change: (isUp ? '+' : '') + ((delta / fx.rawPrice) * 100).toFixed(2) + '%',
            isPositive: isUp,
            lastTick: Date.now()
          };
          return { ...prev, forex: updated };
        }
        return prev;
      });
    }, 2400);
    return () => clearInterval(timer);
  }, []);
  
  // Nearby / Geolocation State
  const [userLocation, setUserLocation] = useState(null); // { lat, lng, name, radiusKm }

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isReporterDashboardOpen, setIsReporterDashboardOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isNearbyModalOpen, setIsNearbyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState(null); // 'report' | 'vote' | null

  // Field Reporter Profile State
  const [reporterProfile, setReporterProfile] = useState({
    alias: 'Reporter-K29P4',
    realName: 'Aarav Sharma',
    email: 'aarav.sharma.jpr@proton.me',
    trustScore: 140,
    tier: 'Veteran',
    approvedReports: 21,
    falseReports: 0,
    pendingReports: 1
  });

  // Calculate Haversine distance in km
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Toggle Save / Watchlist
  const toggleSaveEvent = (eventId) => {
    setWatchlist(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const isEventSaved = (eventId) => watchlist.includes(eventId);

  // Map Controls
  const handleZoomIn = () => setZoomCommand({ type: 'in', ts: Date.now() });
  const handleZoomOut = () => setZoomCommand({ type: 'out', ts: Date.now() });
  const handleRecenter = () => {
    setGlobeFlyTo({ lat: 28, lng: 38 });
    setZoomCommand({ type: 'reset', ts: Date.now() });
  };

  // Switch Sub Mode (3D / 2D / Satellite)
  const handleSetSubMode = (mode) => {
    setGlobeSubMode(mode);
    if (mode === '2d') {
      setViewMode('2d');
    } else {
      setViewMode('3d');
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(ev => {
      // Watchlist filter if activeNavTab === 'watchlist'
      if (activeNavTab === 'watchlist' && !watchlist.includes(ev.id)) {
        return false;
      }

      // Region filter
      if (selectedRegion !== 'all') {
        const evReg = (ev.location?.region || '').toLowerCase();
        const evCountry = (ev.location?.country || '').toLowerCase();
        if (selectedRegion === 'middle-east' && !evReg.includes('middle east') && !evReg.includes('middle-east') && !['gaza strip', 'israel', 'oman', 'iran', 'yemen', 'saudi arabia'].some(c => evCountry.includes(c))) return false;
        if (selectedRegion === 'asia-pacific' && !evReg.includes('asia') && !['taiwan', 'china', 'japan', 'india', 'korea'].some(c => evCountry.includes(c))) return false;
        if (selectedRegion === 'europe' && !evReg.includes('europe') && !['belgium', 'france', 'germany', 'uk', 'ukraine'].some(c => evCountry.includes(c))) return false;
        if (selectedRegion === 'north-america' && !evReg.includes('north-america') && !evReg.includes('north america') && !['united states', 'usa', 'canada'].some(c => evCountry.includes(c))) return false;
        if (selectedRegion === 'south-america' && !evReg.includes('south-america') && !evReg.includes('south america') && !['brazil', 'colombia', 'argentina', 'peru'].some(c => evCountry.includes(c))) return false;
        if (selectedRegion === 'africa' && !evReg.includes('africa') && !['sudan', 'nigeria', 'kenya', 'egypt', 'congo'].some(c => evCountry.includes(c))) return false;
      }

      // Category filter (pills: All, Conflict, Politics, Economy, Technology, Environment, Security)
      if (activeCategory !== 'all') {
        const cat = activeCategory.toLowerCase();
        const evCat = (ev.category || '').toLowerCase();
        const sub = (ev.subcategory || '').toLowerCase();
        if (cat === 'conflict' && evCat !== 'conflict' && !sub.includes('conflict')) return false;
        if (cat === 'politics' && evCat !== 'politics' && !sub.includes('politic')) return false;
        if (cat === 'economy' && evCat !== 'corruption' && !sub.includes('econom') && !sub.includes('trade')) return false;
        if (cat === 'technology' && evCat !== 'technology' && !sub.includes('tech') && !sub.includes('cyber')) return false;
        if (cat === 'environment' && evCat !== 'environmental' && evCat !== 'calamity' && !sub.includes('wildfire') && !sub.includes('ecolog')) return false;
        if (cat === 'security' && evCat !== 'crime' && !sub.includes('security') && !sub.includes('naval')) return false;
      }

      // Severity filter
      if (activeSeverity !== 'all' && ev.severity !== activeSeverity) return false;

      // Verification filter
      if (verificationFilter !== 'all' && ev.verificationStatus !== verificationFilter) return false;

      // Nearby filter if user location is active with radius
      if (userLocation && userLocation.radiusKm) {
        const dist = getDistanceKm(userLocation.lat, userLocation.lng, ev.location.lat, ev.location.lng);
        if (dist > userLocation.radiusKm) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title?.toLowerCase().includes(q);
        const matchesSummary = ev.summary?.toLowerCase().includes(q);
        const matchesCity = ev.location?.city?.toLowerCase().includes(q);
        const matchesCountry = ev.location?.country?.toLowerCase().includes(q);
        const matchesSubcategory = ev.subcategory?.toLowerCase().includes(q);
        const matchesTags = ev.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesCity && !matchesCountry && !matchesSubcategory && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, activeNavTab, watchlist, selectedRegion, activeCategory, activeSeverity, verificationFilter, searchQuery, userLocation]);

  // Breaking / Hot Alerts
  const hotAlerts = useMemo(() => {
    return allEvents.filter(e => e.isHotAlert);
  }, [allEvents]);

  // Handle Event Selection & Camera Focus
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    if (event?.location) {
      setGlobeFlyTo({ lat: event.location.lat, lng: event.location.lng });
    }
  };

  // Community Trust Voting
  const handleVoteTrust = (eventId, voteType) => {
    if (activeRole === 'guest') {
      setAuthModalReason('vote');
      setIsAuthModalOpen(true);
      return;
    }

    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      const current = ev.communityTrust || { trustVotes: 0, disputeVotes: 0, trustPercentage: 100 };
      const newTrust = voteType === 'trust' ? current.trustVotes + 1 : current.trustVotes;
      const newDispute = voteType === 'dispute' ? current.disputeVotes + 1 : current.disputeVotes;
      const total = newTrust + newDispute;
      const pct = total > 0 ? Math.round((newTrust / total) * 100) : 100;
      return {
        ...ev,
        communityTrust: {
          trustVotes: newTrust,
          disputeVotes: newDispute,
          trustPercentage: pct
        }
      };
    }));

    // Also update selectedEvent if open
    setSelectedEvent(prev => {
      if (!prev || prev.id !== eventId) return prev;
      const current = prev.communityTrust || { trustVotes: 0, disputeVotes: 0, trustPercentage: 100 };
      const newTrust = voteType === 'trust' ? current.trustVotes + 1 : current.trustVotes;
      const newDispute = voteType === 'dispute' ? current.disputeVotes + 1 : current.disputeVotes;
      const total = newTrust + newDispute;
      const pct = total > 0 ? Math.round((newTrust / total) * 100) : 100;
      return {
        ...prev,
        communityTrust: {
          trustVotes: newTrust,
          disputeVotes: newDispute,
          trustPercentage: pct
        }
      };
    });
  };

  // Submit New Event from Field Reporter Form
  const handleSubmitNewEvent = (newEventData) => {
    const newId = `ev-${Date.now()}`;
    const formattedEvent = {
      ...newEventData,
      id: newId,
      timestamp: 'Just now',
      date: new Date().toISOString().split('T')[0],
      verificationStatus: 'UNDER_REVIEW',
      communityTrust: {
        trustVotes: 1,
        disputeVotes: 0,
        trustPercentage: 100
      },
      reporter: {
        alias: reporterProfile.alias,
        level: reporterProfile.tier,
        trustScore: reporterProfile.trustScore,
        approvedReports: reporterProfile.approvedReports,
        falseReports: reporterProfile.falseReports,
        privateKyc: {
          realName: reporterProfile.realName,
          email: reporterProfile.email,
          phone: '+91 94140 88219',
          identityVerified: true,
          deviceFingerprint: 'DEV-SUB-CURRENT'
        }
      }
    };

    setEvents(prev => [formattedEvent, ...prev]);
    setReporterProfile(prev => ({
      ...prev,
      pendingReports: prev.pendingReports + 1
    }));
    handleSelectEvent(formattedEvent);
  };

  // Admin Moderation Action
  const handleAdminModerate = (eventId, decision) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      let newStatus = ev.verificationStatus;
      if (decision === 'approve') newStatus = 'VERIFIED';
      if (decision === 'reject') newStatus = 'DISPUTED';
      if (decision === 'correct') newStatus = 'NEEDS_CORRECTION';
      return {
        ...ev,
        verificationStatus: newStatus
      };
    }));

    // Update reporter trust points according to EventGrid formula:
    // Every 3 genuine published reports: +10 pts
    // One false report: -25 pts
    if (decision === 'approve') {
      setReporterProfile(prev => {
        const newApproved = prev.approvedReports + 1;
        const addReward = newApproved % 3 === 0 ? 10 : 0;
        const newScore = Math.min(200, prev.trustScore + addReward);
        const newTier = newScore >= 170 ? 'Virtuoso' : newScore >= 50 ? 'Veteran' : 'Rookie';
        return {
          ...prev,
          approvedReports: newApproved,
          trustScore: newScore,
          tier: newTier,
          pendingReports: Math.max(0, prev.pendingReports - 1)
        };
      });
    } else if (decision === 'reject') {
      setReporterProfile(prev => {
        const newFalse = prev.falseReports + 1;
        const newScore = Math.max(0, prev.trustScore - 25);
        const newTier = newScore >= 170 ? 'Virtuoso' : newScore >= 50 ? 'Veteran' : 'Rookie';
        return {
          ...prev,
          falseReports: newFalse,
          trustScore: newScore,
          tier: newTier,
          pendingReports: Math.max(0, prev.pendingReports - 1)
        };
      });
    }
  };

  const value = {
    events: allEvents,
    filteredEvents,
    hotAlerts,
    newsStatus,
    refreshLiveNews: loadLiveNews,
    selectedEvent,
    setSelectedEvent,
    hoveredEvent,
    setHoveredEvent,
    activeRole,
    setActiveRole,
    activeCategory,
    setActiveCategory,
    activeSeverity,
    setActiveSeverity,
    verificationFilter,
    setVerificationFilter,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    globeSubMode,
    setGlobeSubMode,
    handleSetSubMode,
    activeNavTab,
    setActiveNavTab,
    selectedRegion,
    setSelectedRegion,
    watchlist,
    toggleSaveEvent,
    isEventSaved,
    marketData,
    zoomCommand,
    handleZoomIn,
    handleZoomOut,
    handleRecenter,
    focusedIncident,
    setFocusedIncident,
    isTickerPaused,
    setIsTickerPaused,
    autoRotate,
    setAutoRotate,
    globeFlyTo,
    setGlobeFlyTo,
    userLocation,
    setUserLocation,
    reporterProfile,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
    isReporterDashboardOpen,
    setIsReporterDashboardOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isNearbyModalOpen,
    setIsNearbyModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalReason,
    setAuthModalReason,
    handleSelectEvent,
    handleVoteTrust,
    handleSubmitNewEvent,
    handleAdminModerate,
    getDistanceKm
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
