import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerHeader from './components/CustomerHeader';
import RestaurantList from './components/RestaurantList';
import RestaurantMenu from './components/RestaurantMenu';
import OrderHistory from './components/OrderHistory';
import MyCart from '../../Components/Cart/MyCart';

const CustomerModule = () => {
  const [visibleCart, setCartVisible] = useState(false);

  const showCartHandler = () => {
    setCartVisible(true);
  };

  const hideCartHandler = () => {
    setCartVisible(false);
  };

  return (
    <div>
      {visibleCart && <MyCart onDrop={hideCartHandler} />}
      <CustomerHeader onShowCart={showCartHandler} />
      
      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </div>
  );
};

export default CustomerModule;