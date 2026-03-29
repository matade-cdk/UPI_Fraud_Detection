import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__top-line" />
    <div className="container footer__inner">

      {/* Brand */}
      <div className="footer__brand">
        <div className="footer__logo">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <polygon points="13,1.5 24.5,7.5 24.5,18.5 13,24.5 1.5,18.5 1.5,7.5"
              stroke="#00ff41" strokeWidth="1.4" fill="none"/>
            <circle cx="13" cy="13" r="3" fill="#00ff41"/>
          </svg>
          <span>UPI<em>Guard</em></span>
        </div>
        <p className="footer__tagline">
          AI-powered fraud detection for<br />
          the Indian digital payments ecosystem.
        </p>
        <div className="footer__status">
          <span className="footer__status-dot" />
          All systems operational
        </div>
      </div>

      {/* Links */}
      <div className="footer__cols">
        <div className="footer__col">
          <div className="footer__col-title">Product</div>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#demo">Live Demo</a>
          <a href="#stats">Statistics</a>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Technology</div>
          <a href="#tech">ML Pipeline</a>
          <a href="#tech">XGBoost Model</a>
          <a href="#tech">API Reference</a>
          <a href="#tech">Integrations</a>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Compliance</div>
          <a href="#compliance">RBI Guidelines</a>
          <a href="#compliance">NPCI Standards</a>
          <a href="#compliance">ISO 27001</a>
          <a href="#compliance">PCI-DSS</a>
        </div>
      </div>
    </div>

    <div className="footer__bottom">
      <div className="container footer__bottom-inner">
        <span className="footer__copy">© 2025 UPIGuard. Built with ML &amp; React.</span>
        <div className="footer__bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
