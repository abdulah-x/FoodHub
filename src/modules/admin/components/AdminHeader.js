import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import classes from './AdminHeader.module.css';

const AdminHeader = () => {
  const { currentUser, logout } = useUser();
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path ? classes.activeLink : '';
  };

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <h1>FoodHub - Admin</h1>
        
        <nav className={classes.nav}>
          <Link to="/" className={`${classes.navLink} ${isActiveLink('/')}`}>
            Dashboard
          </Link>
          <Link to="/users" className={`${classes.navLink} ${isActiveLink('/users')}`}>
            Users
          </Link>
          <Link to="/restaurants" className={`${classes.navLink} ${isActiveLink('/restaurants')}`}>
            Restaurants
          </Link>
          <Link to="/analytics" className={`${classes.navLink} ${isActiveLink('/analytics')}`}>
            Analytics
          </Link>
        </nav>
        
        <div className={classes.headerActions}>
          <span className={classes.welcome}>Admin: {currentUser?.name}</span>
          <button onClick={logout} className={classes.logoutBtn}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;