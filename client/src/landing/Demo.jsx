import React, { useState } from 'react';
import './Demo.css';

const RISK_LABELS = {
  LOW: { label: 'LOW RISK', color: '#00ff41', bar: 15 },
  MEDIUM: { label: 'MEDIUM RISK', color: '#ffcc00', bar: 55 },
  HIGH: { label: 'HIGH RISK — FRAUD DETECTED', color: '#ff3232', bar: 92 },
};

// Deterministic mock analysis based on inputs
const analyseTransaction = ({ amount, merchant, upiId, time }) => {
  const hour = parseInt(time.split(':')[0], 10);
  const amt = parseFloat(amount) || 0;
  let score = 5;

  if (amt > 50000) score += 45;
  else if (amt > 10000) score += 20;

  if (hour >= 1 && hour <= 5) score += 30;
  else if (hour >= 22) score += 10;

  if (!merchant || merchant.length < 3) score += 25;
  if (upiId && !upiId.includes('@')) score += 20;

  const reasons = [];
  if (amt > 50000) reasons.push({ signal: 'High Transaction Amount', risk: 'HIGH', weight: '42%' });
  if (hour >= 1 && hour <= 5) reasons.push({ signal: 'Unusual Hour (1–5 AM)', risk: 'HIGH', weight: '31%' });
  if (!merchant || merchant.length < 3) reasons.push({ signal: 'Unknown / Short Merchant ID', risk: 'MEDIUM', weight: '18%' });
  if (upiId && !upiId.includes('@')) reasons.push({ signal: 'Malformed UPI ID', risk: 'MEDIUM', weight: '9%' });
  if (reasons.length === 0) reasons.push({ signal: 'Normal behavioural pattern', risk: 'LOW', weight: '100%' });

  const tier = score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';
  return { tier, score: Math.min(score, 98), reasons };
};

const Demo = () => {
  const [form, setForm] = useState({ amount: '', merchant: '', upiId: '', time: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyseTransaction(form));
      setLoading(false);
    }, 1400);
  };

  const risk = result ? RISK_LABELS[result.tier] : null;

  return (
    <section id="demo" className="demo grid-bg">
      <div className="container">
        <div className="demo__header">
          <div className="tag-line">Live Demo</div>
          <h2 className="sec-title">Try the <span>fraud scanner</span></h2>
          <p className="sec-desc">
            Enter a test transaction below. Our ML engine will analyse it and return a risk verdict.
          </p>
        </div>

        <div className="demo__body">
          {/* Form */}
          <form className="demo__form" onSubmit={handleSubmit} id="fraud-demo-form">
            <div className="demo__form-row">
              <div className="demo__field">
                <label htmlFor="amount">Transaction Amount (₹)</label>
                <input
                  id="amount" name="amount" type="number" placeholder="e.g. 75000"
                  value={form.amount} onChange={handleChange} required
                />
              </div>
              <div className="demo__field">
                <label htmlFor="time">Time of Transaction</label>
                <input
                  id="time" name="time" type="time"
                  value={form.time} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="demo__field">
              <label htmlFor="upiId">Recipient UPI ID</label>
              <input
                id="upiId" name="upiId" type="text" placeholder="e.g. john@okaxis"
                value={form.upiId} onChange={handleChange} required
              />
            </div>

            <div className="demo__field">
              <label htmlFor="merchant">Merchant / Description</label>
              <input
                id="merchant" name="merchant" type="text" placeholder="e.g. Amazon, Grocery Store"
                value={form.merchant} onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-solid demo__submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Analysing...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
                    <path d="M13.5 7.5a6 6 0 11-12 0 6 6 0 0112 0zm-6-4.5v4.5l3 1.5-.75 1.5L6 8.25V3H7.5z"/>
                  </svg>
                  Scan Transaction
                </>
              )}
            </button>
          </form>

          {/* Result panel */}
          <div className={`demo__result ${result ? 'visible' : ''} ${result ? result.tier.toLowerCase() : ''}`}>
            {result ? (
              <>
                <div className="demo__result-header">
                  <div className="demo__result-badge" style={{ color: risk.color, borderColor: risk.color, boxShadow: `0 0 16px ${risk.color}66` }}>
                    {risk.label}
                  </div>
                  <div className="demo__score-wrap">
                    <span style={{ color: risk.color }}>{result.score}</span>
                    <span>/100</span>
                  </div>
                </div>

                <div className="demo__bar-track">
                  <div
                    className="demo__bar-fill"
                    style={{ width: `${risk.bar}%`, background: risk.color, boxShadow: `0 0 14px ${risk.color}` }}
                  />
                </div>

                <div className="demo__reasons-label">Signal Breakdown</div>
                <div className="demo__reasons">
                  {result.reasons.map((r, i) => (
                    <div key={i} className="demo__reason">
                      <span className="demo__reason-signal">{r.signal}</span>
                      <span className="demo__reason-risk"
                        style={{ color: r.risk === 'HIGH' ? '#ff3232' : r.risk === 'MEDIUM' ? '#ffcc00' : '#00ff41' }}>
                        {r.risk}
                      </span>
                      <span className="demo__reason-weight">{r.weight}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="demo__placeholder">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="rgba(0,255,65,0.3)" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="20"/>
                  <path d="M24 14v10l6 3"/>
                </svg>
                <p>Your fraud analysis will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
