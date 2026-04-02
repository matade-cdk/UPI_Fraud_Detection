import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './landing/landing.css';

// Landing
import LandingPage from './landing/LandingPage';

// Dashboard
import DashboardLayout from './dashboard/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
