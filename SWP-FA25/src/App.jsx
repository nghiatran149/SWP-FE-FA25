import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// SC (Service Center)
import WarrantyClaims from './pages/sc/WarrantyClaims';
import TechnicianTasks from './pages/sc/TechnicianTasks';
import ServiceCampaigns from './pages/sc/ServiceCampaigns';
import CustomerManagement from './pages/sc/CustomerManagement';
import VehicleManagement from './pages/sc/VehicleManagement';
import TechnicianManagement from './pages/sc/TechnicianManagement';

// EVM (Electric Vehicle Manufacturer)
import WarrantyApproval from './pages/evm/WarrantyApproval';
import PartManagement from './pages/evm/PartManagement';
import SupplyChain from './pages/evm/SupplyChain';
import Reports from './pages/evm/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/warranty-claims" element={<WarrantyClaims />} />
              <Route path="/technician-tasks" element={<TechnicianTasks />} />
              <Route path="/warranty-approval" element={<WarrantyApproval />} />
              <Route path="/service-campaigns" element={<ServiceCampaigns />} />
              <Route path="/parts" element={<PartManagement />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/vehicles" element={<VehicleManagement />} />
              <Route path="/technicians" element={<TechnicianManagement />} />
              <Route path="/supply-chain" element={<SupplyChain />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
