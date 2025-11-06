import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import HeaderButton from '../../../Components/Header/HeaderButton';
import NotificationCenter from '../../../Components/Notifications/NotificationCenter';
import classes from './CustomerHeader.module.css';

const CustomerHeader = ({ onShowCart }) => {
  const { currentUser, logout } = useUser();

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <div className={classes.logo}>
          <h1>🍽️ FoodHub</h1>
          <p className={classes.tagline}>Delicious food, delivered fast</p>
        </div>
        
        <nav className={classes.nav}>
          <Link to="/" className={classes.navLink}>
            <span className={classes.navIcon}>🏪</span>
            Restaurants
          </Link>
          <Link to="/orders" className={classes.navLink}>
            <span className={classes.navIcon}>📋</span>
            My Orders
          </Link>
        </nav>
        
        <div className={classes.headerActions}>
          <div className={classes.userInfo}>
            <span className={classes.userIcon}>👋</span>
            <span className={classes.welcome}>Hi, {currentUser?.name?.split(' ')[0]}!</span>
          </div>
          <NotificationCenter />
          <HeaderButton onClick={onShowCart}>Cart</HeaderButton>
          <button onClick={logout} className={classes.logoutBtn}>
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;