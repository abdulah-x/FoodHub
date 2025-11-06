import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../../services/api';
import { useUser } from '../../../contexts/UserContext';
import Card from '../../../Components/UI/Card';
import classes from './RestaurantDashboard.module.css';

const RestaurantDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, these would be separate API calls
      // For now, we'll use demo data
      setStats({
        todayOrders: 15,
        pendingOrders: 3,
        totalRevenue: 1250.50,
        avgOrderValue: 23.75
      });

      setRecentOrders([
        {
          _id: '1',
          customer: { name: 'John Doe', phone: '+1234567890' },
          items: [
            { menuItem: { name: 'Margherita Pizza' }, quantity: 1, price: 12.99 }
          ],
          totalAmount: 12.99,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          customer: { name: 'Jane Smith', phone: '+0987654321' },
          items: [
            { menuItem: { name: 'Caesar Salad' }, quantity: 2, price: 8.99 }
          ],
          totalAmount: 17.98,
          status: 'preparing',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      // Update local state
      setRecentOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9500';
      case 'confirmed': return '#007bff';
      case 'preparing': return '#ffc107';
      case 'ready': return '#17a2b8';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className={classes.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={classes.container}>
      <h1>Restaurant Dashboard</h1>

      {/* Stats Cards */}
      <div className={classes.statsGrid}>
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>{stats.todayOrders}</div>
          <div className={classes.statLabel}>Today's Orders</div>
        </Card>
        
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>{stats.pendingOrders}</div>
          <div className={classes.statLabel}>Pending Orders</div>
        </Card>
        
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>${stats.totalRevenue.toFixed(2)}</div>
          <div className={classes.statLabel}>Total Revenue</div>
        </Card>
        
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>${stats.avgOrderValue.toFixed(2)}</div>
          <div className={classes.statLabel}>Avg Order Value</div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className={classes.recentOrders}>
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <Card>
            <p className={classes.noOrders}>No recent orders</p>
          </Card>
        ) : (
          <div className={classes.ordersList}>
            {recentOrders.map(order => (
              <Card key={order._id} className={classes.orderCard}>
                <div className={classes.orderHeader}>
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p>{order.customer.name} - {order.customer.phone}</p>
                  </div>
                  <span 
                    className={classes.status}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className={classes.orderItems}>
                  {order.items.map((item, index) => (
                    <div key={index} className={classes.orderItem}>
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className={classes.orderFooter}>
                  <div className={classes.orderTotal}>
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                  
                  <div className={classes.orderActions}>
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                        className={classes.confirmBtn}
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'preparing')}
                        className={classes.prepareBtn}
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'ready')}
                        className={classes.readyBtn}
                      >
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;