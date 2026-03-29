import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Live Demo', href: '#demo' },
    { label: 'Stats', href: '#stats' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <a href="#hero" className="nav-logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#00ff41" strokeWidth="1.5" fill="none"/>
              <polygon points="14,6 22,10 22,18 14,22 6,18 6,10" stroke="#00ff41" strokeWidth="1" fill="rgba(0,255,65,0.05)"/>
              <circle cx="14" cy="14" r="3" fill="#00ff41"/>
            </svg>
          </div>
          <span className="logo-text">UPI<span>Guard</span></span>
        </a>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="nav-cta">
          <a href="#demo" className="nav-cta-btn">
            <span className="btn-dot" />
            Scan Transaction
          </a>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <a key={link.label} href={link.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="#demo" className="btn-primary" style={{marginTop:'1rem'}} onClick={() => setMenuOpen(false)}>
          Scan Transaction
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
