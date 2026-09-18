import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  Fuel,
  Wheat,
  Flame,
  Sparkles,
  Disc,
  Activity
} from 'lucide-react';

export default function MarketsPanel() {
  const { marketData } = useApp();
  const [activeMarketTab, setActiveMarketTab] = useState('all'); // 'all' (Markets) | 'stocks' | 'commodities' | 'forex'

  const commodityIcons = {
    Gold: Coins,
    'Brent Crude Oil': Fuel,
    Wheat: Wheat,
    'Natural Gas': Flame,
    Silver: Sparkles,
    Copper: Disc
  };

  const showStocks = activeMarketTab === 'all' || activeMarketTab === 'stocks';
  const showCommodities = activeMarketTab === 'all' || activeMarketTab === 'commodities';
  const showForex = activeMarketTab === 'all' || activeMarketTab === 'forex';

  return (
    <aside
      style={{
        position: 'absolute',
        top: '114px',
        right: '16px',
        bottom: '44px',
        width: '320px',
        zIndex: 25,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto'
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
          background: 'rgba(10, 15, 31, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Header Tabs: Markets | Stocks | Commodities | Forex */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 10px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(6, 9, 19, 0.7)',
            gap: '4px'
          }}
        >
          <button
            onClick={() => setActiveMarketTab('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              background: activeMarketTab === 'all' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              border: '1px solid',
              borderColor: activeMarketTab === 'all' ? 'var(--accent-cyan)' : 'transparent',
              color: activeMarketTab === 'all' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <TrendingUp size={12} />
            <span>Markets</span>
          </button>

          <button
            onClick={() => setActiveMarketTab('stocks')}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              background: activeMarketTab === 'stocks' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              border: '1px solid',
              borderColor: activeMarketTab === 'stocks' ? 'var(--accent-cyan)' : 'transparent',
              color: activeMarketTab === 'stocks' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: activeMarketTab === 'stocks' ? '700' : '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Stocks
          </button>

          <button
            onClick={() => setActiveMarketTab('commodities')}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              background: activeMarketTab === 'commodities' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              border: '1px solid',
              borderColor: activeMarketTab === 'commodities' ? 'var(--accent-cyan)' : 'transparent',
              color: activeMarketTab === 'commodities' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: activeMarketTab === 'commodities' ? '700' : '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Commodities
          </button>

          <button
            onClick={() => setActiveMarketTab('forex')}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              background: activeMarketTab === 'forex' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              border: '1px solid',
              borderColor: activeMarketTab === 'forex' ? 'var(--accent-cyan)' : 'transparent',
              color: activeMarketTab === 'forex' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: activeMarketTab === 'forex' ? '700' : '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Forex
          </button>
        </div>

        {/* Scrollable Market Tables Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* SECTION 1: Top Stock Indexes */}
          {showStocks && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: '0.01em'
                  }}
                >
                  Top Stock Indexes
                </h4>
              </div>

              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.1fr 1fr',
                  padding: '4px 6px',
                  fontSize: '0.66rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>Index</div>
                <div style={{ textAlign: 'right' }}>Price (USD)</div>
                <div style={{ textAlign: 'right' }}>Change %</div>
              </div>

              {/* Table Rows */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {marketData.stocks.map((st, i) => {
                  const isPositive = st.isPositive;
                  return (
                    <div
                      key={`st-${i}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1.1fr 1fr',
                        padding: '6px',
                        alignItems: 'center',
                        fontSize: '0.74rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          color: '#E2E8F0',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {st.name}
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '600',
                          color: '#F8FAFC'
                        }}
                      >
                        {st.price}
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '700',
                          color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-crimson)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '2px'
                        }}
                      >
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        <span>{st.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: Top Commodities */}
          {showCommodities && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: '0.01em'
                  }}
                >
                  Top Commodities
                </h4>
              </div>

              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.1fr 1fr',
                  padding: '4px 6px',
                  fontSize: '0.66rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>Commodity</div>
                <div style={{ textAlign: 'right' }}>Price (USD)</div>
                <div style={{ textAlign: 'right' }}>Change %</div>
              </div>

              {/* Table Rows */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {marketData.commodities.map((cm, i) => {
                  const Icon = commodityIcons[cm.name] || Coins;
                  const isPositive = cm.isPositive;
                  return (
                    <div
                      key={`cm-${i}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1.1fr 1fr',
                        padding: '6px',
                        alignItems: 'center',
                        fontSize: '0.74rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#E2E8F0',
                          fontWeight: '600'
                        }}
                      >
                        <Icon size={13} color={cm.color || '#F59E0B'} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cm.name}
                        </span>
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '600',
                          color: '#F8FAFC'
                        }}
                      >
                        {cm.price}
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '700',
                          color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-crimson)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '2px'
                        }}
                      >
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        <span>{cm.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: Top Trading Forex */}
          {showForex && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: '0.01em'
                  }}
                >
                  Top Trading Forex
                </h4>
              </div>

              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.1fr 1fr',
                  padding: '4px 6px',
                  fontSize: '0.66rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>Currency Pair</div>
                <div style={{ textAlign: 'right' }}>Price</div>
                <div style={{ textAlign: 'right' }}>Change %</div>
              </div>

              {/* Table Rows */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {marketData.forex.map((fx, i) => {
                  const isPositive = fx.isPositive;
                  return (
                    <div
                      key={`fx-${i}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1.1fr 1fr',
                        padding: '6px',
                        alignItems: 'center',
                        fontSize: '0.74rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          color: '#E2E8F0',
                          fontWeight: '600'
                        }}
                      >
                        {fx.pair}
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '600',
                          color: '#F8FAFC'
                        }}
                      >
                        {fx.price}
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '700',
                          color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-crimson)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '2px'
                        }}
                      >
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        <span>{fx.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
