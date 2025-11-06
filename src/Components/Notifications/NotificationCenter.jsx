import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import styles from './NotificationCenter.module.css';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markNotificationAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const toggleNotificationCenter = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'order_update': '📦',
      'new_order': '🔔',
      'delivery': '🚚',
      'payment': '💳',
      'system': '⚙️'
    };
    return icons[type] || '📢';
  };

  return (
    <div className={styles.notificationCenter}>
      {/* Notification Bell */}
      <button 
        className={styles.notificationBell}
        onClick={toggleNotificationCenter}
        aria-label="Notifications"
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            <div className={styles.header}>
              <h3>Notifications</h3>
              <div className={styles.headerActions}>
                {notifications.length > 0 && (
                  <>
                    <button 
                      className={styles.actionBtn}
                      onClick={markAllAsRead}
                      title="Mark all as read"
                    >
                      <i className="fas fa-check-double"></i>
                    </button>
                    <button 
                      className={styles.actionBtn}
                      onClick={clearNotifications}
                      title="Clear all"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                )}
                <button 
                  className={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div className={styles.notificationList}>
              {notifications.length === 0 ? (
                <div className={styles.emptyState}>
                  <i className="fas fa-bell-slash"></i>
                  <p>No notifications yet</p>
                  <span>We'll notify you when something important happens</span>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationTitle}>
                        {notification.title}
                      </div>
                      <div className={styles.notificationMessage}>
                        {notification.message}
                      </div>
                      <div className={styles.notificationTime}>
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className={styles.unreadDot}></div>
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 5 && (
              <div className={styles.footer}>
                <button className={styles.viewAllBtn}>
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;