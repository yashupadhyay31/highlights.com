import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockEvents';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  UserX,
  Share2,
  ExternalLink,
  Layers,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Award
} from 'lucide-react';

export default function EventDossier() {
  const {
    selectedEvent,
    setSelectedEvent,
    handleVoteTrust,
    activeRole,
    handleSelectEvent,
    events
  } = useApp();

  const [activeImage, setActiveImage] = useState(null);
  const [hasVoted, setHasVoted] = useState(null); // 'trust' | 'dispute' | null

  if (!selectedEvent) return null;

  const cat = CATEGORIES.find(c => c.id === selectedEvent.category);
  const community = selectedEvent.communityTrust || { trustVotes: 0, disputeVotes: 0, trustPercentage: 100 };
  const reporter = selectedEvent.reporter || { alias: 'Reporter-ANON', level: 'Rookie', trustScore: 10 };

  // Find related events in the same category
  const relatedEvents = events
    .filter(e => e.id !== selectedEvent.id && e.category === selectedEvent.category)
    .slice(0, 2);

  const handleVote = (type) => {
    handleVoteTrust(selectedEvent.id, type);
    setHasVoted(type);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '460px',
        maxWidth: '100vw',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.7)'
      }}
      className="glass-panel-glow drawer-slide-in"
      style-extra={{
        borderLeft: '1px solid var(--border-cyan)',
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        background: 'rgba(7, 10, 20, 0.94)'
      }}
    >
      {/* Dossier Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 15, 31, 0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="var(--accent-cyan)" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.08em'
            }}
          >
            INTELLIGENCE DOSSIER [{selectedEvent.id.toUpperCase()}]
          </span>
        </div>

        <button
          onClick={() => setSelectedEvent(null)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Close Dossier"
        >
          <X size={18} />
        </button>
      </div>

      {/* Dossier Body - Scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}
      >
        {/* Badges & Meta */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <span
            className="tactical-badge"
            style={{
              borderColor: cat?.color || 'var(--accent-cyan)',
              color: cat?.color || 'var(--accent-cyan)',
              background: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {selectedEvent.subcategory || cat?.name}
          </span>

          <span
            className="tactical-badge"
            style={{
              borderColor: selectedEvent.severity === 'critical' ? 'var(--accent-crimson)' : 'var(--accent-amber)',
              color: selectedEvent.severity === 'critical' ? 'var(--accent-crimson)' : 'var(--accent-amber)',
              background: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {selectedEvent.severity} SEVERITY
          </span>

          {selectedEvent.verificationStatus === 'VERIFIED' ? (
            <span
              className="tactical-badge"
              style={{
                borderColor: 'var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.15)'
              }}
            >
              <CheckCircle2 size={11} />
              <span>VERIFIED INTELLIGENCE</span>
            </span>
          ) : (
            <span
              className="tactical-badge"
              style={{
                borderColor: 'var(--accent-amber)',
                color: 'var(--accent-amber)',
                background: 'rgba(245, 158, 11, 0.15)'
              }}
            >
              <AlertCircle size={11} />
              <span>{selectedEvent.verificationStatus}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: '800',
            lineHeight: '1.3',
            color: 'var(--text-primary)',
            marginBottom: '10px'
          }}
        >
          {selectedEvent.title}
        </h2>

        {/* Geolocation & Time Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--accent-cyan)" />
            <span>
              {selectedEvent.location.city}, {selectedEvent.location.country}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
            <Clock size={14} color="var(--text-muted)" />
            <span>{selectedEvent.timestamp} ({selectedEvent.time})</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              letterSpacing: '0.06em'
            }}
          >
            EXECUTIVE INTELLIGENCE SUMMARY
          </div>
          <p
            style={{
              fontSize: '0.88rem',
              lineHeight: '1.5',
              color: 'var(--text-primary)',
              background: 'rgba(0, 242, 254, 0.04)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--accent-cyan)'
            }}
          >
            {selectedEvent.summary}
          </p>
        </div>

        {/* Full Detailed Description */}
        <div style={{ marginBottom: '22px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              letterSpacing: '0.06em'
            }}
          >
            GROUND SITUATION REPORT
          </div>
          <p
            style={{
              fontSize: '0.84rem',
              lineHeight: '1.6',
              color: 'var(--text-secondary)'
            }}
          >
            {selectedEvent.fullDescription}
          </p>
        </div>

        {/* Category Specific Breakdown */}
        {selectedEvent.categorySpecific && (
          <div
            style={{
              marginBottom: '22px',
              padding: '14px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--accent-cyan)',
                marginBottom: '10px',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Activity size={13} />
              <span>CATEGORY SPECIFIC TELEMETRY</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(Object.values(selectedEvent.categorySpecific)[0] || {}).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    gap: '12px'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600', textAlign: 'right' }}>
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Images */}
        {selectedEvent.evidence?.images && selectedEvent.evidence.images.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                letterSpacing: '0.06em'
              }}
            >
              PHOTOGRAPHIC / SATELLITE EVIDENCE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {selectedEvent.evidence.images.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    position: 'relative',
                    height: '110px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Evidence ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <Eye size={20} color="#FFFFFF" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chronological Event Timeline */}
        {selectedEvent.timeline && selectedEvent.timeline.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginBottom: '12px',
                letterSpacing: '0.06em'
              }}
            >
              CHRONOLOGICAL INCIDENT TIMELINE
            </div>
            <div style={{ position: 'relative', paddingLeft: '18px' }}>
              {/* Timeline vertical stalk */}
              <div
                style={{
                  position: 'absolute',
                  left: '6px',
                  top: '6px',
                  bottom: '6px',
                  width: '2px',
                  background: 'rgba(0, 242, 254, 0.25)'
                }}
              />

              {selectedEvent.timeline.map((step, idx) => (
                <div key={idx} style={{ position: 'relative', marginBottom: '14px' }}>
                  {/* Timeline bullet dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-18px',
                      top: '4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: step.verified ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                      border: '2px solid var(--bg-primary)'
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: 'var(--accent-cyan)'
                      }}
                    >
                      {step.time}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {step.label}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dual Trust Architecture */}
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(10, 15, 31, 0.8)',
            border: '1px solid var(--border-cyan)'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: 'var(--accent-cyan)',
              marginBottom: '12px',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>DUAL TRUST EVALUATION SYSTEM</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SEPARATE SIGNALS</span>
          </div>

          {/* 1. Field Reporter Reputation */}
          <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserX size={14} color="var(--accent-amber)" />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                  {reporter.alias}
                </span>
                <span
                  className="tactical-badge"
                  style={{
                    fontSize: '0.62rem',
                    borderColor: reporter.level === 'Virtuoso' ? 'var(--accent-amber)' : 'var(--accent-cyan)',
                    color: reporter.level === 'Virtuoso' ? 'var(--accent-amber)' : 'var(--accent-cyan)'
                  }}
                >
                  {reporter.level}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{reporter.trustScore}</span> / 200 pts
              </div>
            </div>

            {/* Reporter Trust Progress Bar (0 to 200) */}
            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: '4px'
              }}
            >
              <div
                style={{
                  width: `${(reporter.trustScore / 200) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #06B6D4, #F59E0B)'
                }}
              />
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Anonymous Field Reporter • Identity protected by EventGrid anonymity protocol.
            </div>
          </div>

          {/* 2. Community Event Trust Voting */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Community Consensus:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: community.trustPercentage >= 85 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                }}
              >
                {community.trustPercentage}% TRUSTED ({community.trustVotes + community.disputeVotes} votes)
              </span>
            </div>

            {/* Consensus bar */}
            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(239, 68, 68, 0.4)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  width: `${community.trustPercentage}%`,
                  height: '100%',
                  background: 'var(--accent-emerald)'
                }}
              />
            </div>

            {/* Voting Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => handleVote('trust')}
                className="btn-tactical"
                style={{
                  borderColor: hasVoted === 'trust' ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                  background: hasVoted === 'trust' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: hasVoted === 'trust' ? 'var(--accent-emerald)' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  padding: '7px'
                }}
              >
                <ThumbsUp size={14} color="var(--accent-emerald)" />
                <span>Verify / Trust ({community.trustVotes})</span>
              </button>

              <button
                onClick={() => handleVote('dispute')}
                className="btn-tactical"
                style={{
                  borderColor: hasVoted === 'dispute' ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                  background: hasVoted === 'dispute' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: hasVoted === 'dispute' ? 'var(--accent-crimson)' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  padding: '7px'
                }}
              >
                <ThumbsDown size={14} color="var(--accent-crimson)" />
                <span>Dispute ({community.disputeVotes})</span>
              </button>
            </div>

            {activeRole === 'guest' && (
              <div style={{ marginTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                (Switch to Registered User role in header to cast your vote)
              </div>
            )}
          </div>
        </div>

        {/* Source Verification Links */}
        {selectedEvent.evidence?.sources && selectedEvent.evidence.sources.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                letterSpacing: '0.06em'
              }}
            >
              VERIFIED CITATIONS & SENSORS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedEvent.evidence.sources.map((src, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{src.name}</span>
                  <span
                    className="tactical-badge"
                    style={{
                      fontSize: '0.62rem',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    {src.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {selectedEvent.tags && selectedEvent.tags.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedEvent.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(0, 242, 254, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Clustered Events */}
        {relatedEvents.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                letterSpacing: '0.06em'
              }}
            >
              CLUSTERED / RELATED INCIDENTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {relatedEvents.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => handleSelectEvent(rel)}
                  style={{
                    padding: '8px 10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {rel.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {rel.location.city}, {rel.location.country}
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--accent-cyan)" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {activeImage && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveImage(null)}
          style={{ zIndex: 1000 }}
        >
          <div
            style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Expanded Evidence"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                border: '1px solid var(--border-cyan)'
              }}
            />
            <button
              onClick={() => setActiveImage(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #fff',
                color: '#fff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
