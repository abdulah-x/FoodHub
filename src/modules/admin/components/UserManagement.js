import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../services/api';
import Card from '../../../Components/UI/Card';
import classes from './UserManagement.module.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Demo data
      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          role: 'customer',
          createdAt: '2025-09-15T10:30:00Z'
        },
        {
          _id: '2',
          name: 'Pizza Palace Owner',
          email: 'owner@pizzapalace.com',
          phone: '+0987654321',
          role: 'restaurant',
          createdAt: '2025-09-20T14:20:00Z'
        },
        {
          _id: '3',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1122334455',
          role: 'customer',
          createdAt: '2025-09-25T09:15:00Z'
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setUsers(prev => prev.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#6c5ce7';
      case 'restaurant': return '#2e7d32';
      case 'customer': return '#8a2b06';
      default: return '#6c757d';
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className={classes.loading}>Loading users...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>User Management</h1>
        
        <div className={classes.filters}>
          <button 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? classes.activeFilter : ''}
          >
            All ({users.length})
          </button>
          <button 
            onClick={() => setFilter('customer')}
            className={filter === 'customer' ? classes.activeFilter : ''}
          >
            Customers ({users.filter(u => u.role === 'customer').length})
          </button>
          <button 
            onClick={() => setFilter('restaurant')}
            className={filter === 'restaurant' ? classes.activeFilter : ''}
          >
            Restaurants ({users.filter(u => u.role === 'restaurant').length})
          </button>
          <button 
            onClick={() => setFilter('admin')}
            className={filter === 'admin' ? classes.activeFilter : ''}
          >
            Admins ({users.filter(u => u.role === 'admin').length})
          </button>
        </div>
      </div>

      <div className={classes.usersList}>
        {filteredUsers.map(user => (
          <Card key={user._id} className={classes.userCard}>
            <div className={classes.userHeader}>
              <div className={classes.userInfo}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>
              <span 
                className={classes.role}
                style={{ backgroundColor: getRoleColor(user.role) }}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            <div className={classes.userFooter}>
              <span className={classes.joinDate}>
                Joined: {formatDate(user.createdAt)}
              </span>
              
              <div className={classes.userActions}>
                <button 
                  onClick={() => handleDeleteUser(user._id)}
                  className={classes.deleteBtn}
                >
                  Delete User
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className={classes.noUsers}>
          <p>No {filter === 'all' ? '' : filter} users found.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;