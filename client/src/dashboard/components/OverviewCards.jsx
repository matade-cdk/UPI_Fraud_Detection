import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function pctChange(current, previous) {
  if (!previous) {
    return current ? '+100.0%' : '0.0%';
  }
  const value = ((current - previous) / previous) * 100;
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

const OverviewCards = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/transactions/public?page=1&limit=500`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch overview metrics');
        }

        if (mounted) {
          setItems(Array.isArray(data?.items) ? data.items : []);
          setError('');
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch overview metrics');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    const pollId = setInterval(load, 15000);

    return () => {
      mounted = false;
      clearInterval(pollId);
    };
  }, []);

  const cards = useMemo(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const currentWindow = items.filter((txn) => {
      const ts = new Date(txn.time).getTime();
      return Number.isFinite(ts) && now - ts <= oneDayMs;
    });

    const prevWindow = items.filter((txn) => {
      const ts = new Date(txn.time).getTime();
      return Number.isFinite(ts) && now - ts > oneDayMs && now - ts <= oneDayMs * 2;
    });

    const fraudStatuses = new Set(['flagged', 'blocked']);
    const fraudCount = items.filter((txn) => fraudStatuses.has(String(txn.status || '').toLowerCase())).length;
    const flaggedCount = items.filter((txn) => String(txn.status || '').toLowerCase() === 'flagged').length;

    const currentTotal = currentWindow.length;
    const prevTotal = prevWindow.length;

    const currentFraud = currentWindow.filter((txn) => fraudStatuses.has(String(txn.status || '').toLowerCase())).length;
    const prevFraud = prevWindow.filter((txn) => fraudStatuses.has(String(txn.status || '').toLowerCase())).length;

    const safeRate = items.length ? (((items.length - fraudCount) / items.length) * 100).toFixed(1) : '100.0';

    return [
      {
        label: 'Total Transactions',
        value: loading ? '...' : items.length.toLocaleString('en-IN'),
        trend: error ? error : `${pctChange(currentTotal, prevTotal)} vs yesterday`,
        dir: error ? '' : currentTotal >= prevTotal ? 'up' : 'down',
        color: '',
      },
      {
        label: 'Fraud Detected',
        value: loading ? '...' : fraudCount.toLocaleString('en-IN'),
        trend: error ? 'Live data unavailable' : `${pctChange(currentFraud, prevFraud)} vs yesterday`,
        dir: error ? '' : currentFraud >= prevFraud ? 'up' : 'down',
        color: 'red',
      },
      {
        label: 'Flagged / Review',
        value: loading ? '...' : flaggedCount.toLocaleString('en-IN'),
        trend: error ? 'Live data unavailable' : `${currentWindow.filter((txn) => String(txn.status || '').toLowerCase() === 'flagged').length} in last 24h`,
        dir: '',
        color: 'amber',
      },
      {
        label: 'Safety Rate',
        value: loading ? '...' : `${safeRate}%`,
        trend: 'Computed from live transactions',
        dir: '',
        color: '',
      },
    ];
  }, [items, loading, error]);

  return (
    <div className="db-cards">
      {cards.map((c) => (
        <div key={c.label} className="db-card">
          <div className="db-card__label">{c.label}</div>
          <div className={`db-card__value ${c.color}`}>{c.value}</div>
          <div className={`db-card__trend ${c.dir}`}>{c.trend}</div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
