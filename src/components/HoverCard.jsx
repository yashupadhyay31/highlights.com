import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockEvents';
import { ShieldCheck, MapPin, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

export default function HoverCard() {
  const { hoveredEvent, handleSelectEvent } = useApp();

  if (!hoveredEvent || !hoveredEvent.event) return null;

  const { event, screenX, screenY } = hoveredEvent;
  const cat = CATEGORIES.find(c => c.id === event.category);

  // Position card offset from cursor, clamped within viewport
  const cardWidth = 320;
  const cardHeight = 220;
  let left = screenX + 16;
  let top = screenY + 16;

  if (left + cardWidth > window.innerWidth) {
    left = screenX - cardWidth - 16;
  }
  if (top + cardHeight > window.innerHeight) {
    top = screenY - cardHeight - 16;
  }

  return (
    <div
      onClick={() => handleSelectEvent(event)}
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${cardWidth}px`,
        zIndex: 50,
        pointerEvents: 'auto',
        cursor: 'pointer',
        animation: 'fadeIn 0.15s ease-out',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        borderColor: cat?.color || 'var(--accent-cyan)'
      }}
      className="glass-panel-glow"
    >
      {/* Header Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span
          className="tactical-badge"
          style={{
            borderColor: cat?.color || 'var(--accent-cyan)',
            color: cat?.color || 'var(--accent-cyan)',
            background: 'rgba(0, 0, 0, 0.4)'
          }}
        >
          {event.subcategory || cat?.name}
        </span>

        <span
          className="tactical-badge"
          style={{
            borderColor: event.severity === 'critical' ? 'var(--accent-crimson)' : 'var(--border-medium)',
            color: event.severity === 'critical' ? 'var(--accent-crimson)' : 'var(--text-muted)',
            background: 'rgba(0, 0, 0, 0.4)'
          }}
        >
          {event.severity}
        </span>
      </div>

      {/* Title */}
      <h4
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          fontWeight: '700',
          lineHeight: '1.35',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}
      >
        {event.title}
      </h4>

      {/* Summary snippet */}
      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '12px'
        }}
      >
        {event.summary}
      </p>

      {/* Footer Meta */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} color="var(--accent-cyan)" />
          <span>{event.location.city}, {event.location.country}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)' }}>
          <span style={{ fontWeight: '600' }}>Investigate</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
}
