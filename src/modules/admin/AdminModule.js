import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import RestaurantManagement from './components/RestaurantManagement';
import SystemAnalytics from './components/SystemAnalytics';

const AdminModule = () => {
  return (
    <div>
      <AdminHeader />
      
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/restaurants" element={<RestaurantManagement />} />
        <Route path="/analytics" element={<SystemAnalytics />} />
      </Routes>
    </div>
  );
};

export default AdminModule;