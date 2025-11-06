import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../../services/api';
import Card from '../../../Components/UI/Card';
import classes from './OrderManagement.module.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Demo data for restaurant orders
      setOrders([
        {
          _id: '1',
          customer: { name: 'John Doe', phone: '+1234567890' },
          items: [
            { menuItem: { name: 'Margherita Pizza' }, quantity: 1, price: 12.99 }
          ],
          totalAmount: 12.99,
          status: 'pending',
          createdAt: new Date().toISOString(),
          deliveryAddress: { street: '123 Main St', city: 'City', zipCode: '12345' }
        },
        {
          _id: '2',
          customer: { name: 'Jane Smith', phone: '+0987654321' },
          items: [
            { menuItem: { name: 'Caesar Salad' }, quantity: 2, price: 8.99 }
          ],
          totalAmount: 17.98,
          status: 'preparing',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          deliveryAddress: { street: '456 Oak Ave', city: 'City', zipCode: '12345' }
        },
        {
          _id: '3',
          customer: { name: 'Bob Johnson', phone: '+1122334455' },
          items: [
            { menuItem: { name: 'Margherita Pizza' }, quantity: 2, price: 12.99 }
          ],
          totalAmount: 25.98,
          status: 'delivered',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          deliveryAddress: { street: '789 Pine St', city: 'City', zipCode: '12345' }
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setOrders(prev =>
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
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className={classes.loading}>Loading orders...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Order Management</h1>
        
        <div className={classes.filters}>
          <button 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? classes.activeFilter : ''}
          >
            All ({orders.length})
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? classes.activeFilter : ''}
          >
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button 
            onClick={() => setFilter('preparing')}
            className={filter === 'preparing' ? classes.activeFilter : ''}
          >
            Preparing ({orders.filter(o => o.status === 'preparing').length})
          </button>
          <button 
            onClick={() => setFilter('ready')}
            className={filter === 'ready' ? classes.activeFilter : ''}
          >
            Ready ({orders.filter(o => o.status === 'ready').length})
          </button>
        </div>
      </div>

      <div className={classes.ordersList}>
        {filteredOrders.map(order => (
          <Card key={order._id} className={classes.orderCard}>
            <div className={classes.orderHeader}>
              <div className={classes.orderInfo}>
                <h3>Order #{order._id.slice(-6)}</h3>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <span 
                className={classes.status}
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className={classes.customerInfo}>
              <h4>Customer Details</h4>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              <p><strong>Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
            </div>

            <div className={classes.orderItems}>
              <h4>Items</h4>
              {order.items.map((item, index) => (
                <div key={index} className={classes.orderItem}>
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className={classes.orderFooter}>
              <div className={classes.orderTotal}>
                <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
              </div>
              
              <div className={classes.orderActions}>
                {order.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      className={classes.confirmBtn}
                    >
                      Confirm Order
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      className={classes.cancelBtn}
                    >
                      Cancel
                    </button>
                  </>
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
                    Mark as Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                    className={classes.deliveredBtn}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className={classes.noOrders}>
          <p>No {filter === 'all' ? '' : filter} orders found.</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;