import React, { useState } from 'react';
import './Analytics.css';

/* -------- Mini bar chart (pure CSS/SVG) -------- */
const BAR_DATA = [
  { label: 'Mon', total: 1840, fraud: 12 },
  { label: 'Tue', total: 2100, fraud: 18 },
  { label: 'Wed', total: 1760, fraud: 8  },
  { label: 'Thu', total: 2450, fraud: 31 },
  { label: 'Fri', total: 2980, fraud: 27 },
  { label: 'Sat', total: 1320, fraud: 6  },
  { label: 'Sun', total: 980,  fraud: 4  },
];

const maxTotal = Math.max(...BAR_DATA.map(d => d.total));

/* -------- Sparkline (SVG) -------- */
const SPARK = [12, 18, 8, 31, 27, 6, 4, 22, 15, 38, 11, 9, 44, 30];
const sparkMax = Math.max(...SPARK);
const sparkPoints = SPARK.map((v, i) => {
  const x = (i / (SPARK.length - 1)) * 340;
  const y = 60 - (v / sparkMax) * 55;
  return `${x},${y}`;
}).join(' ');

/* -------- Risk distribution donut -------- */
const DONUT = [
  { label: 'Low',    pct: 68, color: '#00ff41' },
  { label: 'Medium', pct: 22, color: '#ffcc00' },
  { label: 'High',   pct: 10, color: '#ff3232' },
];

const HOUR_DATA = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  count: Math.round(20 + Math.sin((h - 3) * 0.6) * 15 + Math.random() * 8),
  fraud: Math.round(Math.max(0, Math.sin((h - 2) * 0.5) * 3 + (h >= 1 && h <= 5 ? 4 : 0))),
}));

const TOP_MERCHANTS = [
  { name: 'Unknown Merchant', count: 34, risk: 'HIGH' },
  { name: 'Crypto Exchange XY', count: 28, risk: 'HIGH' },
  { name: 'InstaKash Wallet', count: 19, risk: 'MEDIUM' },
  { name: 'QuickLoan App', count: 15, risk: 'MEDIUM' },
  { name: 'AliMart Online', count: 9,  risk: 'LOW' },
];

const riskColorMap = { HIGH: '#ff3232', MEDIUM: '#ffcc00', LOW: '#00ff41' };

const Analytics = () => {
  const [activeBar, setActiveBar] = useState(null);

  return (
    <div className="analytics">

      {/* ── Row 1: Sparkline + Donut ── */}
      <div className="an-row">
        {/* Fraud trend sparkline */}
        <div className="an-card an-card--wide">
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Fraud incidents — Last 14 days</div>
              <div className="an-card__sub">Rolling daily fraud count</div>
            </div>
            <div className="an-stat-pill an-stat-pill--red">+12% vs prev</div>
          </div>
          <svg className="an-sparkline" viewBox="0 0 340 70" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff41" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#00ff41" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
              points={`0,65 ${sparkPoints} 340,65`}
              fill="url(#sparkGrad)"
            />
            {/* Line */}
            <polyline points={sparkPoints} fill="none" stroke="#00ff41" strokeWidth="1.8"
              strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px #00ff41)' }}/>
            {/* Dots */}
            {SPARK.map((v, i) => {
              const x = (i / (SPARK.length - 1)) * 340;
              const y = 60 - (v / sparkMax) * 55;
              return <circle key={i} cx={x} cy={y} r="3" fill="#00ff41"
                style={{ filter: 'drop-shadow(0 0 4px #00ff41)' }}/>;
            })}
          </svg>
          <div className="an-sparkline-labels">
            {['14d ago','11d ago','8d ago','5d ago','2d ago','Today'].map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>

        {/* Risk distribution */}
        <div className="an-card">
          <div className="an-card__header">
            <div className="an-card__title">Risk Distribution</div>
          </div>
          <div className="an-donut-wrap">
            <svg viewBox="0 0 120 120" className="an-donut">
              {(() => {
                let offset = 0;
                const circ = 2 * Math.PI * 48;
                return DONUT.map((d, i) => {
                  const dash = (d.pct / 100) * circ;
                  const gap  = circ - dash;
                  const el = (
                    <circle key={i} cx="60" cy="60" r="48"
                      fill="none"
                      stroke={d.color}
                      strokeWidth="14"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 60 60)"
                      style={{ filter: `drop-shadow(0 0 5px ${d.color}66)` }}
                    />
                  );
                  offset += dash;
                  return el;
                });
              })()}
              <text x="60" y="56" textAnchor="middle" fill="#00ff41"
                fontSize="14" fontWeight="900" fontFamily="Orbitron">
                {DONUT.find(d=>d.label==='Low').pct}%
              </text>
              <text x="60" y="70" textAnchor="middle" fill="rgba(232,255,232,.5)"
                fontSize="7" fontFamily="Share Tech Mono">
                SAFE
              </text>
            </svg>
            <div className="an-donut-legend">
              {DONUT.map(d => (
                <div key={d.label} className="an-legend-row">
                  <span className="an-legend-dot" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }}/>
                  <span className="an-legend-label">{d.label} Risk</span>
                  <span className="an-legend-pct" style={{ color: d.color }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Weekly bar chart ── */}
      <div className="an-row">
        <div className="an-card an-card--wide">
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Weekly Transaction Volume vs Fraud</div>
              <div className="an-card__sub">Hover bars for details</div>
            </div>
            <div className="an-legend-row" style={{ gap: '1.2rem' }}>
              <span className="an-legend-row"><span className="an-legend-dot" style={{ background: 'rgba(0,255,65,.35)' }}/><span style={{ fontSize:'.7rem', color: 'rgba(232,255,232,.5)' }}>Total</span></span>
              <span className="an-legend-row"><span className="an-legend-dot" style={{ background: '#ff3232', boxShadow: '0 0 5px #ff3232' }}/><span style={{ fontSize:'.7rem', color: 'rgba(232,255,232,.5)' }}>Fraud</span></span>
            </div>
          </div>
          <div className="an-barchart">
            {BAR_DATA.map((d, i) => (
              <div key={i} className="an-bar-group"
                onMouseEnter={() => setActiveBar(i)}
                onMouseLeave={() => setActiveBar(null)}>
                {activeBar === i && (
                  <div className="an-tooltip">
                    <div>{d.label}</div>
                    <div style={{ color: '#00ff41' }}>{d.total.toLocaleString()} txns</div>
                    <div style={{ color: '#ff3232' }}>{d.fraud} fraud</div>
                  </div>
                )}
                <div className="an-bar-track">
                  <div className="an-bar an-bar--total"
                    style={{ height: `${(d.total / maxTotal) * 100}%` }} />
                  <div className="an-bar an-bar--fraud"
                    style={{ height: `${(d.fraud / maxTotal) * 100 * 6}%` }} />
                </div>
                <div className="an-bar-label">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly heatmap preview */}
        <div className="an-card">
          <div className="an-card__title" style={{ marginBottom: '1rem' }}>Fraud by Hour of Day</div>
          <div className="an-heatmap">
            {HOUR_DATA.map(h => (
              <div key={h.hour} className="an-heat-cell"
                title={`${h.hour}:00 — ${h.fraud} fraud`}
                style={{
                  background: h.fraud > 3
                    ? `rgba(255,50,50,${Math.min(h.fraud / 6, 0.8)})`
                    : `rgba(0,255,65,${Math.min(h.count / 35, 0.3)})`,
                }}
              >
              </div>
            ))}
          </div>
          <div className="an-heatmap-labels">
            {['12a','3a','6a','9a','12p','3p','6p','9p'].map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div className="an-card__sub" style={{ marginTop: '.6rem' }}>
            Red = high fraud hour · Green = high volume
          </div>
        </div>
      </div>

      {/* ── Row 3: Top risky merchants ── */}
      <div className="an-row">
        <div className="an-card an-card--wide">
          <div className="an-card__title" style={{ marginBottom: '1.2rem' }}>Top Risky Merchants / Patterns</div>
          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Merchant / Pattern</th>
                <th>Fraud Count</th>
                <th>Risk Level</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {TOP_MERCHANTS.map((m, i) => (
                <tr key={i}>
                  <td className="db-table__txn-id">{String(i + 1).padStart(2, '0')}</td>
                  <td>{m.name}</td>
                  <td className="db-table__amount" style={{ color: riskColorMap[m.risk] }}>
                    {m.count}
                  </td>
                  <td>
                    <span className={`db-badge db-badge--${m.risk.toLowerCase()}`}>{m.risk}</span>
                  </td>
                  <td>
                    <div className="an-mini-bar">
                      <div style={{
                        width: `${(m.count / 34) * 100}%`,
                        background: riskColorMap[m.risk],
                        boxShadow: `0 0 6px ${riskColorMap[m.risk]}`,
                      }}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
