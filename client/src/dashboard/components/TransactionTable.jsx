import React from 'react';

const TRANSACTIONS = [
  { id: 'TXN-9182', upi: 'raj@okhdfc', amount: '₹82,000', time: '03:14 AM', risk: 'HIGH',   score: 91 },
  { id: 'TXN-9181', upi: 'priya@ybl',  amount: '₹1,200',  time: '02:58 AM', risk: 'LOW',    score: 4  },
  { id: 'TXN-9180', upi: 'unknown@paytm',amount:'₹34,500',time: '02:41 AM', risk: 'MEDIUM', score: 58 },
  { id: 'TXN-9179', upi: 'shop@upi',   amount: '₹550',    time: '02:30 AM', risk: 'LOW',    score: 6  },
  { id: 'TXN-9178', upi: 'abc@okaxis', amount: '₹61,000', time: '01:55 AM', risk: 'HIGH',   score: 88 },
  { id: 'TXN-9177', upi: 'maya@icici', amount: '₹8,400',  time: '01:33 AM', risk: 'MEDIUM', score: 47 },
];

const riskClass = r => r === 'HIGH' ? 'high' : r === 'MEDIUM' ? 'medium' : 'low';

const TransactionTable = () => (
  <div className="db-table-wrap">
    <div className="db-table-header">
      <span className="db-table-title">Recent Transactions</span>
      <span className="db-table-live">
        LIVE FEED
      </span>
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
        {TRANSACTIONS.map((t, i) => (
          <tr key={i}>
            <td className="db-table__txn-id">{t.id}</td>
            <td>{t.upi}</td>
            <td className="db-table__amount">{t.amount}</td>
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

export default TransactionTable;
