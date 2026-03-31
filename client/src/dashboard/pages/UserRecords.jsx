import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
}

function percentOf(part, total) {
  if (!total) {
    return 0;
  }
  return Math.round((part / total) * 100);
}

const UserRecords = () => {
  const [adminEmail, setAdminEmail] = useState('admin@upiguard.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [token, setToken] = useState('');

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [summary, setSummary] = useState(null);

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState('');

  async function handleAdminLogin() {
    setLoadingAuth(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Admin login failed');
      }

      if (data?.user?.role !== 'admin') {
        throw new Error('Logged in user is not admin. Please use admin account.');
      }

      setToken(data.accessToken || '');
    } catch (err) {
      setError(err.message || 'Unable to login as admin');
      setToken('');
    } finally {
      setLoadingAuth(false);
    }
  }

  async function fetchUsers(authToken) {
    setLoadingUsers(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/users?page=1&limit=100`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch users');
      }

      const fetchedUsers = Array.isArray(data?.items) ? data.items : [];
      setUsers(fetchedUsers);

      if (fetchedUsers.length) {
        setSelectedUserId((current) => current || fetchedUsers[0].userId);
      } else {
        setSelectedUserId('');
        setSummary(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      setUsers([]);
      setSelectedUserId('');
      setSummary(null);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function fetchSummary(authToken, publicUserId) {
    if (!publicUserId) {
      setSummary(null);
      return;
    }

    setLoadingSummary(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${publicUserId}/summary`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch user summary');
      }

      setSummary(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user summary');
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchUsers(token);
  }, [token]);

  useEffect(() => {
    if (!token || !selectedUserId) {
      return;
    }

    fetchSummary(token, selectedUserId);
  }, [token, selectedUserId]);

  const chartStats = useMemo(() => {
    const txns = summary?.recentTransactions || [];
    const fraudMoney = txns
      .filter((txn) => txn.status === 'flagged' || txn.status === 'blocked')
      .reduce((acc, txn) => acc + Number(txn.amount || 0), 0);

    const safeMoney = txns
      .filter((txn) => txn.status === 'success')
      .reduce((acc, txn) => acc + Number(txn.amount || 0), 0);

    const totalMoney = fraudMoney + safeMoney;

    const fraudCount = txns.filter((txn) => txn.status === 'flagged' || txn.status === 'blocked').length;
    const safeCount = txns.filter((txn) => txn.status === 'success').length;

    return {
      fraudMoney,
      safeMoney,
      totalMoney,
      fraudCount,
      safeCount,
      fraudPct: percentOf(fraudMoney, totalMoney),
      safePct: percentOf(safeMoney, totalMoney),
    };
  }, [summary]);

  return (
    <div className="db-page user-records-page">
      <div className="db-card user-records-auth">
        <div className="db-card__label">Admin Access</div>
        <div className="user-records-auth__row">
          <input
            className="user-records-input"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="Admin email"
          />
          <input
            className="user-records-input"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Admin password"
          />
          <button
            className="user-records-btn"
            onClick={handleAdminLogin}
            disabled={loadingAuth}
            type="button"
          >
            {loadingAuth ? 'Signing in...' : 'Load Records'}
          </button>
        </div>
        {error ? <div className="user-records-error">{error}</div> : null}
      </div>

      <div className="user-records-grid">
        <div className="db-table-wrap user-records-users">
          <div className="db-table-header">
            <span className="db-table-title">Users</span>
            <span className="db-table-live">{loadingUsers ? 'LOADING' : `${users.length} USERS`}</span>
          </div>
          <div className="user-records-list">
            {users.map((user) => (
              <button
                key={user.userId}
                type="button"
                className={`user-row ${selectedUserId === user.userId ? 'active' : ''}`}
                onClick={() => setSelectedUserId(user.userId)}
              >
                <div className="user-row__name">{user.username}</div>
                <div className="user-row__meta">{user.email}</div>
                <div className="user-row__meta">{user.userId}</div>
              </button>
            ))}
            {!users.length && !loadingUsers ? <div className="user-records-empty">No users found.</div> : null}
          </div>
        </div>

        <div className="user-records-right">
          <div className="db-card user-summary-card">
            <div className="db-card__label">Selected User</div>
            <div className="user-summary-title">{summary?.user?.username || 'Select a user'}</div>
            <div className="user-summary-meta">{summary?.user?.email || '-'}</div>
            <div className="user-summary-meta">{summary?.user?.userId || '-'}</div>

            <div className="user-kpi-row">
              <div className="user-kpi">
                <span>Total Txns</span>
                <strong>{summary?.summary?.totalTransactions ?? 0}</strong>
              </div>
              <div className="user-kpi">
                <span>Flagged</span>
                <strong>{summary?.summary?.flaggedTransactions ?? 0}</strong>
              </div>
              <div className="user-kpi">
                <span>Blocked</span>
                <strong>{summary?.summary?.blockedTransactions ?? 0}</strong>
              </div>
              <div className="user-kpi">
                <span>Total Amount</span>
                <strong>{formatCurrency(summary?.summary?.totalAmount || 0)}</strong>
              </div>
            </div>
          </div>

          <div className="db-card user-chart-card">
            <div className="db-card__label">Fraud Money Analytics</div>
            <div className="money-chart">
              <div className="money-chart__row">
                <span>Fraud Money</span>
                <span>{formatCurrency(chartStats.fraudMoney)} ({chartStats.fraudPct}%)</span>
              </div>
              <div className="money-chart__track">
                <div className="money-chart__fill fraud" style={{ width: `${chartStats.fraudPct}%` }} />
              </div>

              <div className="money-chart__row">
                <span>Safe Money</span>
                <span>{formatCurrency(chartStats.safeMoney)} ({chartStats.safePct}%)</span>
              </div>
              <div className="money-chart__track">
                <div className="money-chart__fill safe" style={{ width: `${chartStats.safePct}%` }} />
              </div>
            </div>
          </div>

          <div className="db-table-wrap user-txns">
            <div className="db-table-header">
              <span className="db-table-title">User Transactions</span>
              <span className="db-table-live">{loadingSummary ? 'LOADING' : `${(summary?.recentTransactions || []).length} ITEMS`}</span>
            </div>
            <table className="db-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Merchant Category</th>
                  <th>Device ID</th>
                  <th>Fraud Label</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {(summary?.recentTransactions || []).map((txn) => (
                  <tr key={txn.id}>
                    <td className="db-table__txn-id">{txn.id}</td>
                    <td>{txn.receiverName}</td>
                    <td className="db-table__amount">{formatCurrency(txn.amount)}</td>
                    <td>{txn.merchantCategory || '-'}</td>
                    <td>{txn.deviceId || '-'}</td>
                    <td>{txn.fraudLabel || '-'}</td>
                    <td>
                      <span className={`db-badge db-badge--${txn.status === 'success' ? 'low' : txn.status === 'flagged' ? 'medium' : 'high'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="db-table__time">{new Date(txn.time).toLocaleString()}</td>
                  </tr>
                ))}
                {!loadingSummary && !(summary?.recentTransactions || []).length ? (
                  <tr>
                    <td colSpan="8" className="user-records-empty">No transactions for this user.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRecords;
