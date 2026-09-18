import React from 'react';
import { BRIEFINGS_DATA } from '../data/mockEvents';
import { FileText, Shield, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function BriefingsView() {
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
        gap: '16px',
        overflowY: 'auto',
        padding: '20px',
        background: 'rgba(6, 9, 19, 0.88)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-cyan)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <FileText size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF' }}>EXECUTIVE BRIEFINGS</h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SYNTHESIZED STRATEGIC DOSSIERS & MACRO GEOPOLITICAL ASSESSMENTS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Calendar size={13} />
          <span>CYCLE: 2026-09-17</span>
        </div>
      </div>

      {/* Briefing Dossier Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {BRIEFINGS_DATA.map(brief => (
          <div
            key={brief.id}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 242, 254, 0.12)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--border-cyan)'
                }}
              >
                {brief.classification}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {brief.date}
              </span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.35', marginBottom: '8px' }}>
              {brief.title}
            </h3>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '12px' }}>
              {brief.summary}
            </p>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                STRATEGIC HIGHLIGHTS:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {brief.highlights.map((h, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={13} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>DESK: {brief.author}</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                FULL REPORT <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
