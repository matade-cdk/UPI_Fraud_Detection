import React from 'react';
import './Features.css';

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00ff41" strokeWidth="1.6">
        <circle cx="14" cy="14" r="11"/>
        <path d="M9 14l3.5 3.5 6.5-7"/>
      </svg>
    ),
    title: 'Real-Time Detection',
    desc: 'Flags fraudulent transactions in under 200ms using a low-latency inference pipeline, before money leaves your account.',
    tag: '< 200ms',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00ff41" strokeWidth="1.6">
        <rect x="4" y="8" width="20" height="14" rx="2"/>
        <path d="M9 8V6a5 5 0 0110 0v2"/>
        <circle cx="14" cy="15" r="2" fill="#00ff41" stroke="none"/>
      </svg>
    ),
    title: 'Behavioural AI Engine',
    desc: 'Analyses 47+ features — transaction frequency, device fingerprint, geolocation anomalies and merchant reputation.',
    tag: '47 signals',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00ff41" strokeWidth="1.6">
        <polyline points="4,20 10,12 15,16 21,8 24,12"/>
        <circle cx="24" cy="8" r="2" fill="#00ff41" stroke="none"/>
      </svg>
    ),
    title: '99.3% Accuracy',
    desc: 'Our ensemble model (XGBoost + Random Forest) achieves 99.3% accuracy with < 0.1% false positive rate on production data.',
    tag: '99.3% acc',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00ff41" strokeWidth="1.6">
        <circle cx="14" cy="10" r="4"/>
        <path d="M6 24c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
        <path d="M20 8l2 2-2 2M8 8l-2 2 2 2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Multi-Account Shield',
    desc: 'Monitor unlimited UPI IDs simultaneously. Cross-account pattern recognition catches fraud rings and coordinated attacks.',
    tag: 'Multi-UPI',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00ff41" strokeWidth="1.6">
        <rect x="5" y="5" width="18" height="18" rx="2"/>
        <path d="M9 14h10M9 10h10M9 18h6"/>
      </svg>
    ),
    title: 'Explainable Reports',
    desc: 'Every fraud decision comes with a detailed breakdown — which signals triggered the alert and their individual risk scores.',
    tag: 'XAI Ready',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00ff41" strokeWidth="1.6">
        <path d="M14 3l9 5v6c0 5-4 9.3-9 11-5-1.7-9-6-9-11V8l9-5z"/>
        <path d="M10 14l2.5 2.5L18 11" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Bank-Grade Security',
    desc: 'End-to-end encryption, zero-log policy, and full compliance with RBI, NPCI, PCI-DSS and ISO 27001 standards.',
    tag: 'ISO 27001',
  },
];

const Features = () => (
  <section id="features" className="features grid-bg">
    <div className="container">
      <div className="features__header">
        <div className="tag-line">Core Capabilities</div>
        <h2 className="sec-title">Protection powered by <span>AI intelligence</span></h2>
        <p className="sec-desc">
          Six layers of advanced fraud detection working together to keep every rupee safe.
        </p>
      </div>

      <div className="features__grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-card__glow" />
            <div className="feature-card__icon">{f.icon}</div>
            <div className="feature-card__tag">{f.tag}</div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
            <div className="feature-card__line" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
