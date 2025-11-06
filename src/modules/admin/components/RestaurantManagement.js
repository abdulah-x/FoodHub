import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../../../services/api';
import Card from '../../../Components/UI/Card';
import classes from './RestaurantManagement.module.css';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      // Demo data
      setRestaurants([
        {
          _id: '1',
          name: 'Pizza Palace',
          description: 'Authentic Italian pizzas',
          cuisineType: 'Italian',
          owner: { name: 'Mario Rossi', email: 'mario@pizzapalace.com' },
          rating: 4.5,
          isActive: true,
          deliveryFee: 2.99,
          minOrder: 15.00,
          createdAt: '2025-09-15T10:30:00Z'
        },
        {
          _id: '2',
          name: 'Burger Junction',
          description: 'Gourmet burgers and fries',
          cuisineType: 'American',
          owner: { name: 'John Smith', email: 'john@burgerjunction.com' },
          rating: 4.2,
          isActive: true,
          deliveryFee: 1.99,
          minOrder: 12.00,
          createdAt: '2025-09-20T14:20:00Z'
        },
        {
          _id: '3',
          name: 'Sushi Express',
          description: 'Fresh sushi and Japanese cuisine',
          cuisineType: 'Japanese',
          owner: { name: 'Takeshi Yamamoto', email: 'takeshi@sushiexpress.com' },
          rating: 4.8,
          isActive: false,
          deliveryFee: 3.50,
          minOrder: 20.00,
          createdAt: '2025-09-25T09:15:00Z'
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async (restaurantId) => {
    try {
      setRestaurants(prev =>
        prev.map(restaurant =>
          restaurant._id === restaurantId
            ? { ...restaurant, isActive: !restaurant.isActive }
            : restaurant
        )
      );
    } catch (error) {
      console.error('Failed to toggle restaurant status:', error);
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        setRestaurants(prev => prev.filter(restaurant => restaurant._id !== restaurantId));
      } catch (error) {
        console.error('Failed to delete restaurant:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className={classes.loading}>Loading restaurants...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Restaurant Management</h1>
        <div className={classes.stats}>
          <span>Total: {restaurants.length}</span>
          <span>Active: {restaurants.filter(r => r.isActive).length}</span>
          <span>Inactive: {restaurants.filter(r => !r.isActive).length}</span>
        </div>
      </div>

      <div className={classes.restaurantsList}>
        {restaurants.map(restaurant => (
          <Card key={restaurant._id} className={classes.restaurantCard}>
            <div className={classes.restaurantHeader}>
              <div className={classes.restaurantInfo}>
                <h3>{restaurant.name}</h3>
                <p className={classes.description}>{restaurant.description}</p>
                <div className={classes.meta}>
                  <span className={classes.cuisine}>{restaurant.cuisineType}</span>
                  <span className={classes.rating}>⭐ {restaurant.rating}</span>
                </div>
              </div>
              <div className={classes.status}>
                <span 
                  className={`${classes.statusBadge} ${
                    restaurant.isActive ? classes.active : classes.inactive
                  }`}
                >
                  {restaurant.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>

            <div className={classes.ownerInfo}>
              <h4>Owner Information</h4>
              <p><strong>Name:</strong> {restaurant.owner.name}</p>
              <p><strong>Email:</strong> {restaurant.owner.email}</p>
            </div>

            <div className={classes.businessInfo}>
              <div className={classes.infoGrid}>
                <div>
                  <strong>Delivery Fee:</strong> ${restaurant.deliveryFee}
                </div>
                <div>
                  <strong>Min Order:</strong> ${restaurant.minOrder}
                </div>
                <div>
                  <strong>Joined:</strong> {formatDate(restaurant.createdAt)}
                </div>
              </div>
            </div>

            <div className={classes.restaurantActions}>
              <button 
                onClick={() => toggleRestaurantStatus(restaurant._id)}
                className={`${classes.toggleBtn} ${
                  restaurant.isActive ? classes.deactivateBtn : classes.activateBtn
                }`}
              >
                {restaurant.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={() => handleDeleteRestaurant(restaurant._id)}
                className={classes.deleteBtn}
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className={classes.noRestaurants}>
          <p>No restaurants found.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;