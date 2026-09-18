import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Crosshair,
  MapPin,
  Compass,
  Navigation,
  CheckCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function NearbyModal() {
  const {
    isNearbyModalOpen,
    setIsNearbyModalOpen,
    userLocation,
    setUserLocation,
    events,
    handleSelectEvent,
    getDistanceKm,
    setGlobeFlyTo
  } = useApp();

  const [selectedRadius, setSelectedRadius] = useState(1500); // 1500 km default
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  if (!isNearbyModalOpen) return null;

  // Preset tactical locations for quick demonstration
  const PRESET_HUBS = [
    { name: 'Jaipur / Delhi NCR', lat: 26.9124, lng: 75.7873, country: 'India' },
    { name: 'Bengaluru IT Corridor', lat: 12.9716, lng: 77.5946, country: 'India' },
    { name: 'Paris Metropolitan', lat: 48.8566, lng: 2.3522, country: 'France' },
    { name: 'Tokyo / Sendai Coast', lat: 38.2682, lng: 140.8694, country: 'Japan' }
  ];

  const handleRequestBrowserLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: 'Current Browser Geolocation',
            radiusKm: selectedRadius
          };
          setUserLocation(loc);
          setGlobeFlyTo({ lat: loc.lat, lng: loc.lng });
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation denied, falling back to Jaipur hub:', err);
          // Graceful fallback to Jaipur hub with notice
          const fallback = {
            lat: 26.9124,
            lng: 75.7873,
            name: 'Jaipur, India (Simulated)',
            radiusKm: selectedRadius
          };
          setUserLocation(fallback);
          setGlobeFlyTo({ lat: fallback.lat, lng: fallback.lng });
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSelectPreset = (hub) => {
    const loc = {
      lat: hub.lat,
      lng: hub.lng,
      name: hub.name,
      radiusKm: selectedRadius
    };
    setUserLocation(loc);
    setGlobeFlyTo({ lat: hub.lat, lng: hub.lng });
  };

  const handleApplyManual = (e) => {
    e.preventDefault();
    const lat = parseFloat(manualLat) || 28.6139;
    const lng = parseFloat(manualLng) || 77.2090;
    const loc = {
      lat,
      lng,
      name: manualCity ? `${manualCity}, ${manualCountry}` : 'Custom Coordinates',
      radiusKm: selectedRadius
    };
    setUserLocation(loc);
    setGlobeFlyTo({ lat, lng });
  };

  const handleClearLocation = () => {
    setUserLocation(null);
  };

  // Calculate events sorted by distance from active user location
  const nearbyList = userLocation
    ? events
        .map(ev => ({
          ...ev,
          distanceKm: getDistanceKm(userLocation.lat, userLocation.lng, ev.location.lat, ev.location.lng)
        }))
        .filter(ev => ev.distanceKm <= selectedRadius)
        .sort((a, b) => a.distanceKm - b.distanceKm)
    : [];

  return (
    <div className="modal-backdrop" onClick={() => setIsNearbyModalOpen(false)}>
      <div
        className="glass-panel-glow modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '640px',
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
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <Crosshair size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '800' }}>
                Proximity Radar: Events Near You
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                LOCATION-AWARE DISCOVERY • GEODESIC HAVERSINE TELEMETRY
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsNearbyModalOpen(false)}
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

        {/* Privacy Notice from Spec 2.0 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid var(--border-cyan)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginBottom: '18px'
          }}
        >
          <ShieldCheck size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Strict Privacy Rule:</strong> In compliance with the EventGrid specification, highlights.com never silently tracks or persists your device location without explicit user trigger.
          </div>
        </div>

        {/* Method 1: Browser GPS */}
        <div style={{ marginBottom: '18px' }}>
          <button
            onClick={handleRequestBrowserLocation}
            disabled={isLocating}
            className="btn-tactical btn-tactical-primary"
            style={{ width: '100%', padding: '10px' }}
          >
            <Navigation size={16} />
            <span>{isLocating ? 'Acquiring Satellite Lock...' : 'Authorize Location & Scan Vicinity'}</span>
          </button>
        </div>

        {/* Method 2: Quick Preset Tactical Hubs */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            OR SIMULATE FROM STRATEGIC REGIONAL HUBS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {PRESET_HUBS.map(hub => (
              <button
                key={hub.name}
                onClick={() => handleSelectPreset(hub)}
                className="btn-tactical"
                style={{
                  fontSize: '0.78rem',
                  padding: '8px 10px',
                  justifyContent: 'flex-start',
                  borderColor: userLocation?.name === hub.name ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  background: userLocation?.name === hub.name ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: userLocation?.name === hub.name ? 'var(--accent-cyan)' : 'var(--text-primary)'
                }}
              >
                <MapPin size={13} color="var(--accent-cyan)" />
                <span>{hub.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Radius Selector */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              SCAN RADIUS PERIMETER:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
              {selectedRadius} KM
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[100, 500, 1500, 3000, 8000].map(r => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRadius(r);
                  if (userLocation) setUserLocation({ ...userLocation, radiusKm: r });
                }}
                className="btn-tactical"
                style={{
                  flex: 1,
                  padding: '6px',
                  fontSize: '0.75rem',
                  borderColor: selectedRadius === r ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  background: selectedRadius === r ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: selectedRadius === r ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
              >
                {r >= 1000 ? `${r / 1000}k km` : `${r} km`}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        {userLocation && (
          <div
            style={{
              padding: '14px',
              background: 'rgba(10, 15, 31, 0.8)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-cyan)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff' }}>
                  {nearbyList.length} Incidents within {selectedRadius}km of {userLocation.name}
                </span>
              </div>

              <button
                onClick={handleClearLocation}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-crimson)',
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                Reset Filter
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {nearbyList.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', padding: '12px 0', textAlign: 'center' }}>
                  No active incidents recorded within this perimeter. Try expanding scan radius.
                </div>
              ) : (
                nearbyList.map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => {
                      handleSelectEvent(ev);
                      setIsNearbyModalOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {ev.location.city}, {ev.location.country}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono-num" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                        ~{ev.distanceKm} km
                      </span>
                      <ArrowRight size={13} color="var(--accent-cyan)" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
