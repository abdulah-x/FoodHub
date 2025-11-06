import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../../services/api';
import Card from '../../../Components/UI/Card';
import classes from './RestaurantList.module.css';

// Cuisine type to emoji mapping
const cuisineEmojis = {
  'Italian': '🍕',
  'Japanese': '🍣',
  'American': '🍔',
  'Mexican': '🌮',
  'Chinese': '🥡',
  'Indian': '🍛',
  'Thai': '🍜',
  'French': '🥖',
  'Mediterranean': '🥙',
  'Korean': '🍲'
};

// Restaurant images (you can replace with actual image URLs)
const restaurantImages = {
  'Pizza Palace': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop',
  'Pizza Palace Deluxe': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop',
  'Burger King': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=250&fit=crop',
  'Sushi House': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=250&fit=crop',
  'Taco Fiesta': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
  'Italian Bistro': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop',
  'Sushi Master': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=250&fit=crop',
  'Burger Palace': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=250&fit=crop'
};

// Generate star rating
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className={classes.star}>⭐</span>);
  }
  
  if (hasHalfStar) {
    stars.push(<span key="half" className={classes.halfStar}>⭐</span>);
  }
  
  return (
    <div className={classes.starRating}>
      {stars}
      <span className={classes.ratingNumber}>({rating})</span>
    </div>
  );
};

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [quickFilter, setQuickFilter] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Filter and search effect
  useEffect(() => {
    let filtered = [...restaurants];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Cuisine filter
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant => restaurant.cuisineType === selectedCuisine);
    }
    
    // Quick filters
    if (quickFilter === 'topRated') {
      filtered = filtered.filter(restaurant => restaurant.rating >= 4.5);
    } else if (quickFilter === 'fastDelivery') {
      filtered = filtered.filter(restaurant => restaurant.deliveryFee <= 2.50);
    } else if (quickFilter === 'popular') {
      // Simulate popularity based on rating and delivery fee
      filtered = filtered.filter(restaurant => 
        restaurant.rating >= 4.3 && restaurant.deliveryFee <= 3.0
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return a.deliveryFee - b.deliveryFee; // Using deliveryFee as proxy for delivery time
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'minOrder':
          return a.minOrder - b.minOrder;
        default:
          return 0;
      }
    });
    
    setFilteredRestaurants(filtered);
  }, [restaurants, searchTerm, selectedCuisine, sortBy, quickFilter]);

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
        
        {/* Search and Filter Section */}
        <div className={classes.filtersSection}>
          <div className={classes.searchContainer}>
            <div className={classes.searchBox}>
              <span className={classes.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
              />
            </div>
          </div>
          
          <div className={classes.filtersRow}>
            <div className={classes.filterGroup}>
              <label htmlFor="cuisine-select" className={classes.filterLabel}>Cuisine</label>
              <select
                id="cuisine-select"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className={classes.filterSelect}
              >
                <option value="">All Cuisines</option>
                {Object.keys(cuisineEmojis).map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisineEmojis[cuisine]} {cuisine}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={classes.filterGroup}>
              <label htmlFor="sort-select" className={classes.filterLabel}>Sort By</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={classes.filterSelect}
              >
                <option value="rating">⭐ Rating</option>
                <option value="deliveryTime">⚡ Delivery Fee</option>
                <option value="alphabetical">📝 Name (A-Z)</option>
                <option value="minOrder">💰 Min Order</option>
              </select>
            </div>
          </div>
          
          <div className={classes.quickFilters}>
            <span className={classes.quickFilterLabel}>Quick Filters:</span>
            <button
              className={`${classes.quickFilterBtn} ${quickFilter === 'topRated' ? classes.active : ''}`}
              onClick={() => setQuickFilter(quickFilter === 'topRated' ? '' : 'topRated')}
            >
              ⭐ Top Rated (4.5+)
            </button>
            <button
              className={`${classes.quickFilterBtn} ${quickFilter === 'fastDelivery' ? classes.active : ''}`}
              onClick={() => setQuickFilter(quickFilter === 'fastDelivery' ? '' : 'fastDelivery')}
            >
              ⚡ Fast Delivery
            </button>
            <button
              className={`${classes.quickFilterBtn} ${quickFilter === 'popular' ? classes.active : ''}`}
              onClick={() => setQuickFilter(quickFilter === 'popular' ? '' : 'popular')}
            >
              🔥 Popular
            </button>
          </div>
          
          <div className={classes.resultsInfo}>
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
          </div>
        </div>
        
        <div className={classes.restaurantGrid}>
          {filteredRestaurants.map(restaurant => (
            <Card key={restaurant._id} className={classes.restaurantCard}>
              <div className={classes.cardImageContainer}>
                <img 
                  src={restaurantImages[restaurant.name] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop'}
                  alt={restaurant.name}
                  className={classes.restaurantImage}
                />
                <div className={classes.imageOverlay}>
                  <div className={classes.badges}>
                    {restaurant.rating >= 4.5 && (
                      <span className={classes.badge}>⭐ Top Rated</span>
                    )}
                    {restaurant.deliveryFee <= 2.50 && (
                      <span className={classes.badge}>⚡ Fast</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={classes.restaurantContent}>
                <div className={classes.restaurantHeader}>
                  <h3 className={classes.restaurantName}>{restaurant.name}</h3>
                  <div className={classes.cuisineBadge}>
                    <span className={classes.cuisineEmoji}>
                      {cuisineEmojis[restaurant.cuisineType] || '🍽️'}
                    </span>
                    <span className={classes.cuisineText}>{restaurant.cuisineType}</span>
                  </div>
                </div>
                
                <p className={classes.description}>{restaurant.description}</p>
                
                <div className={classes.ratingSection}>
                  <StarRating rating={restaurant.rating} />
                  <span className={classes.ratingText}>
                    {restaurant.rating} ({Math.floor(Math.random() * 100) + 50}+ reviews)
                  </span>
                </div>
                
                <div className={classes.restaurantMeta}>
                  <div className={classes.metaItem}>
                    <span className={classes.metaIcon}>🚚</span>
                    <span className={classes.metaText}>
                      ${restaurant.deliveryFee} delivery
                    </span>
                  </div>
                  <div className={classes.metaItem}>
                    <span className={classes.metaIcon}>⏱️</span>
                    <span className={classes.metaText}>
                      {restaurant.deliveryTime || '25-35'} min
                    </span>
                  </div>
                  <div className={classes.metaItem}>
                    <span className={classes.metaIcon}>💰</span>
                    <span className={classes.metaText}>
                      Min ${restaurant.minOrder}
                    </span>
                  </div>
                </div>
                
                <Link 
                  to={`/restaurant/${restaurant._id}`} 
                  className={classes.viewMenuBtn}
                >
                  <span>View Menu</span>
                  <span className={classes.btnIcon}>→</span>
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