import React from 'react';
import OverviewCards from '../components/OverviewCards';
import TransactionTable from '../components/TransactionTable';
import AlertsFeed from '../components/AlertsFeed';

const Overview = () => (
  <div className="db-page">
    <OverviewCards />
    <div className="db-two-col">
      <TransactionTable />
      <AlertsFeed />
    </div>
  </div>
);

export default Overview;
