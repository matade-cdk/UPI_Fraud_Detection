import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const riskClass = (r) => (r === 'HIGH' ? 'high' : r === 'MEDIUM' ? 'medium' : 'low');

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
}

function toRisk(item) {
  const status = String(item.status || '').toLowerCase();
  const score = Number(item.score || 0);
  if (status === 'blocked' || status === 'flagged') {
    return 'HIGH';
  }
  if (score >= 70) {
    return 'MEDIUM';
  }
  return 'LOW';
}

const TransactionTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadTransactions() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/transactions/public?page=1&limit=200`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch transactions');
        }

        if (mounted) {
          setRows(Array.isArray(data?.items) ? data.items : []);
          setError('');
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch transactions');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTransactions();
    const pollId = setInterval(loadTransactions, 15000);

    return () => {
      mounted = false;
      clearInterval(pollId);
    };
  }, []);

  const mappedRows = useMemo(() => {
    return rows.map((item) => {
      const risk = toRisk(item);
      return {
        id: item.id,
        upi: item.upiRecipient || item.receiverName || 'unknown@upi',
        amount: formatCurrency(item.amount),
        time: item.time ? new Date(item.time).toLocaleString() : '-',
        risk,
        score: Math.round(Number(item.score || 0)),
        isFraud: String(item.status || '').toLowerCase() === 'blocked' || String(item.status || '').toLowerCase() === 'flagged',
      };
    });
  }, [rows]);

  return (
    <div className="db-table-wrap">
      <div className="db-table-header">
        <span className="db-table-title">All User Transactions</span>
        <span className="db-table-live">{loading ? 'LOADING' : `${mappedRows.length} ITEMS`}</span>
      </div>
      <table className="db-table">
        <thead>
          <tr>
            <th>TXN ID</th>
            <th>UPI Recipient</th>
            <th>Amount</th>
            <th>Time</th>
            <th>Risk</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan="6">{error}</td>
            </tr>
          ) : null}

          {!error && !loading && !mappedRows.length ? (
            <tr>
              <td colSpan="6">No transactions found.</td>
            </tr>
          ) : null}

          {mappedRows.map((t) => (
            <tr key={t.id} style={t.isFraud ? { backgroundColor: 'rgba(255,50,50,0.08)' } : undefined}>
              <td className="db-table__txn-id">{t.id}</td>
              <td>{t.upi}</td>
              <td className="db-table__amount" style={t.isFraud ? { color: '#ff5b5b' } : undefined}>{t.amount}</td>
              <td className="db-table__time">{t.time}</td>
              <td><span className={`db-badge db-badge--${riskClass(t.risk)}`}>{t.risk}</span></td>
              <td className={`db-table__score db-table__score--${riskClass(t.risk)}`}>
                {t.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
