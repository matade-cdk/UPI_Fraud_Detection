import React from 'react';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'CFO, TechPay Solutions',
    quote: 'UPIGuard caught a ₹2.4L fraudulent transfer that bypassed our bank\'s own filters. The SHAP explanations gave us full confidence in the decision.',
    rating: 5,
  },
  {
    name: 'Rahul Mehra',
    role: 'Security Lead, FinoBank',
    quote: 'We integrated the API in one afternoon. The false positive rate is genuinely impressive — our operations team hasn\'t had to review a single mis-flag in weeks.',
    rating: 5,
  },
  {
    name: 'Ananya Iyer',
    role: 'Product Manager, QuickPe',
    quote: 'Real-time alerts saved three of our enterprise clients last month. The dashboard is clean, data-rich and our compliance team loves the audit trail.',
    rating: 5,
  },
];

const Stars = ({ n }) => (
  <div className="stars">
    {Array(n).fill(0).map((_, i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#00ff41">
        <path d="M6 1l1.4 3H11L8.3 6.2l1 3.1L6 7.5l-3.3 1.8 1-3.1L1 4h3.6z"/>
      </svg>
    ))}
  </div>
);

const Testimonials = () => (
  <section id="testimonials" className="testimonials">
    <div className="container">
      <div className="testimonials__header">
        <div className="tag-line">Testimonials</div>
        <h2 className="sec-title">Trusted by <span>fintech leaders</span></h2>
      </div>
      <div className="testimonials__grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="tcard">
            <div className="tcard__glow" />
            <Stars n={t.rating} />
            <p className="tcard__quote">"{t.quote}"</p>
            <div className="tcard__author">
              <div className="tcard__avatar">
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="tcard__name">{t.name}</div>
                <div className="tcard__role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
