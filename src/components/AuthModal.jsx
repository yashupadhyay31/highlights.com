import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, UserCheck, Shield, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setActiveRole,
    setIsSubmitModalOpen,
    authModalReason,
    setAuthModalReason
  } = useApp();

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    if (setAuthModalReason) setAuthModalReason(null);
  };

  const handleSelectRole = (role) => {
    setActiveRole(role);
    setIsAuthModalOpen(false);
    const wasReporting = authModalReason === 'report';
    if (setAuthModalReason) setAuthModalReason(null);

    // If user was trying to report an event or chose reporter, open the report form immediately
    if (wasReporting || role === 'reporter') {
      setIsSubmitModalOpen(true);
    }
  };

  const isReportAuth = authModalReason === 'report';

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="glass-panel-glow modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '520px',
          maxWidth: '92vw',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          borderColor: isReportAuth ? 'var(--accent-amber)' : 'var(--accent-cyan)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color={isReportAuth ? 'var(--accent-amber)' : 'var(--accent-cyan)'} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '800' }}>
              {isReportAuth ? 'Registration Required to Report' : 'Authentication & Role Access'}
            </h3>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Context Banner for Report Access */}
        {isReportAuth ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '18px'
            }}
          >
            <AlertTriangle size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FDE68A', marginBottom: '2px' }}>
                Only Registered Users & Reporters Can Report Events
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Guest access is read-only. Please become a <strong>Registered User</strong> or <strong>Field Reporter</strong> to submit ground reports and active crisis telemetry.
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '18px' }}>
            Guest users can freely explore the 3D globe and read verified intelligence. To report events or participate in <strong>Community Trust Voting</strong>, become a registered user below:
          </p>
        )}

        {/* Role Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* Registered User */}
          <div
            onClick={() => handleSelectRole('user')}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: isReportAuth ? 'rgba(0, 242, 254, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.background = 'rgba(0, 242, 254, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isReportAuth ? 'var(--accent-cyan)' : 'var(--border-subtle)';
              e.currentTarget.style.background = isReportAuth ? 'rgba(0, 242, 254, 0.04)' : 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-highlight)'
              }}
            >
              <UserCheck size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>
                Become a Registered User
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                1-click instant registration. Report ground events, vote on community trust, bookmark incidents.
              </div>
            </div>
            <span className="tactical-badge" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
              1-CLICK REGISTER
            </span>
          </div>

          {/* Field Reporter */}
          <div
            onClick={() => handleSelectRole('reporter')}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-amber)';
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}
            >
              <Shield size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>
                Field Reporter Tier
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Access full intake form, earn 0–200 trust score, protected anonymous identity.
              </div>
            </div>
            <span className="tactical-badge" style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
              REPORTER PASS
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          HIGHLIGHTS.COM • SECURE ZERO-KNOWLEDGE ANONYMITY PROTOCOL
        </div>
      </div>
    </div>
  );
}
