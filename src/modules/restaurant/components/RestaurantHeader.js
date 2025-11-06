import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import NotificationCenter from '../../../Components/Notifications/NotificationCenter';
import classes from './RestaurantHeader.module.css';

const RestaurantHeader = () => {
  const { currentUser, logout } = useUser();
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path ? classes.activeLink : '';
  };

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <h1>FoodHub - Restaurant</h1>
        
        <nav className={classes.nav}>
          <Link to="/" className={`${classes.navLink} ${isActiveLink('/')}`}>
            Dashboard
          </Link>
          <Link to="/menu" className={`${classes.navLink} ${isActiveLink('/menu')}`}>
            Menu Management
          </Link>
          <Link to="/orders" className={`${classes.navLink} ${isActiveLink('/orders')}`}>
            Orders
          </Link>
          <Link to="/profile" className={`${classes.navLink} ${isActiveLink('/profile')}`}>
            Profile
          </Link>
        </nav>
        
        <div className={classes.headerActions}>
          <span className={classes.welcome}>Welcome, {currentUser?.name}!</span>
          <NotificationCenter />
          <button onClick={logout} className={classes.logoutBtn}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default RestaurantHeader;