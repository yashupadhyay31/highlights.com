import React from 'react';
import { useApp } from '../context/AppContext';
import { REPORTER_TIERS } from '../data/mockEvents';
import {
  X,
  Shield,
  Award,
  TrendingUp,
  AlertOctagon,
  CheckCircle,
  Clock,
  FileText,
  UserX,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function ReporterDashboard() {
  const {
    isReporterDashboardOpen,
    setIsReporterDashboardOpen,
    reporterProfile,
    events
  } = useApp();

  if (!isReporterDashboardOpen) return null;

  // Find reports by this reporter
  const reporterEvents = events.filter(e => e.reporter?.alias === reporterProfile.alias);

  const currentTier = REPORTER_TIERS[reporterProfile.tier.toUpperCase()] || REPORTER_TIERS.VETERAN;
  const progressPercent = Math.min(100, Math.max(0, (reporterProfile.trustScore / 200) * 100));

  return (
    <div className="modal-backdrop" onClick={() => setIsReporterDashboardOpen(false)}>
      <div
        className="glass-panel-glow modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '740px',
          maxWidth: '95vw',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          borderColor: 'var(--accent-cyan)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '14px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '800' }}>
                Field Reporter Reputation & Trust Engine
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                IDENTITY: <span style={{ color: 'var(--accent-cyan)' }}>{reporterProfile.alias}</span> • RANK: <span style={{ color: currentTier.badgeColor }}>{reporterProfile.tier.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsReporterDashboardOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 0-200 Trust Score Gauge Section */}
        <div
          style={{
            padding: '20px',
            background: 'rgba(10, 15, 31, 0.8)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-cyan)',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="var(--accent-cyan)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                GLOBAL CREDIBILITY RATING (0–200 PTS)
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: '800' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>{reporterProfile.trustScore}</span> / 200 PTS
            </div>
          </div>

          {/* Master Progress Bar */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #06B6D4 0%, #38BDF8 60%, #F59E0B 100%)',
                boxShadow: '0 0 12px rgba(0, 242, 254, 0.5)'
              }}
            />
          </div>

          {/* Tier Milestones Indicator */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '8px'
            }}
          >
            <div>
              <span style={{ color: '#94A3B8', fontWeight: '700' }}>ROOKIE</span> (0–49)
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#38BDF8', fontWeight: '700' }}>VETERAN</span> (50–169)
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#F59E0B', fontWeight: '700' }}>VIRTUOSO</span> (170–200)
            </div>
          </div>
        </div>

        {/* Rule Ledger & Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '22px' }}>
          {/* Approved Reports */}
          <div
            style={{
              padding: '14px',
              background: 'rgba(16, 185, 129, 0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
              <CheckCircle size={14} />
              <span>APPROVED REPORTS</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>
              {reporterProfile.approvedReports}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Next +10 pts reward at {Math.ceil((reporterProfile.approvedReports + 1) / 3) * 3} reports
            </div>
          </div>

          {/* False Reports Penalty */}
          <div
            style={{
              padding: '14px',
              background: 'rgba(239, 68, 68, 0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(239, 68, 68, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-crimson)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
              <AlertOctagon size={14} />
              <span>FALSE REPORTS</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>
              {reporterProfile.falseReports}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Strict penalty: -25 pts per false claim
            </div>
          </div>

          {/* Pending Moderation */}
          <div
            style={{
              padding: '14px',
              background: 'rgba(245, 158, 11, 0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(245, 158, 11, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
              <Clock size={14} />
              <span>IN MODERATION QUEUE</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>
              {reporterProfile.pendingReports}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Under review by Admin authority
            </div>
          </div>
        </div>

        {/* Asymmetric Reward System Specification Guide */}
        <div
          style={{
            padding: '14px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '6px' }}>
            EVENTGRID ASYMMETRIC REWARD POLICY (SPEC 2.0)
          </div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Credibility is paramount to highlights.com. While 3 genuine approved reports yield <strong>+10 points</strong>, a single deliberately false report imposes an immediate <strong>-25 point penalty</strong>. Minimum score is clamped at 0 pts. Rookie & Veteran tiers require Admin clearance before publication.
          </div>
        </div>

        {/* Confidential KYC Identity Information (Reporter View Only) */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 9, 19, 0.8)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontWeight: '700', marginBottom: '8px' }}>
            <Lock size={14} />
            <span>PROTECTED KYC VAULT RECORD (CONFIDENTIAL)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <div>Real Identity: <span style={{ color: '#fff' }}>{reporterProfile.realName}</span></div>
            <div>Secure Email: <span style={{ color: '#fff' }}>{reporterProfile.email}</span></div>
            <div>Device Signature: <span style={{ color: 'var(--accent-cyan)' }}>DEV-IN-RJ-9921</span></div>
            <div>Public Alias: <span style={{ color: 'var(--accent-emerald)' }}>{reporterProfile.alias}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
