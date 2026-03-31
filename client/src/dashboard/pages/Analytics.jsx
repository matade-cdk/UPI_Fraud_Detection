import React, { useEffect, useMemo, useState } from 'react';
import './Analytics.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const riskColorMap = { HIGH: '#ff3232', MEDIUM: '#ffcc00', LOW: '#00ff41' };
const fraudStatuses = new Set(['flagged', 'blocked']);

function riskFromTransaction(txn) {
  const status = String(txn.status || '').toLowerCase();
  if (status === 'blocked' || status === 'flagged') {
    return 'HIGH';
  }
  const score = Number(txn.score || 0);
  if (score >= 70) {
    return 'MEDIUM';
  }
  return 'LOW';
}

const Analytics = () => {
  const [activeBar, setActiveBar] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadAnalyticsData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/transactions/public?page=1&limit=500`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch analytics data');
        }

        if (mounted) {
          setTransactions(Array.isArray(data?.items) ? data.items : []);
          setError('');
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch analytics data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAnalyticsData();
    const pollId = setInterval(loadAnalyticsData, 15000);

    return () => {
      mounted = false;
      clearInterval(pollId);
    };
  }, []);

  const {
    BAR_DATA,
    DONUT,
    HOUR_DATA,
    TOP_MERCHANTS,
    SPARK,
  } = useMemo(() => {
    const now = Date.now();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const last14FraudPerDay = new Array(14).fill(0);
    const weeklyTotals = DAY_NAMES.map((label, index) => ({ label, dayIndex: index, total: 0, fraud: 0 }));
    const hourly = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0, fraud: 0 }));

    const merchantMap = new Map();
    const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0 };

    transactions.forEach((txn) => {
      const ts = new Date(txn.time).getTime();
      if (!Number.isFinite(ts)) {
        return;
      }

      const status = String(txn.status || '').toLowerCase();
      const isFraud = fraudStatuses.has(status);
      const risk = riskFromTransaction(txn);
      riskCounts[risk] += 1;

      const date = new Date(ts);
      const dayDiff = Math.floor((now - ts) / (24 * 60 * 60 * 1000));

      if (dayDiff >= 0 && dayDiff < 14 && isFraud) {
        const sparkIdx = 13 - dayDiff;
        last14FraudPerDay[sparkIdx] += 1;
      }

      if (now - ts <= sevenDaysMs) {
        const dayIdx = date.getDay();
        weeklyTotals[dayIdx].total += 1;
        if (isFraud) {
          weeklyTotals[dayIdx].fraud += 1;
        }
      }

      const hour = date.getHours();
      hourly[hour].count += 1;
      if (isFraud) {
        hourly[hour].fraud += 1;
      }

      const merchantName = txn.merchantCategory || txn.receiverName || txn.upiRecipient || 'Unknown Merchant';
      if (!merchantMap.has(merchantName)) {
        merchantMap.set(merchantName, { name: merchantName, total: 0, fraud: 0, totalScore: 0 });
      }
      const bucket = merchantMap.get(merchantName);
      bucket.total += 1;
      bucket.totalScore += Number(txn.score || 0);
      if (isFraud) {
        bucket.fraud += 1;
      }
    });

    const totalForDonut = riskCounts.LOW + riskCounts.MEDIUM + riskCounts.HIGH;
    const donutData = [
      { label: 'Low', pct: totalForDonut ? Math.round((riskCounts.LOW / totalForDonut) * 100) : 0, color: '#00ff41' },
      { label: 'Medium', pct: totalForDonut ? Math.round((riskCounts.MEDIUM / totalForDonut) * 100) : 0, color: '#ffcc00' },
      { label: 'High', pct: totalForDonut ? Math.round((riskCounts.HIGH / totalForDonut) * 100) : 0, color: '#ff3232' },
    ];

    const topMerchants = [...merchantMap.values()]
      .filter((m) => m.fraud > 0)
      .sort((a, b) => b.fraud - a.fraud)
      .slice(0, 5)
      .map((m) => {
        const avgScore = m.total ? m.totalScore / m.total : 0;
        const fraudRate = m.total ? m.fraud / m.total : 0;
        const risk = avgScore >= 70 || fraudRate >= 0.6 ? 'HIGH' : avgScore >= 40 || fraudRate >= 0.3 ? 'MEDIUM' : 'LOW';
        return { name: m.name, count: m.fraud, risk };
      });

    return {
      BAR_DATA: weeklyTotals,
      DONUT: donutData,
      HOUR_DATA: hourly,
      TOP_MERCHANTS: topMerchants,
      SPARK: last14FraudPerDay,
    };
  }, [transactions]);

  const maxTotal = Math.max(...BAR_DATA.map((d) => d.total), 1);
  const sparkMax = Math.max(...SPARK, 1);
  const sparkPoints = SPARK.map((v, i) => {
    const x = (i / Math.max(SPARK.length - 1, 1)) * 340;
    const y = 60 - (v / sparkMax) * 55;
    return `${x},${y}`;
  }).join(' ');

  const prev7 = SPARK.slice(0, 7).reduce((sum, v) => sum + v, 0);
  const curr7 = SPARK.slice(7).reduce((sum, v) => sum + v, 0);
  const fraudTrendPct = prev7 ? Math.round(((curr7 - prev7) / prev7) * 100) : (curr7 > 0 ? 100 : 0);

  const topMerchantRows = TOP_MERCHANTS.length
    ? TOP_MERCHANTS
    : [{ name: 'No fraud pattern yet', count: 0, risk: 'LOW' }];

  return (
    <div className="analytics">
      {error ? <div className="user-records-error">{error}</div> : null}

      {loading ? <div className="db-alerts">Loading analytics...</div> : null}

      {/* ── Row 1: Sparkline + Donut ── */}
      <div className="an-row">
        {/* Fraud trend sparkline */}
        <div className="an-card an-card--wide">
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Fraud incidents — Last 14 days</div>
              <div className="an-card__sub">Rolling daily fraud count</div>
            </div>
            <div className="an-stat-pill an-stat-pill--red">{`${fraudTrendPct >= 0 ? '+' : ''}${fraudTrendPct}% vs prev`}</div>
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
                {DONUT.find(d=>d.label==='Low')?.pct || 0}%
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
                      style={{ height: `${(d.fraud / maxTotal) * 100}%` }} />
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
                    : `rgba(0,255,65,${Math.min(h.count / 20, 0.3)})`,
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
              {topMerchantRows.map((m, i) => (
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
                        width: `${Math.min((m.count / Math.max(topMerchantRows[0]?.count || 1, 1)) * 100, 100)}%`,
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
