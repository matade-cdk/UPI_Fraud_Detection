import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
import UserRecords from './pages/UserRecords';
import Alerts from './pages/Alerts';
import MLModel from './pages/MLModel';
import Settings from './pages/Settings';
import '../landing/landing.css';
import './dashboard.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="db-main">
        <TopBar />
        <div className="db-content">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="user-records" element={<UserRecords />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="ml-model" element={<MLModel />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
