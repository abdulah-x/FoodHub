import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser, isLoggedIn } = useUser();

  useEffect(() => {
    if (!isLoggedIn || !currentUser) return;

    // Initialize socket connection with environment variable support
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Authenticate after connection
      newSocket.emit('authenticate', {
        userId: currentUser._id,
        userRole: currentUser.role
      });
    });

    // Listen for order updates
    newSocket.on('orderUpdate', (orderData) => {
      const notification = {
        id: Date.now(),
        type: 'order_update',
        title: getOrderUpdateTitle(orderData.status),
        message: getOrderUpdateMessage(orderData),
        timestamp: new Date(),
        read: false,
        data: orderData
      };
      
      addNotification(notification);
      showBrowserNotification(notification);
    });

    // Listen for new orders (for restaurants)
    newSocket.on('newOrder', (orderData) => {
      if (currentUser.role === 'restaurant') {
        const notification = {
          id: Date.now(),
          type: 'new_order',
          title: '🔔 New Order Received!',
          message: `Order #${orderData._id.slice(-6)} - $${orderData.totalAmount}`,
          timestamp: new Date(),
          read: false,
          data: orderData
        };
        
        addNotification(notification);
        showBrowserNotification(notification);
      }
    });

    // Listen for general notifications
    newSocket.on('notification', (notificationData) => {
      addNotification({
        ...notificationData,
        id: Date.now(),
        read: false
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isLoggedIn, currentUser]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getOrderUpdateTitle = (status) => {
    const titles = {
      'confirmed': '✅ Order Confirmed',
      'preparing': '👨‍🍳 Order Being Prepared',
      'ready': '🍽️ Order Ready',
      'out_for_delivery': '🚚 Out for Delivery',
      'delivered': '🎉 Order Delivered',
      'cancelled': '❌ Order Cancelled'
    };
    return titles[status] || '📦 Order Update';
  };

  const getOrderUpdateMessage = (orderData) => {
    const messages = {
      'confirmed': `Your order #${orderData._id.slice(-6)} has been confirmed!`,
      'preparing': `Your delicious meal is being prepared with care.`,
      'ready': `Your order is ready for pickup/delivery!`,
      'out_for_delivery': `Your order is on its way to you!`,
      'delivered': `Enjoy your meal! Thank you for choosing us.`,
      'cancelled': `Your order has been cancelled. Refund will be processed.`
    };
    return messages[orderData.status] || `Order status updated to ${orderData.status}`;
  };

  const showBrowserNotification = (notification) => {
    // Request permission for browser notifications
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/favicon.ico',
        tag: notification.type
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/logo192.png'
          });
        }
      });
    }
  };

  const emitOrderUpdate = (orderId, status, additionalData = {}) => {
    if (socket) {
      socket.emit('updateOrderStatus', {
        orderId,
        status,
        ...additionalData
      });
    }
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    addNotification,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    emitOrderUpdate
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;