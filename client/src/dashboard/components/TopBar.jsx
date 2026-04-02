import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard/overview':     { title: 'Overview', sub: 'System health at a glance' },
  '/dashboard/analytics':    { title: 'Analytics', sub: 'Trends, patterns & charts' },
  '/dashboard/transactions': { title: 'Transactions', sub: 'Full transaction ledger' },
  '/dashboard/alerts':       { title: 'Fraud Alerts', sub: 'Active flags & incidents' },
  '/dashboard/ml-model':     { title: 'ML Model', sub: 'Model health & performance' },
  '/dashboard/settings':     { title: 'Settings', sub: 'Configuration & API keys' },
};

const TopBar = () => {
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: 'Dashboard', sub: '' };

  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <header className="db-topbar">
      <div>
        <div className="db-topbar__title">{page.title}</div>
        <div className="db-topbar__sub">{page.sub}</div>
      </div>
      <div className="db-topbar__right">
        <div className="db-topbar__time">{now}</div>
        <div className="db-topbar__status">
          <span className="db-topbar__dot" />
          Model Active
        </div>
      </div>
    </header>
  );
};

export default TopBar;
