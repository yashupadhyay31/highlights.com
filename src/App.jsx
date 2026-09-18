import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import AlertTicker from './components/AlertTicker';
import YourFeedPanel from './components/YourFeedPanel';
import MarketsPanel from './components/MarketsPanel';
import Globe3D from './components/Globe3D';
import TacticalMap2D from './components/TacticalMap2D';
import LivePulseView from './components/LivePulseView';
import BriefingsView from './components/BriefingsView';
import HoverCard from './components/HoverCard';
import EventDossier from './components/EventDossier';
import ReporterSubmitModal from './components/ReporterSubmitModal';
import ReporterDashboard from './components/ReporterDashboard';
import AdminModerationModal from './components/AdminModerationModal';
import NearbyModal from './components/NearbyModal';
import AuthModal from './components/AuthModal';
import { Radio } from 'lucide-react';

function HighlightsPlatform() {
  const {
    viewMode,
    activeNavTab,
    filteredEvents,
    userLocation
  } = useApp();

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      {/* Background Cyber HUD Grid Overlay */}
      <div className="hud-grid-overlay" />

      {/* Global Header Navigation */}
      <Header />

      {/* Full-Width Horizontal News Channel Marquee Ticker */}
      <AlertTicker />

      {/* LEFT COLUMN: Your Feed */}
      <YourFeedPanel />

      {/* CENTER VIEWPORT: 3D Globe / 2D Map / Live Pulse / Briefings */}
      {activeNavTab === 'pulse' ? (
        <LivePulseView />
      ) : activeNavTab === 'briefings' ? (
        <BriefingsView />
      ) : viewMode === '2d' ? (
        <TacticalMap2D />
      ) : (
        <Globe3D />
      )}

      {/* RIGHT COLUMN: Financial Intelligence Markets Panel */}
      <MarketsPanel />

      {/* Marker 3D Hover Card Preview */}
      <HoverCard />

      {/* Right Sliding Event Dossier Drawer */}
      <EventDossier />

      {/* Field Reporter Structured Intake Form */}
      <ReporterSubmitModal />

      {/* Field Reporter Reputation HUD */}
      <ReporterDashboard />

      {/* Admin Moderation Desk & Confidential Identity Vault */}
      <AdminModerationModal />

      {/* Location-Aware Discovery Radar Modal */}
      <NearbyModal />

      {/* Authentication & Role Simulator Modal */}
      <AuthModal />

      {/* Bottom Tactical Telemetry Bar */}
      <footer
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          background: 'rgba(6, 9, 19, 0.94)',
          borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          zIndex: 35,
          backdropFilter: 'blur(8px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
            <Radio size={12} className="live-indicator" />
            <span>ORBITAL MESH ONLINE</span>
          </div>

          <div style={{ color: 'var(--border-medium)' }}>|</div>

          <div>
            ACTIVE TARGETS: <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>{filteredEvents.length}</span>
          </div>

          {userLocation && (
            <>
              <div style={{ color: 'var(--border-medium)' }}>|</div>
              <div style={{ color: 'var(--accent-cyan)' }}>
                GPS LOCK: {userLocation.name} (r={userLocation.radiusKm}km)
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div>
            PROJECTION: <span style={{ color: '#fff' }}>{viewMode === '3d' ? '3D GEOID' : '2D EQUIRECT'}</span>
          </div>
          <div style={{ color: 'var(--border-medium)' }}>|</div>
          <div>
            SPEC: <span style={{ color: 'var(--accent-cyan)' }}>EVENTGRID 2.0</span>
          </div>
          <div style={{ color: 'var(--border-medium)' }}>|</div>
          <div style={{ color: 'var(--text-primary)' }}>
            HIGHLIGHTS.COM PLATFORM
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HighlightsPlatform />
    </AppProvider>
  );
}
