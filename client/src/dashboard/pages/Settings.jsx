import React from 'react';

const Settings = () => (
  <div className="db-alerts" style={{ marginTop: '1.8rem' }}>
    <div className="db-alerts__title">System Settings</div>
    <div className="db-alert__text">
      Update API keys, alert thresholds, and notification rules from this panel.
    </div>
    <div className="db-alert" style={{ borderBottom: 'none', paddingTop: '1rem' }}>
      <div className="db-alert__dot db-alert__dot--low" />
      <div className="db-alert__text">Default fraud threshold: score 65/100</div>
      <div className="db-alert__time">ACTIVE</div>
    </div>
    <div className="db-alert" style={{ borderBottom: 'none', paddingTop: 0 }}>
      <div className="db-alert__dot db-alert__dot--medium" />
      <div className="db-alert__text">Webhook notifications: enabled</div>
      <div className="db-alert__time">ACTIVE</div>
    </div>
  </div>
);

export default Settings;
