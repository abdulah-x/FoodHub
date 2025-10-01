import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import HeaderButton from '../../../Components/Header/HeaderButton';
import classes from './CustomerHeader.module.css';

const CustomerHeader = ({ onShowCart }) => {
  const { currentUser, logout } = useUser();

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <h1>ReactMeals - Customer</h1>
        
        <nav className={classes.nav}>
          <Link to="/" className={classes.navLink}>Restaurants</Link>
          <Link to="/orders" className={classes.navLink}>My Orders</Link>
        </nav>
        
        <div className={classes.headerActions}>
          <span className={classes.welcome}>Welcome, {currentUser?.name}!</span>
          <HeaderButton onClick={onShowCart}>Cart</HeaderButton>
          <button onClick={logout} className={classes.logoutBtn}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;