import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockEvents';
import {
  Layers,
  Flame,
  Filter,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Waves,
  Landmark,
  Swords,
  ShieldAlert,
  Vote,
  Droplets,
  Cpu,
  Biohazard,
  ListFilter
} from 'lucide-react';

const ICON_COMPONENTS = {
  Waves: Waves,
  Landmark: Landmark,
  Swords: Swords,
  ShieldAlert: ShieldAlert,
  Vote: Vote,
  Droplets: Droplets,
  Cpu: Cpu,
  Biohazard: Biohazard
};

export default function FilterSidebar() {
  const {
    events,
    filteredEvents,
    activeCategory,
    setActiveCategory,
    activeSeverity,
    setActiveSeverity,
    verificationFilter,
    setVerificationFilter,
    handleSelectEvent,
    selectedEvent
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'feed'

  // Calculate counts per category
  const categoryCounts = events.reduce((acc, ev) => {
    acc[ev.category] = (acc[ev.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <aside
      style={{
        position: 'absolute',
        top: '124px',
        left: '20px',
        bottom: '24px',
        width: isCollapsed ? '48px' : '320px',
        zIndex: 30,
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderColor: 'var(--border-cyan)',
          boxShadow: 'var(--shadow-hud)'
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(6, 9, 19, 0.8)'
          }}
        >
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListFilter size={16} color="var(--accent-cyan)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '0.04em',
                  color: 'var(--text-primary)'
                }}
              >
                INTELLIGENCE FILTERS
              </span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}
            title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
          >
            {isCollapsed ? <ChevronRight size={16} color="var(--accent-cyan)" /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* When Collapsed: Vertical quick icons */}
        {isCollapsed ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 0',
              gap: '12px'
            }}
          >
            <button
              onClick={() => { setActiveCategory('all'); setIsCollapsed(false); }}
              style={{
                background: activeCategory === 'all' ? 'var(--accent-cyan)' : 'transparent',
                color: activeCategory === 'all' ? '#000' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
                cursor: 'pointer'
              }}
              title="All Events"
            >
              <Layers size={16} />
            </button>
            {CATEGORIES.map(cat => {
              const Icon = ICON_COMPONENTS[cat.icon] || Layers;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setIsCollapsed(false); }}
                  style={{
                    background: isSelected ? cat.color : 'transparent',
                    color: isSelected ? '#000' : cat.color,
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px',
                    cursor: 'pointer'
                  }}
                  title={`${cat.name} (${categoryCounts[cat.id] || 0})`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        ) : (
          /* Expanded Panel Content */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* View Tab Switcher */}
            <div
              style={{
                display: 'flex',
                padding: '8px 12px',
                background: 'rgba(10, 15, 31, 0.6)',
                borderBottom: '1px solid var(--border-subtle)',
                gap: '6px'
              }}
            >
              <button
                onClick={() => setActiveTab('categories')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'categories' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: activeTab === 'categories' ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
              >
                CATEGORIES ({events.length})
              </button>

              <button
                onClick={() => setActiveTab('feed')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'feed' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: activeTab === 'feed' ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
              >
                TACTICAL FEED ({filteredEvents.length})
              </button>
            </div>

            {/* Scrollable Body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px'
              }}
            >
              {activeTab === 'categories' ? (
                <>
                  {/* Category Pill List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    {/* All Events */}
                    <button
                      onClick={() => setActiveCategory('all')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: activeCategory === 'all' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                        background: activeCategory === 'all' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        color: activeCategory === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={15} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>All Incidents</span>
                      </div>
                      <span className="mono-num" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {events.length}
                      </span>
                    </button>

                    {CATEGORIES.map(cat => {
                      const Icon = ICON_COMPONENTS[cat.icon] || Layers;
                      const isSelected = activeCategory === cat.id;
                      const count = categoryCounts[cat.id] || 0;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid',
                            borderColor: isSelected ? cat.color : 'var(--border-subtle)',
                            background: isSelected ? `${cat.glow}` : 'rgba(255, 255, 255, 0.02)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icon size={15} color={cat.color} />
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{cat.name}</span>
                          </div>
                          <span
                            className="mono-num"
                            style={{
                              fontSize: '0.72rem',
                              color: isSelected ? cat.color : 'var(--text-muted)',
                              fontWeight: '600'
                            }}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Severity Filter */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginBottom: '14px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      SEVERITY THRESHOLD
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {['all', 'critical', 'high', 'medium'].map(sev => {
                        const isSelected = activeSeverity === sev;
                        return (
                          <button
                            key={sev}
                            onClick={() => setActiveSeverity(sev)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid',
                              borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                              background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                              color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono)',
                              textTransform: 'uppercase',
                              cursor: 'pointer'
                            }}
                          >
                            {sev}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Verification Filter */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      VERIFICATION STATUS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {[
                        { id: 'all', label: 'All Reports' },
                        { id: 'VERIFIED', label: 'Verified Intelligence' },
                        { id: 'UNDER_REVIEW', label: 'Under Review' }
                      ].map(st => {
                        const isSelected = verificationFilter === st.id;
                        return (
                          <button
                            key={st.id}
                            onClick={() => setVerificationFilter(st.id)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid',
                              borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                              background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                              color: isSelected ? 'var(--accent-emerald)' : 'var(--text-muted)',
                              fontSize: '0.75rem',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            {st.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Tactical Feed View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredEvents.map(ev => {
                    const cat = CATEGORIES.find(c => c.id === ev.category);
                    const isSelected = selectedEvent?.id === ev.id;

                    return (
                      <div
                        key={ev.id}
                        onClick={() => handleSelectEvent(ev)}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                          background: isSelected ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span
                            className="tactical-badge"
                            style={{
                              fontSize: '0.65rem',
                              padding: '1px 6px',
                              borderColor: cat?.color || 'var(--accent-cyan)',
                              color: cat?.color || 'var(--accent-cyan)'
                            }}
                          >
                            {ev.subcategory}
                          </span>
                          <span
                            className="mono-num"
                            style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}
                          >
                            {ev.timestamp}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            lineHeight: '1.3',
                            marginBottom: '4px'
                          }}
                        >
                          {ev.title}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          <MapPin size={11} color="var(--accent-cyan)" />
                          <span>{ev.location.city}, {ev.location.country}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
