import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockEvents';
import {
  X,
  Sparkles,
  Shield,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  FileText,
  Clock,
  Eye,
  Send,
  HelpCircle,
  Hash,
  UserCheck,
  Lock
} from 'lucide-react';

export default function ReporterSubmitModal() {
  const {
    isSubmitModalOpen,
    setIsSubmitModalOpen,
    handleSubmitNewEvent,
    reporterProfile,
    activeRole,
    setActiveRole
  } = useApp();

  const [step, setStep] = useState(1); // 1: Form, 2: AI Review, 3: Success

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('calamity');
  const [subcategory, setSubcategory] = useState('Flood');
  const [severity, setSeverity] = useState('high');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('India');
  const [lat, setLat] = useState('26.9124');
  const [lng, setLng] = useState('75.7873');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80');
  const [sourceName, setSourceName] = useState('');

  // Category Specific State
  const [categoryFields, setCategoryFields] = useState({
    waterLevel: '2.1 meters above baseline',
    affectedCount: '12,000 residents',
    targetOrg: 'Metropolitan Development Authority',
    financialSum: '$18,500,000',
    dangerLevel: 'Tier 2 Active Perimeter'
  });

  // AI Analysis State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  if (!isSubmitModalOpen) return null;

  const handleRunAiAnalysis = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      // Simulate intelligent metadata extraction
      const detectedCity = city || 'Jaipur';
      const detectedCat = category || 'calamity';
      const generatedTags = [
        `#${subcategory.replace(/\s+/g, '')}`,
        `#${detectedCity.replace(/\s+/g, '')}`,
        `#${country.replace(/\s+/g, '')}`,
        '#GroundReport',
        '#HighlightsLive'
      ];

      setAiSuggestions({
        suggestedCategory: detectedCat,
        suggestedSubcategory: subcategory,
        generatedTags: generatedTags,
        executiveSummary: title.length > 20
          ? `${title}. Ground telemetry corroborates immediate field escalation requiring inter-agency monitoring.`
          : `Field report confirms active incident involving ${subcategory} in ${detectedCity}, ${country}.`,
        severityScore: severity === 'critical' ? '0.94 (Critical)' : '0.78 (Elevated)',
        similarityScore: '0.12 (Unique incident - no duplicate cluster detected)'
      });
      setIsAiProcessing(false);
      setStep(2);
    }, 1200);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      title,
      category,
      subcategory,
      severity,
      status: 'active',
      location: {
        city: city || 'Unknown City',
        state: stateName || 'Region',
        country: country || 'Global',
        lat: parseFloat(lat) || 0,
        lng: parseFloat(lng) || 0,
        region: 'Field Coordinate'
      },
      summary: aiSuggestions?.executiveSummary || description.slice(0, 140),
      fullDescription: description,
      timeline: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: 'Field Report Filed',
          desc: 'Structured submission submitted by anonymous field reporter via highlights.com terminal.',
          verified: false
        }
      ],
      evidence: {
        images: imagePreview ? [imagePreview] : [],
        sources: sourceName ? [{ name: sourceName, url: '#', type: 'Field Eyewitness' }] : []
      },
      tags: aiSuggestions?.generatedTags || [`#${subcategory}`, `#${city}`],
      isHotAlert: severity === 'critical'
    };

    handleSubmitNewEvent(formattedData);
    setStep(3);
  };

  const handleClose = () => {
    setIsSubmitModalOpen(false);
    setStep(1);
  };

  // If user is a guest, present registration requirement screen
  if (activeRole === 'guest') {
    return (
      <div className="modal-backdrop" onClick={handleClose}>
        <div
          className="glass-panel-glow modal-container"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '500px',
            maxWidth: '92vw',
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            borderColor: 'var(--accent-amber)'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}
          >
            <Lock size={24} />
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            Registration Required to Report
          </h3>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '22px' }}>
            Only registered users and field reporters can report events. Please become a registered user to submit ground intelligence and crisis reports.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={() => {
                setActiveRole('user');
              }}
              className="btn-tactical btn-tactical-primary"
              style={{ padding: '10px 16px', fontSize: '0.85rem', justifyContent: 'center' }}
            >
              <UserCheck size={16} />
              <span>Become a Registered User (1-Click)</span>
            </button>

            <button
              onClick={() => {
                setActiveRole('reporter');
              }}
              className="btn-tactical"
              style={{
                padding: '10px 16px',
                fontSize: '0.85rem',
                justifyContent: 'center',
                borderColor: 'var(--accent-amber)',
                color: 'var(--accent-amber)'
              }}
            >
              <Shield size={16} />
              <span>Register as Field Reporter</span>
            </button>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Cancel & Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="glass-panel-glow modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '680px',
          maxWidth: '95vw',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          borderColor: 'var(--accent-cyan)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '14px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700' }}>
                Structured Field Reporter Portal
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                ANONYMOUS ID: <span style={{ color: 'var(--accent-cyan)' }}>{reporterProfile.alias}</span> • TIER: {reporterProfile.tier.toUpperCase()}
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span style={{ color: step >= 1 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            1. STRUCTURED INCIDENT FORM
          </span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: step >= 2 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            2. AI INTELLIGENCE EXTRACTION
          </span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: step === 3 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            3. ADMIN MODERATION QUEUE
          </span>
        </div>

        {/* STEP 1: Structured Form */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunAiAnalysis();
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: '600' }}>
                Incident Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Heavy Flash Flooding Submerges Central Jaipur Districts"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: 'rgba(10, 15, 31, 0.8)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Category & Subcategory Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: '600' }}>
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value === 'calamity') setSubcategory('Flood');
                    if (e.target.value === 'corruption') setSubcategory('Procurement Fraud');
                    if (e.target.value === 'conflict') setSubcategory('Armed Skirmish');
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    background: 'rgba(10, 15, 31, 0.8)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: '600' }}>
                  Subcategory
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flood, Cyber Attack"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    background: 'rgba(10, 15, 31, 0.8)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: '600' }}>
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    background: 'rgba(10, 15, 31, 0.8)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="critical">Critical (Hot Alert)</option>
                  <option value="high">High Severity</option>
                  <option value="medium">Medium Severity</option>
                  <option value="low">Low Severity</option>
                </select>
              </div>
            </div>

            {/* Location Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>City *</label>
                <input
                  type="text"
                  required
                  placeholder="Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Country *</label>
                <input
                  type="text"
                  required
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Latitude</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Longitude</label>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            {/* Category Adaptive Dynamic Fields */}
            <div
              style={{
                padding: '12px',
                background: 'rgba(0, 242, 254, 0.03)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-cyan)'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                CATEGORY-SPECIFIC STRUCTURED TELEMETRY [{category.toUpperCase()}]
              </div>

              {category === 'calamity' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Water / Shock Level</label>
                    <input
                      type="text"
                      value={categoryFields.waterLevel}
                      onChange={(e) => setCategoryFields({ ...categoryFields, waterLevel: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.78rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Affected Population Count</label>
                    <input
                      type="text"
                      value={categoryFields.affectedCount}
                      onChange={(e) => setCategoryFields({ ...categoryFields, affectedCount: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.78rem' }}
                    />
                  </div>
                </div>
              )}

              {category === 'corruption' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target Institution / Firm</label>
                    <input
                      type="text"
                      value={categoryFields.targetOrg}
                      onChange={(e) => setCategoryFields({ ...categoryFields, targetOrg: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.78rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Financial Amount</label>
                    <input
                      type="text"
                      value={categoryFields.financialSum}
                      onChange={(e) => setCategoryFields({ ...categoryFields, financialSum: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.78rem' }}
                    />
                  </div>
                </div>
              )}

              {category !== 'calamity' && category !== 'corruption' && (
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Incident Scope & Perimeter</label>
                  <input
                    type="text"
                    value={categoryFields.dangerLevel}
                    onChange={(e) => setCategoryFields({ ...categoryFields, dangerLevel: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.78rem' }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: '600' }}>
                Ground Narrative & Verifiable Evidence *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide accurate, factual observations. Avoid speculation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: 'rgba(10, 15, 31, 0.8)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Photo & Source Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Image URL / Photographic Proof
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Primary Source / Agency Citation
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Relief Control Room"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', background: 'rgba(10, 15, 31, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            {/* Anonymous Identity Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '0.72rem',
                color: 'var(--accent-amber)'
              }}
            >
              <Shield size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Anonymity Guarantee:</strong> Your real name and contact details are stored in the Admin KYC vault only. The public will only ever see your pseudonym <strong>{reporterProfile.alias}</strong>.
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isAiProcessing}
              className="btn-tactical btn-tactical-primary"
              style={{ padding: '10px', marginTop: '6px' }}
            >
              <Sparkles size={16} />
              <span>{isAiProcessing ? 'AI Processing Structured Submission...' : 'Process with AI Assistant →'}</span>
            </button>
          </form>
        )}

        {/* STEP 2: AI Intelligence Extraction Preview */}
        {step === 2 && aiSuggestions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                padding: '14px',
                background: 'rgba(0, 242, 254, 0.06)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-cyan)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    AI-ASSISTED EVENTGRID INTELLIGENCE EXTRACTION
                  </span>
                </div>
                <span
                  className="tactical-badge"
                  style={{
                    fontSize: '0.65rem',
                    borderColor: 'var(--accent-amber)',
                    color: 'var(--accent-amber)'
                  }}
                >
                  ASSISTANT ≠ TRUTH
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '2px' }}>AI SYNTHESIZED EXECUTIVE SUMMARY:</div>
                  <div style={{ color: 'var(--text-primary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                    "{aiSuggestions.executiveSummary}"
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>EXTRACTED HASHTAGS:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {aiSuggestions.generatedTags.map(t => (
                        <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.12)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>CLUSTER DUPLICATION CHECK:</div>
                    <div style={{ color: 'var(--accent-emerald)', fontWeight: '600', marginTop: '4px', fontSize: '0.75rem' }}>
                      ✓ {aiSuggestions.similarityScore}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderation Warning for Rookie/Veteran */}
            <div
              style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.08)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontSize: '0.75rem',
                color: '#FECACA'
              }}
            >
              <strong>EventGrid Specification Rule:</strong> Because your rank is <strong>{reporterProfile.tier}</strong>, this submission will enter the <strong>Admin Moderation Queue</strong> with status <code>UNDER_REVIEW</code> before full public verification.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-tactical"
                style={{ flex: 1 }}
              >
                ← Back to Edit Form
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="btn-tactical btn-tactical-primary"
                style={{ flex: 2 }}
              >
                <Send size={15} />
                <span>Confirm & Submit to Moderation Engine</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>
              Field Report Successfully Lodged!
            </h4>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px', lineHeight: '1.5' }}>
              Your report has been assigned marker telemetry on the 3D globe under anonymous identity <strong>{reporterProfile.alias}</strong> and forwarded to the Admin Moderation Desk.
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '8px 14px',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                marginBottom: '20px'
              }}
            >
              TRUST SCORE REWARD NOTICE: +10 pts upon 3 verified publications
            </div>

            <div>
              <button
                onClick={handleClose}
                className="btn-tactical btn-tactical-primary"
                style={{ padding: '8px 24px' }}
              >
                Return to Tactical Globe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
