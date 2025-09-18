import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WarrantyClaims from './pages/WarrantyClaims';
import ServiceCampaigns from './pages/ServiceCampaigns';
import PartManagement from './pages/PartManagement';
import Reports from './pages/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/warranty-claims" element={<WarrantyClaims />} />
          <Route path="/service-campaigns" element={<ServiceCampaigns />} />
          <Route path="/parts" element={<PartManagement />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
