import React from 'react';
import './TrustBar.css';

const logos = [
  { name: 'NPCI', abbr: 'NPCI' },
  { name: 'RBI Compliant', abbr: 'RBI' },
  { name: 'ISO 27001', abbr: 'ISO' },
  { name: 'PCI-DSS', abbr: 'PCI' },
  { name: 'CERT-In', abbr: 'CERT' },
  { name: 'GDPR Ready', abbr: 'GDPR' },
];

const TrustBar = () => (
  <div className="trust-bar">
    <div className="trust-bar__inner container">
      <span className="trust-bar__label">Trusted &amp; Compliant With</span>
      <div className="trust-bar__logos">
        {logos.map(l => (
          <div key={l.name} className="trust-logo">
            <span className="trust-logo__abbr">{l.abbr}</span>
            <span className="trust-logo__name">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TrustBar;
