import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function relativeTime(value) {
  const ts = new Date(value).getTime();
  if (!Number.isFinite(ts)) {
    return '-';
  }

  const diffMs = Date.now() - ts;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function alertText(item) {
  const amount = Number(item.amount || 0).toLocaleString('en-IN');
  const reason = item.reason ? ` - ${item.reason}` : '';
  return `Suspicious transaction Rs ${amount} to ${item.upiRecipient || item.receiverName || 'unknown'}${reason}`;
}

const AlertsFeed = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAlerts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/transactions/alerts?limit=12`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch alerts');
        }

        if (isMounted) {
          const items = Array.isArray(data?.items) ? data.items : [];
          setAlerts(items);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch alerts');
        }
      }
    }

    loadAlerts();
    const pollId = setInterval(loadAlerts, 15000);

    return () => {
      isMounted = false;
      clearInterval(pollId);
    };
  }, []);

  const rows = useMemo(() => {
    return alerts.map((item) => {
      const tier = item.status === 'blocked' ? 'high' : Number(item.score || 0) >= 70 ? 'high' : 'medium';
      return {
        id: item.id,
        tier,
        text: alertText(item),
        time: relativeTime(item.time),
      };
    });
  }, [alerts]);

  return (
    <div className="db-alerts">
      <div className="db-alerts__title">Real-Time Alerts</div>

      {error ? <div className="db-alert">{error}</div> : null}

      {!error && !rows.length ? <div className="db-alert">No fraud alerts detected.</div> : null}

      {rows.map((a) => (
        <div key={a.id} className="db-alert">
          <div className={`db-alert__dot db-alert__dot--${a.tier}`} />
          <div className="db-alert__text">{a.text}</div>
          <div className="db-alert__time">{a.time}</div>
        </div>
      ))}
    </div>
  );
};

export default AlertsFeed;
