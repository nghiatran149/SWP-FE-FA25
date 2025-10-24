import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// SC (Service Center)
import WarrantyClaims from './pages/sc/WarrantyClaims';
import TechnicianTasks from './pages/sc/TechnicianTasks';
import ServiceCampaigns from './pages/sc/ServiceCampaigns';
import CustomerManagement from './pages/sc/CustomerManagement';
import VehicleManagement from './pages/sc/VehicleManagement';
import TechnicianManagement from './pages/sc/TechnicianManagement';
import ServiceRecord from './pages/sc/ServiceRecord';
import AvailablePartManagement from './pages/sc/AvailablePartManagement';

// EVM (Electric Vehicle Manufacturer)
import WarrantyApproval from './pages/evm/WarrantyApproval';
import PartWarehouseManagement from './pages/evm/PartWarehouseManagement';
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
              <Route path="/" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'EVM_STAFF', 'SC_STAFF', 'SC_TECHNICIAN']}>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/supply-chain" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <SupplyChain />
                </ProtectedRoute>
              } />
              <Route path="/parts" element={
                <ProtectedRoute allowedRoles={['EVM_STAFF']}>
                  <PartWarehouseManagement />
                </ProtectedRoute>
              } />
              <Route path="/warranty-approval" element={
                <ProtectedRoute allowedRoles={['EVM_STAFF']}>
                  <WarrantyApproval />
                </ProtectedRoute>
              } />
              <Route path="/customers" element={
                <ProtectedRoute allowedRoles={['SC_STAFF']}>
                  <CustomerManagement />
                </ProtectedRoute>
              } />
              <Route path="/service-campaigns" element={
                <ProtectedRoute allowedRoles={['SC_STAFF']}>
                  <ServiceCampaigns />
                </ProtectedRoute>
              } />
              <Route path="/technicians" element={
                <ProtectedRoute allowedRoles={['SC_STAFF']}>
                  <TechnicianManagement />
                </ProtectedRoute>
              } />
              <Route path="/vehicles" element={
                <ProtectedRoute allowedRoles={['SC_STAFF']}>
                  <VehicleManagement />
                </ProtectedRoute>
              } />
              <Route path="/warranty-claims" element={
                <ProtectedRoute allowedRoles={['SC_STAFF']}>
                  <WarrantyClaims />
                </ProtectedRoute>
              } />
              <Route path="/technician-tasks" element={
                <ProtectedRoute allowedRoles={['SC_TECHNICIAN']}>
                  <TechnicianTasks />
                </ProtectedRoute>
              } />
              <Route path="/service-records" element={
                <ProtectedRoute allowedRoles={['SC_STAFF']}>
                  <ServiceRecord />
                </ProtectedRoute>
              } />
              <Route path="/available-parts" element={
                <ProtectedRoute allowedRoles={['SC_STAFF']}>
                  <AvailablePartManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
