import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantDashboard from './components/RestaurantDashboard';
import MenuManagement from './components/MenuManagement';
import OrderManagement from './components/OrderManagement';
import RestaurantProfile from './components/RestaurantProfile';

const RestaurantModule = () => {
  return (
    <div>
      <RestaurantHeader />
      
      <Routes>
        <Route path="/" element={<RestaurantDashboard />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/profile" element={<RestaurantProfile />} />
      </Routes>
    </div>
  );
};

export default RestaurantModule;