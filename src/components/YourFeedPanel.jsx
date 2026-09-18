import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGIONS } from '../data/mockEvents';
import {
  Globe,
  ChevronDown,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Glasses
} from 'lucide-react';

export default function YourFeedPanel() {
  const {
    filteredEvents,
    activeCategory,
    setActiveCategory,
    selectedRegion,
    setSelectedRegion,
    handleSelectEvent,
    selectedEvent,
    toggleSaveEvent,
    isEventSaved
  } = useApp();

  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'conflict', label: 'Conflict' },
    { id: 'politics', label: 'Politics' },
    { id: 'economy', label: 'Economy' },
    { id: 'technology', label: 'Technology' },
    { id: 'environment', label: 'Environment' },
    { id: 'security', label: 'Security' }
  ];

  const currentRegionObj = REGIONS.find(r => r.id === selectedRegion) || REGIONS[0];

  const getCategoryBadgeStyle = (category, subcategory) => {
    const catLower = (subcategory || category || '').toLowerCase();
    if (catLower.includes('conflict')) {
      return { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#EF4444' };
    }
    if (catLower.includes('security')) {
      return { bg: 'rgba(6, 182, 212, 0.15)', border: '#06B6D4', text: '#06B6D4' };
    }
    if (catLower.includes('politic')) {
      return { bg: 'rgba(139, 92, 246, 0.15)', border: '#8B5CF6', text: '#A78BFA' };
    }
    if (catLower.includes('environment') || catLower.includes('wildfire')) {
      return { bg: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', text: '#F59E0B' };
    }
    if (catLower.includes('econom') || catLower.includes('trade')) {
      return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3B82F6', text: '#60A5FA' };
    }
    return { bg: 'rgba(0, 242, 254, 0.15)', border: '#00F2FE', text: '#00F2FE' };
  };

  return (
    <aside
      style={{
        position: 'absolute',
        top: '114px',
        left: '16px',
        bottom: '44px',
        width: '320px',
        zIndex: 25,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'rgba(10, 15, 31, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Header with Title & Region Selector */}
        <div
          style={{
            padding: '14px 16px 10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.05rem',
              fontWeight: '700',
              color: '#FFFFFF',
              letterSpacing: '-0.01em'
            }}
          >
            Your Feed
          </h2>

          {/* Region Dropdown Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsRegionMenuOpen(!isRegionMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              <Globe size={13} color="var(--accent-cyan)" />
              <span>{currentRegionObj.name}</span>
              <ChevronDown size={12} />
            </button>

            {isRegionMenuOpen && (
              <div
                className="glass-panel-glow"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '150px',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px',
                  zIndex: 80,
                  background: 'rgba(6, 9, 19, 0.95)'
                }}
              >
                {REGIONS.map(reg => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      setSelectedRegion(reg.id);
                      setIsRegionMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: 'none',
                      background: selectedRegion === reg.id ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                      color: selectedRegion === reg.id ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      fontSize: '0.72rem',
                      textAlign: 'left',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    {reg.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            overflowX: 'auto',
            borderBottom: '1px solid var(--border-subtle)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? '700' : '500',
                  fontFamily: 'var(--font-sans)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-cyan)' : 'transparent',
                  background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Feed Items Scrollable Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {filteredEvents.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem'
              }}
            >
              No events found matching current filters.
            </div>
          ) : (
            filteredEvents.map(ev => {
              const isSelected = selectedEvent?.id === ev.id;
              const isSaved = isEventSaved(ev.id);
              const badgeStyle = getCategoryBadgeStyle(ev.category, ev.subcategory);

              return (
                <div
                  key={ev.id}
                  onClick={() => handleSelectEvent(ev)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.07)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 12px rgba(0, 242, 254, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                      e.currentTarget.style.background = 'rgba(20, 30, 55, 0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)';
                    }
                  }}
                >
                  {/* Category Pill Badge & Relative Timestamp */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}
                  >
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        background: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`
                      }}
                    >
                      {ev.subcategory || ev.category}
                    </span>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {ev.timestamp}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h3
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: '700',
                      lineHeight: '1.35',
                      color: '#FFFFFF',
                      marginBottom: '5px'
                    }}
                  >
                    {ev.title}
                  </h3>

                  {/* Snippet Description */}
                  <p
                    style={{
                      fontSize: '0.76rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.42',
                      marginBottom: '10px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {ev.summary}
                  </p>

                  {/* Footer Meta Row: Source + Verified + Save Action */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingTop: '8px',
                      fontSize: '0.72rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontWeight: '600',
                          fontSize: '0.7rem'
                        }}
                      >
                        {ev.source || 'Intelligence Wire'}
                      </span>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          color: 'var(--accent-cyan)',
                          fontWeight: '600',
                          fontSize: '0.68rem'
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Bookmark / Save */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveEvent(ev.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'transparent',
                        border: 'none',
                        color: isSaved ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        fontSize: '0.72rem',
                        fontWeight: '600'
                      }}
                    >
                      {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Tagline Pill */}
        <div
          style={{
            padding: '10px 14px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(6, 9, 19, 0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              flexShrink: 0
            }}
          >
            <Glasses size={13} />
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.01em'
            }}
          >
            Better context. Deeper understanding.
          </span>
        </div>
      </div>
    </aside>
  );
}
