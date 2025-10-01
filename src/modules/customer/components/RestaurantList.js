import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../../services/api';
import Card from '../../../Components/UI/Card';
import classes from './RestaurantList.module.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAllRestaurants();
      setRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load restaurants');
      setLoading(false);
      // For demo purposes, use dummy data when API fails
      setRestaurants([
        {
          _id: '1',
          name: 'Italian Bistro',
          description: 'Authentic Italian cuisine with fresh ingredients',
          cuisineType: 'Italian',
          rating: 4.5,
          deliveryFee: 2.99,
          minOrder: 15
        },
        {
          _id: '2',
          name: 'Sushi Master',
          description: 'Fresh sushi and Japanese specialties',
          cuisineType: 'Japanese',
          rating: 4.8,
          deliveryFee: 3.50,
          minOrder: 20
        },
        {
          _id: '3',
          name: 'Burger Palace',
          description: 'Gourmet burgers and American classics',
          cuisineType: 'American',
          rating: 4.2,
          deliveryFee: 1.99,
          minOrder: 12
        }
      ]);
    }
  };

  if (loading) {
    return <div className={classes.loading}>Loading restaurants...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <h1>Delicious Food, Delivered to You</h1>
        <p>Choose from our amazing selection of local restaurants</p>
      </div>

      {error && <div className={classes.error}>{error}</div>}
      
      <section className={classes.restaurants}>
        <h2>Available Restaurants</h2>
        <div className={classes.restaurantGrid}>
          {restaurants.map(restaurant => (
            <Card key={restaurant._id} className={classes.restaurantCard}>
              <div className={classes.restaurantInfo}>
                <h3>{restaurant.name}</h3>
                <p className={classes.description}>{restaurant.description}</p>
                <div className={classes.details}>
                  <span className={classes.cuisine}>{restaurant.cuisineType}</span>
                  <span className={classes.rating}>⭐ {restaurant.rating}</span>
                </div>
                <div className={classes.delivery}>
                  <span>Delivery: ${restaurant.deliveryFee}</span>
                  <span>Min Order: ${restaurant.minOrder}</span>
                </div>
                <Link 
                  to={`/restaurant/${restaurant._id}`} 
                  className={classes.viewMenuBtn}
                >
                  View Menu
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RestaurantList;