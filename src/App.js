import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import CartProvider from './Components/store/CartContextProvider';
import Login from './Components/Login';
import CustomerModule from './modules/customer/CustomerModule';
import RestaurantModule from './modules/restaurant/RestaurantModule';
import AdminModule from './modules/admin/AdminModule';
import './App.css';

const AppRoutes = () => {
  const { currentUser, isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <CartProvider>
      <Routes>
        {currentUser?.role === 'customer' && (
          <Route path="/*" element={<CustomerModule />} />
        )}
        {currentUser?.role === 'restaurant' && (
          <Route path="/*" element={<RestaurantModule />} />
        )}
        {currentUser?.role === 'admin' && (
          <Route path="/*" element={<AdminModule />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
