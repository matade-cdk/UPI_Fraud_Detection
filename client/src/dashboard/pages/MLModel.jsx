import React, { useMemo, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function defaultForm() {
  const amount = 1200;
  const oldOrg = 2500;
  const oldDest = 5000;
  return {
    txnId: `TXN-${Date.now()}`,
    upiId: 'test@upi',
    step: '307',
    timestamp: new Date().toISOString().slice(0, 16),
    amount: String(amount),
    transactionType: 'TRANSFER',
    oldbalanceOrg: String(oldOrg),
    newbalanceOrig: String(oldOrg - amount),
    oldbalanceDest: String(oldDest),
    newbalanceDest: String(oldDest + amount),
  };
}

const MLModel = () => {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    return (
      form.txnId.trim() &&
      form.upiId.trim() &&
      Number(form.amount) > 0 &&
      Number.isFinite(Number(form.step)) &&
      Number.isFinite(Number(form.oldbalanceOrg)) &&
      Number.isFinite(Number(form.newbalanceOrig)) &&
      Number.isFinite(Number(form.oldbalanceDest)) &&
      Number.isFinite(Number(form.newbalanceDest))
    );
  }, [form]);

  const fraudChance = result ? Math.round(Number(result.riskScore || 0) * 100) : 0;
  const anomaly = Boolean(result?.anomaly);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit || loading) {
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      transactionId: form.txnId.trim(),
      upiRecipient: form.upiId.trim(),
      step: Number(form.step),
      amount: Number(form.amount),
      timestamp: new Date(form.timestamp || Date.now()).toISOString(),
      transactionType: form.transactionType,
      oldbalanceOrg: Number(form.oldbalanceOrg),
      newbalanceOrig: Number(form.newbalanceOrig),
      oldbalanceDest: Number(form.oldbalanceDest),
      newbalanceDest: Number(form.newbalanceDest),
      errorBalanceOrg: Number(form.amount) - (Number(form.oldbalanceOrg) - Number(form.newbalanceOrig)),
      errorBalanceDest: Number(form.amount) - (Number(form.newbalanceDest) - Number(form.oldbalanceDest)),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ml/predict-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Prediction failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="db-page" style={{ marginTop: '1.2rem' }}>
      <div className="db-alerts">
        <div className="db-alerts__title">Manual Fraud Check</div>

        <form className="db-cards" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', padding: 0 }} onSubmit={handleSubmit}>
          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">TXN ID</div>
            <input className="user-records-input" value={form.txnId} onChange={(e) => updateField('txnId', e.target.value)} />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">UPI ID</div>
            <input className="user-records-input" value={form.upiId} onChange={(e) => updateField('upiId', e.target.value)} />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">Step</div>
            <input className="user-records-input" value={form.step} onChange={(e) => updateField('step', e.target.value)} type="number" />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">Amount</div>
            <input className="user-records-input" value={form.amount} onChange={(e) => updateField('amount', e.target.value)} type="number" />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">Timestamp</div>
            <input className="user-records-input" value={form.timestamp} onChange={(e) => updateField('timestamp', e.target.value)} type="datetime-local" />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">Transaction Type</div>
            <select className="user-records-input" value={form.transactionType} onChange={(e) => updateField('transactionType', e.target.value)}>
              <option value="CASH_IN">CASH_IN</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="PAYMENT">PAYMENT</option>
              <option value="CASH_OUT">CASH_OUT</option>
              <option value="DEBIT">DEBIT</option>
            </select>
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">Old Balance Origin</div>
            <input className="user-records-input" value={form.oldbalanceOrg} onChange={(e) => updateField('oldbalanceOrg', e.target.value)} type="number" />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">New Balance Origin</div>
            <input className="user-records-input" value={form.newbalanceOrig} onChange={(e) => updateField('newbalanceOrig', e.target.value)} type="number" />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">Old Balance Destination</div>
            <input className="user-records-input" value={form.oldbalanceDest} onChange={(e) => updateField('oldbalanceDest', e.target.value)} type="number" />
          </div>

          <div className="db-card" style={{ padding: '1rem' }}>
            <div className="db-card__label">New Balance Destination</div>
            <input className="user-records-input" value={form.newbalanceDest} onChange={(e) => updateField('newbalanceDest', e.target.value)} type="number" />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button className="user-records-btn" type="submit" disabled={!canSubmit || loading}>
              {loading ? 'Analyzing...' : 'Check Fraud + Anomaly'}
            </button>
          </div>
        </form>

        {error ? <div className="user-records-error" style={{ marginTop: '1rem' }}>{error}</div> : null}
      </div>

      <div className="db-cards" style={{ padding: 0, marginTop: '1rem' }}>
        <div className="db-card">
          <div className="db-card__label">Fraud Chance</div>
          <div className={`db-card__value ${fraudChance >= 80 ? 'red' : fraudChance >= 50 ? 'amber' : ''}`}>{fraudChance}%</div>
          <div className="db-card__trend">Probability from live model output</div>
        </div>

        <div className="db-card">
          <div className="db-card__label">Anomaly</div>
          <div className={`db-card__value ${anomaly ? 'red' : ''}`}>{anomaly ? 'YES' : 'NO'}</div>
          <div className="db-card__trend">Dynamic anomaly signal</div>
        </div>

        <div className="db-card">
          <div className="db-card__label">Risk Level</div>
          <div className={`db-card__value ${result?.riskLevel === 'HIGH' ? 'red' : result?.riskLevel === 'MEDIUM' ? 'amber' : ''}`}>
            {result?.riskLevel || 'NA'}
          </div>
          <div className="db-card__trend">LOW / MEDIUM / HIGH</div>
        </div>

        <div className="db-card">
          <div className="db-card__label">Model Status</div>
          <div className="db-card__value">LIVE</div>
          <div className="db-card__trend">No hardcoded prediction data</div>
        </div>
      </div>

      <div className="db-table-wrap" style={{ marginTop: '1rem' }}>
        <div className="db-table-header">
          <span className="db-table-title">Static Analysis Summary</span>
          <span className="db-table-live">{result ? 'UPDATED' : 'WAITING INPUT'}</span>
        </div>
        <table className="db-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chance of Fraud</td>
              <td>{fraudChance}%</td>
            </tr>
            <tr>
              <td>Anomaly Detected</td>
              <td>{anomaly ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Risk Score</td>
              <td>{result ? Number(result.riskScore || 0).toFixed(4) : '0.0000'}</td>
            </tr>
            <tr>
              <td>Reason</td>
              <td>{Array.isArray(result?.reasons) && result.reasons.length ? result.reasons.join(', ') : 'No analysis yet.'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MLModel;
