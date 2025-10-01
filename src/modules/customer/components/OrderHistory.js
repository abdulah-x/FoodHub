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

  return (
    <div className={classes.container}>
      <h1>My Order History</h1>

      {error && <div className={classes.error}>{error}</div>}

      {orders.length === 0 ? (
        <div className={classes.noOrders}>
          <p>You haven't placed any orders yet.</p>
          <p>Start exploring restaurants to place your first order!</p>
        </div>
      ) : (
        <div className={classes.ordersList}>
          {orders.map(order => (
            <Card key={order._id} className={classes.orderCard}>
              <div className={classes.orderHeader}>
                <div>
                  <h3>{order.restaurant?.name || 'Unknown Restaurant'}</h3>
                  <p className={classes.orderDate}>{formatDate(order.createdAt)}</p>
                </div>
                <span 
                  className={classes.status}
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className={classes.orderItems}>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className={classes.orderItem}>
                      <span>{item.quantity}x {item.menuItem?.name || 'Unknown Item'}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={classes.orderTotal}>
                <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
              </div>

              {order.notes && (
                <div className={classes.orderNotes}>
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;