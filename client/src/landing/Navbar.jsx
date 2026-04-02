import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Features',     href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
      <div className="lp-nav__inner container">

        <a href="/" className="lp-nav__logo">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <polygon points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5"
              stroke="#00ff41" strokeWidth="1.4" fill="none"/>
            <polygon points="15,7 23,11.5 23,18.5 15,23 7,18.5 7,11.5"
              stroke="#00ff41" strokeWidth="0.8" fill="rgba(0,255,65,0.06)"/>
            <circle cx="15" cy="15" r="3.5" fill="#00ff41"/>
          </svg>
          <span>UPI<em>Guard</em></span>
        </a>

        <ul className="lp-nav__links">
          {links.map(l => (
            <li key={l.label}><a href={l.href} className="lp-nav__link">{l.label}</a></li>
          ))}
        </ul>

        <button className="lp-nav__cta" onClick={() => navigate('/dashboard')} id="nav-get-started">
          <span className="lp-nav__dot" />
          Get Started
        </button>

        <button
          className={`lp-nav__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`lp-nav__drawer ${menuOpen ? 'open' : ''}`}>
        {links.map(l => (
          <a key={l.label} href={l.href} className="lp-nav__drawer-link"
             onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <button
          className="btn-solid"
          style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
          onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
