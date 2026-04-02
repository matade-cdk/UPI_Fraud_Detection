import React, { useState } from 'react';
import './HowItWorks.css';

const STEPS = [
  {
    num: '01',
    title: 'Transaction Intercepted',
    desc: 'Every UPI transaction payload is captured in real-time via our API gateway hook — including amount, merchant, device metadata, and geolocation.',
    detail: 'We integrate directly with the UPI stack, adding zero latency to normal payment flows.',
  },
  {
    num: '02',
    title: 'Feature Extraction',
    desc: 'Our pipeline extracts 47 behavioural and contextual features from the raw transaction in milliseconds — velocity, time patterns, device trust scores and more.',
    detail: 'Feature engineering is performed in an optimised NumPy/Pandas pipeline running on the inference server.',
  },
  {
    num: '03',
    title: 'ML Model Inference',
    desc: 'An ensemble of XGBoost + Random Forest classifiers produces a fraud probability score. Anomaly scores are stacked for final prediction.',
    detail: 'The model is retrained weekly on up-to-date fraud data streams, with A/B shadow deployment.',
  },
  {
    num: '04',
    title: 'Risk Decision',
    desc: 'Transactions scoring above the dynamic threshold are flagged. LOW / MEDIUM / HIGH risk tiers trigger different response policies automatically.',
    detail: 'Policy engine supports allow, challenge (2FA), hold, and block actions per tier.',
  },
  {
    num: '05',
    title: 'Alert & Report',
    desc: 'Instant alerts are pushed to the user\'s dashboard, SMS, and email. A full explainability report shows which signals triggered the fraud alert.',
    detail: 'SHAP values power transparent AI explanations — building user trust and meeting RBI explainability guidelines.',
  },
];

const HowItWorks = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="hiw">
      <div className="container">
        <div className="hiw__header">
          <div className="tag-line">Process</div>
          <h2 className="sec-title">How the <span>detection pipeline</span> works</h2>
          <p className="sec-desc">Five stages. Sub-200ms total. Zero compromises.</p>
        </div>

        <div className="hiw__body">
          {/* Timeline */}
          <div className="hiw__timeline">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`hiw__step ${active === i ? 'active' : ''}`}
                onClick={() => setActive(i)}
              >
                <div className="hiw__step-num">{s.num}</div>
                <div className="hiw__step-info">
                  <div className="hiw__step-title">{s.title}</div>
                  <div className="hiw__step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
            <div className="hiw__timeline-line" />
          </div>

          {/* Detail panel */}
          <div className="hiw__panel">
            <div className="hiw__panel-num">{STEPS[active].num}</div>
            <h3 className="hiw__panel-title">{STEPS[active].title}</h3>
            <p className="hiw__panel-desc">{STEPS[active].desc}</p>
            <div className="hiw__panel-divider" />
            <p className="hiw__panel-detail">{STEPS[active].detail}</p>
            <div className="hiw__panel-nav">
              <button
                className="hiw__nav-btn"
                onClick={() => setActive(a => Math.max(0, a - 1))}
                disabled={active === 0}
              >← Prev</button>
              <button
                className="hiw__nav-btn"
                onClick={() => setActive(a => Math.min(STEPS.length - 1, a + 1))}
                disabled={active === STEPS.length - 1}
              >Next →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
