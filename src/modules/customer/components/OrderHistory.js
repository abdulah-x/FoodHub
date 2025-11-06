import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../../services/api';
import { useUser } from '../../../contexts/UserContext';
import Card from '../../../Components/UI/Card';
import classes from './OrderHistory.module.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useUser();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrdersByCustomer(currentUser._id);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load order history');
      setLoading(false);
      
      // Demo data when API fails
      setOrders([
        {
          _id: '1',
          restaurant: { name: 'Italian Bistro' },
          items: [
            { menuItem: { name: 'Margherita Pizza', price: 12.99 }, quantity: 1 },
            { menuItem: { name: 'Caesar Salad', price: 8.99 }, quantity: 1 }
          ],
          totalAmount: 21.98,
          status: 'delivered',
          createdAt: '2025-09-30T18:30:00Z'
        },
        {
          _id: '2',
          restaurant: { name: 'Sushi Master' },
          items: [
            { menuItem: { name: 'California Roll', price: 8.99 }, quantity: 2 },
            { menuItem: { name: 'Miso Soup', price: 4.99 }, quantity: 1 }
          ],
          totalAmount: 22.97,
          status: 'preparing',
          createdAt: '2025-10-01T12:15:00Z'
        }
      ]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9500';
      case 'confirmed': return '#007bff';
      case 'preparing': return '#ffc107';
      case 'ready': return '#17a2b8';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className={classes.loading}>Loading order history...</div>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '📦';
      case 'delivered': return '🚚';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  return (
    <div className={classes.container}>
      {/* Modern Header */}
      <div className={classes.headerSection}>
        <div className={classes.headerContent}>
          <h1 className={classes.title}>
            <span className={classes.titleIcon}>📋</span>
            My Order History
          </h1>
          <p className={classes.subtitle}>Track your food journey and reorder your favorites</p>
        </div>
      </div>

      {error && <div className={classes.error}>{error}</div>}

      {orders.length === 0 ? (
        <div className={classes.emptyState}>
          <div className={classes.emptyContent}>
            <span className={classes.emptyIcon}>🍽️</span>
            <h3>No orders yet!</h3>
            <p>You haven't placed any orders yet.</p>
            <p>Start exploring restaurants to place your first order!</p>
            <button className={classes.exploreBtn}>
              🔍 Explore Restaurants
            </button>
          </div>
        </div>
      ) : (
        <div className={classes.ordersContainer}>
          <div className={classes.ordersList}>
            {orders.map(order => (
              <div key={order._id} className={classes.orderCard}>
                <div className={classes.cardHeader}>
                  <div className={classes.restaurantInfo}>
                    <div className={classes.restaurantIcon}>🏪</div>
                    <div>
                      <h3 className={classes.restaurantName}>
                        {order.restaurant?.name || 'Unknown Restaurant'}
                      </h3>
                      <p className={classes.orderDate}>
                        📅 {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className={classes.statusContainer}>
                    <span className={classes.statusBadge} data-status={order.status}>
                      <span className={classes.statusIcon}>
                        {getStatusIcon(order.status)}
                      </span>
                      <span className={classes.statusText}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className={classes.orderContent}>
                  <div className={classes.itemsSection}>
                    <h4 className={classes.sectionTitle}>
                      <span className={classes.sectionIcon}>🍴</span>
                      Items Ordered
                    </h4>
                    <div className={classes.itemsList}>
                      {order.items.map((item, index) => (
                        <div key={index} className={classes.orderItem}>
                          <div className={classes.itemInfo}>
                            <span className={classes.itemQuantity}>{item.quantity}×</span>
                            <span className={classes.itemName}>
                              {item.menuItem?.name || 'Unknown Item'}
                            </span>
                          </div>
                          <span className={classes.itemPrice}>
                            ${((item.price || item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={classes.orderSummary}>
                    <div className={classes.totalSection}>
                      <span className={classes.totalLabel}>💰 Total Amount</span>
                      <span className={classes.totalAmount}>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className={classes.notesSection}>
                      <h4 className={classes.sectionTitle}>
                        <span className={classes.sectionIcon}>📝</span>
                        Special Notes
                      </h4>
                      <p className={classes.notes}>{order.notes}</p>
                    </div>
                  )}

                  <div className={classes.orderActions}>
                    <button className={classes.actionBtn}>
                      🔄 Reorder
                    </button>
                    <button className={classes.actionBtn}>
                      📞 Contact Restaurant
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;