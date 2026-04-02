import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_GROUPS = [
  {
    section: 'Main',
    items: [
      {
        label: 'Overview', to: '/dashboard/overview',
        icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2"/><rect x="10" y="1.5" width="5.5" height="5.5" rx="1.2"/><rect x="1.5" y="10" width="5.5" height="5.5" rx="1.2"/><rect x="10" y="10" width="5.5" height="5.5" rx="1.2"/></svg>,
      },
      {
        label: 'Transactions', to: '/dashboard/transactions',
        icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="13" height="10" rx="1.5"/><path d="M5 5V4a3.5 3.5 0 017 0v1"/><path d="M8.5 9v3"/></svg>,
      },
      {
        label: 'User Records', to: '/dashboard/user-records',
        icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5.2" cy="6" r="2.2"/><circle cx="11.8" cy="6" r="2.2"/><path d="M1.8 14c.6-2 2.1-3.1 4-3.1h0c1.9 0 3.4 1.1 4 3.1"/><path d="M7.2 14c.5-1.8 1.8-2.8 3.4-2.8h0c1.6 0 2.9 1 3.4 2.8"/></svg>,
      },
      {
        label: 'Alerts', to: '/dashboard/alerts',
        icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8.5 2L2 13.5h13L8.5 2z"/><path d="M8.5 7v3"/><circle cx="8.5" cy="11.5" r=".7" fill="currentColor" stroke="none"/></svg>,
        badge: '3',
      },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      {
        label: 'ML Model', to: '/dashboard/ml-model',
        icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8.5" cy="8.5" r="6.5"/><path d="M8.5 5.5v3l2.5 1.5"/><circle cx="8.5" cy="5.5" r="1" fill="currentColor" stroke="none"/></svg>,
      },
    ],
  },
  {
    section: 'System',
    items: [
      {
        label: 'Settings', to: '/dashboard/settings',
        icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8.5" cy="8.5" r="2.5"/><path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3.1 3.1l1.4 1.4M12.1 12.1l1.4 1.4M3.1 13.9l1.4-1.4M12.1 4.9l1.4-1.4"/></svg>,
      },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="db-sidebar">
      {/* Brand block: logo is not clickable to avoid accidental logout/navigation */}
      <div className="db-sidebar__logo" role="img" aria-label="UPI Guard logo">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <polygon points="13,1.5 24.5,7.5 24.5,18.5 13,24.5 1.5,18.5 1.5,7.5"
            stroke="#00ff41" strokeWidth="1.4" fill="none"/>
          <polygon points="13,5.5 21,9.5 21,16.5 13,20.5 5,16.5 5,9.5"
            stroke="#00ff41" strokeWidth="0.7" fill="rgba(0,255,65,0.05)"/>
          <circle cx="13" cy="13" r="3" fill="#00ff41"/>
        </svg>
        <span>UPI<em>Guard</em></span>
      </div>

      {/* Live status pill */}
      <div className="db-sidebar__status">
        <span className="db-sidebar__status-dot" />
        <span>Model Live · 99.3% acc</span>
      </div>

      <nav className="db-nav">
        {NAV_GROUPS.map(group => (
          <React.Fragment key={group.section}>
            <div className="db-nav__section">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `db-nav__item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && <span className="db-nav__badge">{item.badge}</span>}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="db-sidebar__footer">
        {/* Bottom user block */}
        <div className="db-sidebar__user">
          <div className="db-sidebar__avatar">AD</div>
          <div className="db-sidebar__user-info">
            <div className="db-sidebar__user-name">Admin User</div>
            <div className="db-sidebar__user-role">Fraud Analyst</div>
          </div>
        </div>

        <button
          type="button"
          className="db-sidebar__logout"
          onClick={() => navigate('/')}
        >
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
