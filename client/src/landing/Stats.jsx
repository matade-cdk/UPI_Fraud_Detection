import React, { useEffect, useRef, useState } from 'react';
import './Stats.css';

const STATS = [
  { value: 99.3, suffix: '%', label: 'Detection Accuracy', decimals: 1 },
  { value: 200,  suffix: 'ms', label: 'Avg. Response Time', decimals: 0 },
  { value: 2.8,  suffix: 'M+', label: 'Transactions Protected', decimals: 1 },
  { value: 0.1,  suffix: '%', label: 'False Positive Rate', decimals: 1 },
  { value: 47,   suffix: '+', label: 'ML Features Analysed', decimals: 0 },
  { value: 24,   suffix: '/7', label: 'Monitoring Uptime', decimals: 0 },
];

const useCounter = (target, decimals, active) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 20);
    return () => clearInterval(timer);
  }, [active, target]);
  return val.toFixed(decimals);
};

const StatCard = ({ value, suffix, label, decimals, active }) => {
  const count = useCounter(value, decimals, active);
  return (
    <div className="stat-card">
      <div className="stat-card__glow" />
      <div className="stat-card__value">
        {count}<span className="stat-card__suffix">{suffix}</span>
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
};

const Stats = () => {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" className="stats-section" ref={ref}>
      <div className="stats-section__glow-orb" aria-hidden="true" />
      <div className="container">
        <div className="stats-section__header">
          <div className="tag-line">By The Numbers</div>
          <h2 className="sec-title">Performance that <span>speaks</span></h2>
        </div>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} active={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
