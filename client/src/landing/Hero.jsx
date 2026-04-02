import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const TYPED_STRINGS = [
  'UPI Transactions',
  'Payment Patterns',
  'Suspicious Activity',
  'Financial Threats',
];

const Hero = () => {
  const navigate = useNavigate();
  const [typed, setTyped] = useState('');
  const [strIdx, setStrIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPED_STRINGS[strIdx];
    const speed = deleting ? 45 : 80;
    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setTyped(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 1800);
      } else if (deleting && charIdx > 0) {
        setTyped(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setStrIdx(s => (s + 1) % TYPED_STRINGS.length);
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [typed, charIdx, deleting, strIdx]);

  return (
    <section id="hero" className="hero grid-bg">
      <div className="hero__scanlines" aria-hidden="true" />
      <div className="hero__corner hero__corner--tl" aria-hidden="true" />
      <div className="hero__corner hero__corner--tr" aria-hidden="true" />
      <div className="hero__corner hero__corner--bl" aria-hidden="true" />
      <div className="hero__corner hero__corner--br" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          AI-Powered Fraud Shield &nbsp;•&nbsp; Real-Time Detection
        </div>

        <h1 className="hero__heading">
          Detecting Fraudulent<br />
          <span className="hero__typed">
            {typed}<span className="hero__cursor" />
          </span>
        </h1>

        <p className="hero__sub">
          Our machine learning engine analyses over <strong>47 behavioural signals</strong> in
          every UPI transaction — flagging fraud in under <strong>200ms</strong> with
          99.3% accuracy.
        </p>

        <div className="hero__actions">
          <button
            className="btn-solid hero__cta-main"
            onClick={() => navigate('/dashboard')}
            id="get-started-btn"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.5 7.5l-4.5 3V5l4.5 3z"/>
            </svg>
            Get Started
          </button>
          <a href="#features" className="btn-outline">
            Learn More
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 7h10M8 3l4 4-4 4"/>
            </svg>
          </a>
        </div>

        <div className="hero__chips">
          {['99.3% Accuracy','< 200ms Latency','24/7 Monitoring','ISO 27001 Compliant'].map(t => (
            <div key={t} className="hero__chip">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="var(--green)">
                <path d="M5 0l1.2 3.7H9.5L6.7 5.9l1.2 3.7L5 7.5 2.1 9.6l1.2-3.7L0.5 3.7h3.3z"/>
              </svg>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Radar */}
      <div className="hero__radar" aria-hidden="true">
        <div className="radar__ring radar__ring--1" />
        <div className="radar__ring radar__ring--2" />
        <div className="radar__ring radar__ring--3" />
        <div className="radar__sweep" />
        <div className="radar__dot radar__dot--1" />
        <div className="radar__dot radar__dot--2" />
        <div className="radar__dot radar__dot--3" />
      </div>

      <div className="hero__scroll-cue">
        <span>Scroll to explore</span>
        <div className="hero__scroll-arrow" />
      </div>
    </section>
  );
};

export default Hero;
