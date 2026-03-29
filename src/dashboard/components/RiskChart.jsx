import React from 'react';

const BARS = [
  { label: 'Low', value: 68, className: 'db-badge--low' },
  { label: 'Medium', value: 22, className: 'db-badge--medium' },
  { label: 'High', value: 10, className: 'db-badge--high' },
];

const RiskChart = () => (
  <div className="db-alerts">
    <div className="db-alerts__title">Risk Distribution (24h)</div>
    {BARS.map((bar) => (
      <div key={bar.label} style={{ marginBottom: '0.9rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.35rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '.68rem',
            color: 'rgba(232,255,232,.75)',
          }}
        >
          <span>{bar.label}</span>
          <span>{bar.value}%</span>
        </div>
        <div style={{ background: 'rgba(0,255,65,.07)', borderRadius: '999px', height: '8px' }}>
          <div
            className={bar.className}
            style={{
              width: `${bar.value}%`,
              height: '8px',
              borderRadius: '999px',
              padding: 0,
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

export default RiskChart;
