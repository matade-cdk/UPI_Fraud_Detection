import React from 'react';

const ALERTS = [
  { tier: 'high',   text: 'High-value transfer ₹82,000 to new UPI at 3AM — flagged by velocity + time anomaly.', time: '2m ago' },
  { tier: 'high',   text: '₹61,000 transfer to unknown@okaxis — device fingerprint mismatch detected.', time: '8m ago' },
  { tier: 'medium', text: '₹34,500 to unverified merchant — score 58/100. Awaiting review.', time: '22m ago' },
  { tier: 'medium', text: 'Account ip_user_2847 showing frequency anomaly — 12 transactions in 4 min.', time: '1h ago' },
  { tier: 'low',    text: 'Routine flag cleared — transaction TXN-9174 confirmed legitimate.', time: '2h ago' },
];

const AlertsFeed = () => (
  <div className="db-alerts">
    <div className="db-alerts__title">Real-Time Alerts</div>
    {ALERTS.map((a, i) => (
      <div key={i} className="db-alert">
        <div className={`db-alert__dot db-alert__dot--${a.tier}`} />
        <div className="db-alert__text">{a.text}</div>
        <div className="db-alert__time">{a.time}</div>
      </div>
    ))}
  </div>
);

export default AlertsFeed;
