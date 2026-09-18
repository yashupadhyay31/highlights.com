import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockEvents';
import { LAND_RINGS } from '../data/landRings';
import { Plus, Minus, Crosshair } from 'lucide-react';

export default function TacticalMap2D() {
  const {
    filteredEvents,
    handleSelectEvent,
    setHoveredEvent,
    globeSubMode,
    handleSetSubMode,
    handleZoomIn,
    handleZoomOut,
    handleRecenter
  } = useApp();

  // Convert (lat, lng) to flat map coordinates percentage
  // Lat: +90 (top 0%) to -90 (bottom 100%)
  // Lng: -180 (left 0%) to +180 (right 100%)
  const latLngToPercent = (lat, lng) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  // Convert LAND_RINGS to SVG path data string
  const svgPathData = useMemo(() => {
    return LAND_RINGS.map(ring => {
      if (!ring || ring.length < 2) return '';
      let path = '';
      let prevLng = null;
      ring.forEach(([lng, lat], i) => {
        const x = ((lng + 180) / 360) * 1000;
        const y = ((90 - lat) / 180) * 500;
        if (i === 0 || (prevLng !== null && Math.abs(lng - prevLng) > 180)) {
          path += `M ${x.toFixed(1)} ${y.toFixed(1)} `;
        } else {
          path += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
        }
        prevLng = lng;
      });
      path += 'Z ';
      return path;
    }).join(' ');
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: '114px',
        left: '356px',
        right: '356px',
        bottom: '44px',
        background: '#040916',
        overflow: 'hidden',
        zIndex: 10,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)'
      }}
    >
      {/* Background Graticule Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 242, 254, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 242, 254, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* TOP-LEFT VIEW MODE PILLS: [ 3D | 2D | Satellite ] */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(10, 15, 31, 0.85)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-full)',
          padding: '3px 4px',
          gap: '2px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <button
          onClick={() => handleSetSubMode('3d')}
          style={{
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            background: globeSubMode === '3d' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
            border: '1px solid',
            borderColor: globeSubMode === '3d' ? 'var(--accent-cyan)' : 'transparent',
            color: globeSubMode === '3d' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: '0.76rem',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          3D
        </button>

        <button
          onClick={() => handleSetSubMode('2d')}
          style={{
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            background: globeSubMode === '2d' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
            border: '1px solid',
            borderColor: globeSubMode === '2d' ? 'var(--accent-cyan)' : 'transparent',
            color: globeSubMode === '2d' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: '0.76rem',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          2D
        </button>

        <button
          onClick={() => handleSetSubMode('satellite')}
          style={{
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            background: globeSubMode === 'satellite' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
            border: '1px solid',
            borderColor: globeSubMode === 'satellite' ? 'var(--accent-cyan)' : 'transparent',
            color: globeSubMode === 'satellite' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: '0.76rem',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Satellite
        </button>
      </div>

      {/* World Map Silhouette Vector Overlay (Rendered from landRings.js) */}
      <div
        style={{
          position: 'absolute',
          inset: '54px 14px 14px 14px',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(8, 14, 28, 0.75)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* SVG Landmass Outlines from landRings.js */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.88,
            pointerEvents: 'none'
          }}
        >
          <path
            d={svgPathData}
            fill="#091B33"
            stroke="#00F2FE"
            strokeWidth="0.75"
            strokeOpacity="0.75"
          />
        </svg>

        {/* Equator & Prime Meridian Grid Marker */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            borderTop: '1px dashed rgba(0, 242, 254, 0.25)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            borderLeft: '1px dashed rgba(0, 242, 254, 0.25)',
            pointerEvents: 'none'
          }}
        />

        {/* Tactical Map Header HUD */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--accent-cyan)',
            background: 'rgba(6, 9, 19, 0.85)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-cyan)'
          }}
        >
          2D EQUIRECTANGULAR PROJECTION • {filteredEvents.length} INCIDENTS PLOTTED
        </div>

        {/* Plotted Interactive Event Markers */}
        {filteredEvents.map(ev => {
          const { x, y } = latLngToPercent(ev.location.lat, ev.location.lng);
          const cat = CATEGORIES.find(c => c.id === ev.category);
          const markerColor = cat?.color || '#00F2FE';

          return (
            <div
              key={`2d-${ev.id}`}
              onClick={() => handleSelectEvent(ev)}
              onMouseEnter={(e) => {
                setHoveredEvent({
                  event: ev,
                  screenX: e.clientX,
                  screenY: e.clientY
                });
              }}
              onMouseLeave={() => setHoveredEvent(null)}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: ev.isHotAlert ? 20 : 10
              }}
            >
              {/* Concentric Pulse Ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-6px',
                  borderRadius: '50%',
                  border: `1.5px solid ${markerColor}`,
                  animation: 'radar-ping 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
                  pointerEvents: 'none'
                }}
              />

              {/* Core Beacon Dot */}
              <div
                style={{
                  width: ev.isHotAlert ? '12px' : '9px',
                  height: ev.isHotAlert ? '12px' : '9px',
                  borderRadius: '50%',
                  backgroundColor: markerColor,
                  boxShadow: `0 0 10px ${markerColor}`,
                  border: '1.5px solid #FFFFFF'
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
