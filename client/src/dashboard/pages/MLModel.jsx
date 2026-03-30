import React from 'react';

const METRICS = [
  { label: 'Model Version', value: 'v2.4.1' },
  { label: 'Accuracy', value: '99.3%' },
  { label: 'Precision', value: '98.8%' },
  { label: 'Recall', value: '97.9%' },
  { label: 'Last Retrain', value: '28 Mar 2026' },
  { label: 'Status', value: 'Live' },
];

const MLModel = () => (
  <div className="db-alerts" style={{ marginTop: '1.8rem' }}>
    <div className="db-alerts__title">Model Diagnostics</div>
    <div className="db-cards" style={{ padding: 0 }}>
      {METRICS.map((metric) => (
        <div key={metric.label} className="db-card">
          <div className="db-card__label">{metric.label}</div>
          <div className="db-card__value">{metric.value}</div>
        </div>
      ))}
    </div>
  </div>
);

export default MLModel;
