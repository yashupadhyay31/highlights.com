import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AlertTicker() {
  const { events, handleSelectEvent, isTickerPaused, setIsTickerPaused } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const marqueeRef = useRef(null);

  // Filter or prioritize high severity / real breaking alerts
  const tickerEvents = events.slice(0, 10);

  // Category Color Map
  const categoryColorMap = {
    conflict: '#EF4444',
    security: '#06B6D4',
    politics: '#8B5CF6',
    economy: '#3B82F6',
    environmental: '#10B981',
    calamity: '#06B6D4',
    corruption: '#F59E0B',
    crime: '#EC4899',
    technology: '#3B82F6'
  };

  // Step left or right manually
  const handleStep = (direction) => {
    if (!marqueeRef.current) return;
    const shift = direction === 'left' ? -280 : 280;
    marqueeRef.current.scrollBy({ left: shift, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '64px',
        left: 0,
        right: 0,
        height: '38px',
        zIndex: 35,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(6, 9, 19, 0.94)',
        borderBottom: '1px solid var(--border-subtle)',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(12px)',
        padding: '0 16px',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Red LIVE NEWS Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '3px 12px 3px 10px',
          background: 'rgba(239, 68, 68, 0.16)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          borderRadius: 'var(--radius-full)',
          marginRight: '16px',
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(239, 68, 68, 0.25)'
        }}
      >
        <span
          className="live-indicator"
          style={{
            display: 'inline-block',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-crimson)',
            boxShadow: '0 0 8px #EF4444'
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            color: '#FECACA',
            textTransform: 'uppercase'
          }}
        >
          LIVE NEWS
        </span>
      </div>

      {/* Horizontal Continuous Scrolling Marquee Container */}
      <div
        ref={marqueeRef}
        className="news-ticker-viewport"
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)'
        }}
      >
        <div
          className="news-ticker-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
            whiteSpace: 'nowrap',
            animation: 'marquee-crawl 45s linear infinite',
            animationPlayState: isHovered || isTickerPaused ? 'paused' : 'running'
          }}
        >
          {/* First track set */}
          {tickerEvents.map((ev, index) => {
            const dotColor = categoryColorMap[ev.category] || '#00F2FE';
            return (
              <div
                key={`t1-${ev.id}-${index}`}
                onClick={() => handleSelectEvent(ev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                    boxShadow: `0 0 6px ${dotColor}`
                  }}
                />
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.01em'
                  }}
                >
                  {ev.title}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {ev.timestamp}
                </span>
              </div>
            );
          })}

          {/* Duplicate set for seamless continuous marquee loop */}
          {tickerEvents.map((ev, index) => {
            const dotColor = categoryColorMap[ev.category] || '#00F2FE';
            return (
              <div
                key={`t2-${ev.id}-${index}`}
                onClick={() => handleSelectEvent(ev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                    boxShadow: `0 0 6px ${dotColor}`
                  }}
                />
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.01em'
                  }}
                >
                  {ev.title}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {ev.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Controls: Pause/Play & Nav Arrows */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginLeft: '14px',
          flexShrink: 0,
          borderLeft: '1px solid var(--border-subtle)',
          paddingLeft: '10px'
        }}
      >
        <button
          onClick={() => setIsTickerPaused(!isTickerPaused)}
          className="btn-ticker-control"
          title={isTickerPaused ? 'Resume News Marquee' : 'Pause News Marquee'}
          style={{
            background: 'transparent',
            border: 'none',
            color: isTickerPaused ? 'var(--accent-amber)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {isTickerPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
        </button>

        <button
          onClick={() => handleStep('left')}
          className="btn-ticker-control"
          title="Previous headlines"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() => handleStep('right')}
          className="btn-ticker-control"
          title="Next headlines"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
