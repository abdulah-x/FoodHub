import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../../services/api';
import Card from '../../../Components/UI/Card';
import classes from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    activeRestaurants: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In real app, these would be separate API calls
      // For demo, using static data
      setStats({
        totalUsers: 156,
        totalRestaurants: 23,
        totalOrders: 1284,
        totalRevenue: 45672.50,
        todayOrders: 47,
        activeRestaurants: 18
      });

      setRecentActivity([
        {
          id: 1,
          type: 'order',
          message: 'New order placed by John Doe',
          timestamp: new Date().toISOString(),
          status: 'new'
        },
        {
          id: 2,
          type: 'restaurant',
          message: 'Pizza Palace registered as new restaurant',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          id: 3,
          type: 'user',
          message: 'Jane Smith registered as customer',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 4,
          type: 'order',
          message: 'Order #1234 completed successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return '🛒';
      case 'restaurant': return '🏪';
      case 'user': return '👤';
      default: return '📊';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#ff9500';
      case 'pending': return '#ffc107';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className={classes.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={classes.container}>
      <h1>Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className={classes.statsGrid}>
        <Card className={classes.statCard}>
          <div className={classes.statIcon}>👥</div>
          <div className={classes.statInfo}>
            <div className={classes.statNumber}>{stats.totalUsers}</div>
            <div className={classes.statLabel}>Total Users</div>
          </div>
        </Card>

        <Card className={classes.statCard}>
          <div className={classes.statIcon}>🏪</div>
          <div className={classes.statInfo}>
            <div className={classes.statNumber}>{stats.totalRestaurants}</div>
            <div className={classes.statLabel}>Restaurants</div>
            <div className={classes.statSubtext}>{stats.activeRestaurants} active</div>
          </div>
        </Card>

        <Card className={classes.statCard}>
          <div className={classes.statIcon}>📦</div>
          <div className={classes.statInfo}>
            <div className={classes.statNumber}>{stats.totalOrders}</div>
            <div className={classes.statLabel}>Total Orders</div>
            <div className={classes.statSubtext}>{stats.todayOrders} today</div>
          </div>
        </Card>

        <Card className={classes.statCard}>
          <div className={classes.statIcon}>💰</div>
          <div className={classes.statInfo}>
            <div className={classes.statNumber}>${stats.totalRevenue.toLocaleString()}</div>
            <div className={classes.statLabel}>Total Revenue</div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className={classes.activitySection}>
        <h2>Recent Activity</h2>
        <Card className={classes.activityCard}>
          {recentActivity.length === 0 ? (
            <p className={classes.noActivity}>No recent activity</p>
          ) : (
            <div className={classes.activityList}>
              {recentActivity.map(activity => (
                <div key={activity.id} className={classes.activityItem}>
                  <div className={classes.activityIcon}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className={classes.activityContent}>
                    <p className={classes.activityMessage}>{activity.message}</p>
                    <span className={classes.activityTime}>
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                  <span 
                    className={classes.activityStatus}
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className={classes.quickActions}>
        <h2>Quick Actions</h2>
        <div className={classes.actionGrid}>
          <Card className={classes.actionCard}>
            <h3>User Management</h3>
            <p>View and manage all users</p>
            <button className={classes.actionBtn}>Manage Users</button>
          </Card>
          
          <Card className={classes.actionCard}>
            <h3>Restaurant Approval</h3>
            <p>Review pending restaurant applications</p>
            <button className={classes.actionBtn}>Review Applications</button>
          </Card>
          
          <Card className={classes.actionCard}>
            <h3>System Reports</h3>
            <p>Generate platform analytics</p>
            <button className={classes.actionBtn}>View Reports</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;