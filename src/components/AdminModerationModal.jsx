import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  UserCheck,
  Eye,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

export default function AdminModerationModal() {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    events,
    handleAdminModerate,
    handleSelectEvent
  } = useApp();

  const [selectedQueueItem, setSelectedQueueItem] = useState(null);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'kycVault'

  if (!isAdminModalOpen) return null;

  // Events currently awaiting admin moderation
  const pendingEvents = events.filter(e => e.verificationStatus === 'UNDER_REVIEW' || e.verificationStatus === 'NEEDS_CORRECTION');
  const activeItem = selectedQueueItem || pendingEvents[0] || events[0];

  const handleAction = (eventId, decision) => {
    handleAdminModerate(eventId, decision);
    if (selectedQueueItem?.id === eventId) {
      setSelectedQueueItem(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAdminModalOpen(false)}>
      <div
        className="glass-panel-glow modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '920px',
          maxWidth: '96vw',
          height: '85vh',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          borderColor: 'var(--accent-crimson)',
          display: 'flex',
          flexDirection: 'column'
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
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-crimson)'
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '800' }}>
                Admin Intelligence Moderation & Identity Vault
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                CLEARANCE LEVEL: TOP SECRET • FULL KYC ACCESS • QUEUED REVIEWS: {pendingEvents.length}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
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

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '10px'
          }}
        >
          <button
            onClick={() => setActiveTab('queue')}
            className="btn-tactical"
            style={{
              borderColor: activeTab === 'queue' ? 'var(--accent-crimson)' : 'var(--border-subtle)',
              background: activeTab === 'queue' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
              color: activeTab === 'queue' ? '#FECACA' : 'var(--text-muted)',
              fontSize: '0.8rem',
              padding: '6px 14px'
            }}
          >
            Verification Queue ({pendingEvents.length})
          </button>

          <button
            onClick={() => setActiveTab('kycVault')}
            className="btn-tactical"
            style={{
              borderColor: activeTab === 'kycVault' ? 'var(--accent-amber)' : 'var(--border-subtle)',
              background: activeTab === 'kycVault' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: activeTab === 'kycVault' ? 'var(--accent-amber)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              padding: '6px 14px'
            }}
          >
            <Lock size={14} />
            <span>Confidential Reporter Identity Vault</span>
          </button>
        </div>

        {/* Tab 1: Moderation Queue */}
        {activeTab === 'queue' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px', overflow: 'hidden' }}>
            {/* Left Queue List */}
            <div
              style={{
                borderRight: '1px solid var(--border-subtle)',
                paddingRight: '12px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {pendingEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  ✓ All field submissions have been cleared or verified!
                </div>
              ) : (
                pendingEvents.map(item => {
                  const isSelected = activeItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedQueueItem(item)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span
                          className="tactical-badge"
                          style={{
                            fontSize: '0.62rem',
                            borderColor: 'var(--accent-amber)',
                            color: 'var(--accent-amber)'
                          }}
                        >
                          {item.subcategory}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {item.timestamp}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '4px', lineHeight: '1.3' }}>
                        {item.title}
                      </div>

                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Reporter: <span style={{ color: 'var(--accent-cyan)' }}>{item.reporter?.alias}</span> ({item.reporter?.level})
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Detailed Review Panel */}
            {activeItem ? (
              <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="tactical-badge" style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
                      STATUS: {activeItem.verificationStatus}
                    </span>
                    <span className="tactical-badge" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                      {activeItem.location.city}, {activeItem.location.country}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectEvent(activeItem)}
                    className="btn-tactical"
                    style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                  >
                    View on 3D Globe
                  </button>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '10px' }}>
                  {activeItem.title}
                </h4>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {activeItem.fullDescription}
                </p>

                {/* Evidence & Reporter Details Box */}
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '16px',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-cyan)', marginBottom: '8px', fontWeight: '700' }}>
                    ADMIN CLASSIFIED REPORTER METADATA (CONFIDENTIAL)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: 'var(--text-muted)' }}>
                    <div>Public Anonymous Tag: <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>{activeItem.reporter?.alias}</span></div>
                    <div>Real KYC Identity: <span style={{ color: '#fff', fontWeight: '600' }}>{activeItem.reporter?.privateKyc?.realName || 'Vikram Malhotra'}</span></div>
                    <div>Verified Contact: <span style={{ color: '#fff' }}>{activeItem.reporter?.privateKyc?.email || 'v.malhotra@proton.me'}</span></div>
                    <div>Reporter Reputation: <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>{activeItem.reporter?.trustScore} pts</span> ({activeItem.reporter?.level})</div>
                  </div>
                </div>

                {/* Admin Decisions Actions */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    gap: '10px'
                  }}
                >
                  <button
                    onClick={() => handleAction(activeItem.id, 'approve')}
                    className="btn-tactical"
                    style={{
                      flex: 1,
                      borderColor: 'var(--accent-emerald)',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: 'var(--accent-emerald)',
                      padding: '10px'
                    }}
                  >
                    <CheckCircle size={16} />
                    <span>Approve & Publish (Reward +10 pts on 3rd)</span>
                  </button>

                  <button
                    onClick={() => handleAction(activeItem.id, 'reject')}
                    className="btn-tactical btn-tactical-danger"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    <XCircle size={16} />
                    <span>Reject as False (-25 pts penalty)</span>
                  </button>

                  <button
                    onClick={() => handleAction(activeItem.id, 'correct')}
                    className="btn-tactical"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    <AlertCircle size={16} />
                    <span>Request Correction</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Select an item from the queue to moderate.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Confidential Identity Vault */}
        {activeTab === 'kycVault' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div
              style={{
                padding: '12px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '0.78rem',
                color: 'var(--accent-amber)'
              }}
            >
              <strong>Security Protocol Warning:</strong> This vault contains unencrypted field reporter identities strictly restricted to administrative review. Public API endpoints never serialize or serve this payload.
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                  <th style={{ padding: '8px' }}>ANONYMOUS TAG</th>
                  <th style={{ padding: '8px' }}>REAL NAME</th>
                  <th style={{ padding: '8px' }}>KYC EMAIL</th>
                  <th style={{ padding: '8px' }}>TRUST SCORE</th>
                  <th style={{ padding: '8px' }}>TIER</th>
                  <th style={{ padding: '8px' }}>DEVICE SIGNATURE</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, idx) => {
                  const rep = ev.reporter;
                  if (!rep) return null;
                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                        {rep.alias}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#fff', fontWeight: '600' }}>
                        {rep.privateKyc?.realName || 'Devika Singhania'}
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>
                        {rep.privateKyc?.email || 'd.singhania@tuta.com'}
                      </td>
                      <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                        {rep.trustScore} pts
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className="tactical-badge" style={{ fontSize: '0.65rem' }}>
                          {rep.level}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {rep.privateKyc?.deviceFingerprint || 'DEV-NODE-8802'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
