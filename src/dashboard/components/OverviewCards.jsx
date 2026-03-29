import React from 'react';

const CARDS = [
  { label: 'Total Transactions', value: '12,847', trend: '+4.2% today', dir: 'up', color: '' },
  { label: 'Fraud Detected',     value: '38',     trend: '+2 in last hour', dir: 'up', color: 'red' },
  { label: 'Flagged / Review',   value: '112',    trend: '-8% vs yesterday', dir: 'down', color: 'amber' },
  { label: 'Model Accuracy',     value: '99.3%',  trend: 'Live production', dir: '', color: '' },
];

const OverviewCards = () => (
  <div className="db-cards">
    {CARDS.map((c, i) => (
      <div key={i} className="db-card">
        <div className="db-card__label">{c.label}</div>
        <div className={`db-card__value ${c.color}`}>{c.value}</div>
        <div className={`db-card__trend ${c.dir}`}>{c.trend}</div>
      </div>
    ))}
  </div>
);

export default OverviewCards;
