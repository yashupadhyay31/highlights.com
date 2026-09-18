import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Compass,
  Activity,
  FileText,
  TrendingUp,
  Star,
  Bell,
  User,
  Shield,
  ShieldAlert,
  UserCheck,
  PlusCircle,
  Crosshair,
  ChevronDown,
  CheckCircle,
  Globe
} from 'lucide-react';

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    activeNavTab,
    setActiveNavTab,
    activeRole,
    setActiveRole,
    watchlist,
    reporterProfile,
    setIsSubmitModalOpen,
    setIsReporterDashboardOpen,
    setIsAdminModalOpen,
    setIsNearbyModalOpen,
    setIsAuthModalOpen,
    setAuthModalReason
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const navTabs = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'pulse', label: 'Live Pulse', icon: Activity },
    { id: 'briefings', label: 'Briefings', icon: FileText },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: Star, badge: watchlist.length > 0 ? watchlist.length : null }
  ];

  const roles = [
    { id: 'guest', name: 'Guest Explorer', icon: User, badge: 'Public Access' },
    { id: 'user', name: 'Registered User', icon: UserCheck, badge: 'Trust Voter' },
    { id: 'reporter', name: 'Field Reporter', icon: Shield, badge: `${reporterProfile.tier} (${reporterProfile.trustScore} pts)` },
    { id: 'admin', name: 'Admin Moderator', icon: ShieldAlert, badge: 'Full Clearance' }
  ];

  const currentRoleObj = roles.find(r => r.id === activeRole) || roles[0];
  const CurrentRoleIcon = currentRoleObj.icon;

  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 40,
        background: 'rgba(6, 9, 19, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      {/* Left: Brand Logo & Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {/* Logo */}
        <div
          onClick={() => setActiveNavTab('explore')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #00F2FE 0%, #0369A1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 242, 254, 0.45)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <Globe size={18} color="#060913" strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '0.06em',
              color: '#FFFFFF'
            }}
          >
            HIGHLIGHTS
          </span>
        </div>

        {/* Primary Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeNavTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNavTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(0, 242, 254, 0.35)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? 'var(--accent-cyan)' : 'currentColor'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      background: 'var(--accent-cyan)',
                      color: '#060913',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center/Right: Omnibar Search */}
      <div
        style={{
          flex: '1',
          maxWidth: '480px',
          margin: '0 20px',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '7px 16px',
            gap: '10px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
            transition: 'border-color 0.2s'
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search for a topic, country, event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-sans)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: '2px 6px'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Far Right: Notification Bell & Profile Role Hub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Report Event Button (Restricted to Registered Users and Reporters) */}
        <button
          onClick={() => {
            if (activeRole === 'guest') {
              setAuthModalReason('report');
              setIsAuthModalOpen(true);
            } else {
              setIsSubmitModalOpen(true);
            }
          }}
          className="btn-tactical btn-tactical-primary"
          style={{
            padding: '6px 14px',
            fontSize: '0.78rem',
            borderRadius: 'var(--radius-full)'
          }}
          title={activeRole === 'guest' ? 'Registration required: Become a registered user or reporter to report events' : 'Submit new field report'}
        >
          <PlusCircle size={14} />
          <span>Report Event</span>
        </button>

        {/* Proximity Near Me Radar */}
        <button
          onClick={() => setIsNearbyModalOpen(true)}
          className="btn-tactical"
          style={{
            padding: '6px 12px',
            fontSize: '0.78rem',
            borderRadius: 'var(--radius-full)'
          }}
          title="Proximity radar scan"
        >
          <Crosshair size={14} color="var(--accent-cyan)" />
          <span>Near Me</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setHasNotifications(!hasNotifications)}
          style={{
            position: 'relative',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
          title="Intelligence alerts & notifications"
        >
          <Bell size={16} />
          {hasNotifications && (
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-cyan)',
                boxShadow: '0 0 6px var(--accent-cyan)'
              }}
            />
          )}
        </button>

        {/* User Profile & Role Hub Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-medium)',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                border: '1.5px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CurrentRoleIcon size={15} color="var(--accent-cyan)" />
            </div>
            <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '700' }}>{currentRoleObj.name}</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {currentRoleObj.badge}
              </div>
            </div>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>

          {/* Profile & Role Dropdown Menu */}
          {isProfileOpen && (
            <div
              className="glass-panel-glow"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '260px',
                borderRadius: 'var(--radius-md)',
                padding: '8px',
                zIndex: 100,
                animation: 'slideUp 0.15s ease-out'
              }}
            >
              <div
                style={{
                  padding: '6px 10px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '6px'
                }}
              >
                SELECT ACTIVE ROLE SIMULATOR
              </div>

              {roles.map(r => {
                const Icon = r.icon;
                const isSelected = r.id === activeRole;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRole(r.id);
                      setIsProfileOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      background: isSelected ? 'rgba(0, 242, 254, 0.14)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                  >
                    <Icon size={16} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{r.name}</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {r.badge}
                      </div>
                    </div>
                    {isSelected && <CheckCircle size={14} color="var(--accent-cyan)" />}
                  </button>
                );
              })}

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '8px', paddingTop: '8px' }}>
                {activeRole === 'reporter' && (
                  <button
                    onClick={() => {
                      setIsReporterDashboardOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="btn-tactical"
                    style={{ width: '100%', padding: '6px', fontSize: '0.74rem', marginBottom: '6px' }}
                  >
                    <Shield size={13} color="var(--accent-cyan)" />
                    <span>Open Reputation HUD</span>
                  </button>
                )}

                {activeRole === 'admin' && (
                  <button
                    onClick={() => {
                      setIsAdminModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="btn-tactical btn-tactical-danger"
                    style={{ width: '100%', padding: '6px', fontSize: '0.74rem', marginBottom: '6px' }}
                  >
                    <ShieldAlert size={13} />
                    <span>Admin Moderation Desk</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
