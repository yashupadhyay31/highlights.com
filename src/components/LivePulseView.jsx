import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Radio, Zap, Globe, ShieldAlert, TrendingUp } from 'lucide-react';

export default function LivePulseView() {
  const { events, handleSelectEvent } = useApp();

  const regions = [
    { name: 'Middle East & Levant', count: 18, velocity: '+42%', status: 'Critical', color: '#EF4444' },
    { name: 'East Asia & Taiwan Strait', count: 12, velocity: '+28%', status: 'Elevated', color: '#F97316' },
    { name: 'Eastern Europe / Black Sea', count: 15, velocity: '+14%', status: 'High', color: '#F59E0B' },
    { name: 'North America / Pacific Rim', count: 9, velocity: '+5%', status: 'Moderate', color: '#3B82F6' },
    { name: 'Western Europe & Atlantic', count: 11, velocity: '-2%', status: 'Stable', color: '#10B981' }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '114px',
        left: '356px',
        right: '356px',
        bottom: '44px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        overflowY: 'auto',
        padding: '16px',
        background: 'rgba(6, 9, 19, 0.88)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-cyan)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
      }}
    >
      {/* View Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Activity size={20} className="live-indicator" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF' }}>GLOBAL LIVE PULSE</h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              REAL-TIME GEOPOLITICAL TELEMETRY FREQUENCY & VELOCITY
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: 'var(--radius-full)' }}>
          <Radio size={12} color="#EF4444" className="live-indicator" />
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#FECACA', fontFamily: 'var(--font-mono)' }}>HIGH ALERT FREQUENCY</span>
        </div>
      </div>

      {/* Real-time Frequency Waveform Visualizer */}
      <div style={{ background: 'rgba(10, 15, 31, 0.9)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>SIGNAL VELOCITY MONITOR (30-SECOND WINDOW)</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SAMPLING 24 DATA FEEDS</span>
        </div>

        {/* Animated Soundwave / Pulse Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', gap: '4px', padding: '0 8px' }}>
          {Array.from({ length: 48 }).map((_, i) => {
            const heightPct = Math.sin(i * 0.4) * 35 + Math.cos(i * 0.8) * 20 + 45;
            const isSpike = i > 16 && i < 26;
            const barColor = isSpike ? '#EF4444' : i % 2 === 0 ? 'var(--accent-cyan)' : '#3B82F6';
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${heightPct}%`,
                  backgroundColor: barColor,
                  borderRadius: '2px',
                  opacity: 0.85,
                  boxShadow: isSpike ? '0 0 8px #EF4444' : 'none',
                  transition: 'height 0.3s ease'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Regional Velocity Matrix */}
      <div>
        <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '10px' }}>
          REGIONAL THREAT VELOCITY DISPATCH
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {regions.map((reg, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                borderLeft: `3px solid ${reg.color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFFFFF' }}>{reg.name}</span>
                <span style={{ fontSize: '0.66rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: reg.color, textTransform: 'uppercase' }}>
                  {reg.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Incidents: <strong style={{ color: '#FFFFFF' }}>{reg.count}</strong></span>
                <span>Velocity: <strong style={{ color: reg.color }}>{reg.velocity}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Incidents Feed */}
      <div>
        <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '10px' }}>
          ACTIVE HIGH KINETIC TARGETS
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {events.slice(0, 4).map(ev => (
            <div
              key={ev.id}
              onClick={() => handleSelectEvent(ev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)')}
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>{ev.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ev.location.city}, {ev.location.country} • {ev.timestamp}</div>
              </div>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                INVESTIGATE →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
