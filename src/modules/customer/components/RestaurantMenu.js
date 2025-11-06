import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuAPI, restaurantAPI } from '../../../services/api';
import { useContext } from 'react';
import CartContext from '../../../Components/store/Cart-context';
import Card from '../../../Components/UI/Card';
import classes from './RestaurantMenu.module.css';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({}); // Track quantities for each item
  const cartCtx = useContext(CartContext);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      // Fetch restaurant details
      const restaurantResponse = await restaurantAPI.getRestaurantById(id);
      setRestaurant(restaurantResponse.data);

      // Fetch menu items
      const menuResponse = await menuAPI.getMenuItemsByRestaurant(id);
      setMenuItems(menuResponse.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load restaurant menu');
      setLoading(false);
      
      // Demo data for when API fails
      setRestaurant({
        _id: id,
        name: 'Demo Restaurant',
        description: 'Great food delivered fast',
        cuisineType: 'International',
        rating: 4.5
      });
      
      setMenuItems([
        {
          _id: 'm1',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and basil',
          price: 12.99,
          category: 'Pizza',
          isAvailable: true
        },
        {
          _id: 'm2',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with caesar dressing and croutons',
          price: 8.99,
          category: 'Salads',
          isAvailable: true
        },
        {
          _id: 'm3',
          name: 'Grilled Chicken',
          description: 'Tender grilled chicken breast with herbs and spices',
          price: 15.99,
          category: 'Main Course',
          isAvailable: true
        }
      ]);
    }
  };

  const addToCartHandler = (item, amount) => {
    cartCtx.addItem({
      id: item._id,
      name: item.name,
      amount: amount,
      price: item.price,
      restaurantId: restaurant?._id || id, // Use restaurant ID from state or URL param
      restaurantName: restaurant?.name || 'Restaurant'
    });
  };

  if (loading) {
    return <div className={classes.loading}>Loading menu...</div>;
  }

  if (!restaurant) {
    return <div className={classes.error}>Restaurant not found</div>;
  }

  // Group menu items by category
  const categorizedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Modern Menu Item Component
  const ModernMealItem = ({ item }) => (
    <div className={classes.mealItem}>
      <div className={classes.mealImage}>
        <img 
          src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&q=80`}
          alt={item.name}
          className={classes.itemImage}
        />
        <div className={classes.priceTag}>
          ${item.price}
        </div>
      </div>
      
      <div className={classes.mealContent}>
        <div className={classes.mealHeader}>
          <h3 className={classes.mealName}>{item.name}</h3>
          <div className={classes.mealBadges}>
            {item.isSpicy && <span className={classes.badge}>🌶️ Spicy</span>}
            {item.isVegetarian && <span className={classes.badge}>🥬 Veg</span>}
          </div>
        </div>
        
        <p className={classes.mealDescription}>{item.description}</p>
        
        <div className={classes.mealActions}>
          <div className={classes.quantityControls}>
            <button 
              className={classes.quantityBtn}
              onClick={() => setQuantities(prev => ({ ...prev, [item._id]: Math.max(1, (prev[item._id] || 1) - 1) }))}
            >
              -
            </button>
            <span className={classes.quantity}>{quantities[item._id] || 1}</span>
            <button 
              className={classes.quantityBtn}
              onClick={() => setQuantities(prev => ({ ...prev, [item._id]: (prev[item._id] || 1) + 1 }))}
            >
              +
            </button>
          </div>
          
          <button 
            className={classes.addToCartBtn}
            onClick={() => addToCartHandler(item, quantities[item._id] || 1)}
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
      {/* Modern Restaurant Header */}
      <div className={classes.restaurantHero}>
        <div className={classes.heroBackground}></div>
        <div className={classes.heroContent}>
          <div className={classes.restaurantInfo}>
            <h1 className={classes.restaurantName}>{restaurant.name}</h1>
            <p className={classes.restaurantDesc}>{restaurant.description}</p>
            
            <div className={classes.restaurantMeta}>
              <div className={classes.metaItem}>
                <span className={classes.metaIcon}>🍽️</span>
                <span>{restaurant.cuisineType}</span>
              </div>
              <div className={classes.metaItem}>
                <span className={classes.metaIcon}>⭐</span>
                <span>{restaurant.rating} ({Math.floor(Math.random() * 200) + 50}+ reviews)</span>
              </div>
              <div className={classes.metaItem}>
                <span className={classes.metaIcon}>⏰</span>
                <span>25-35 min</span>
              </div>
              <div className={classes.metaItem}>
                <span className={classes.metaIcon}>🚚</span>
                <span>$2.99 delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className={classes.error}>{error}</div>}

      {/* Modern Menu Section */}
      <div className={classes.menuContainer}>
        {Object.entries(categorizedItems).map(([category, items]) => (
          <section key={category} className={classes.menuCategory}>
            <div className={classes.categoryHeader}>
              <h2 className={classes.categoryTitle}>
                <span className={classes.categoryIcon}>
                  {category === 'Appetizers' ? '🥗' : 
                   category === 'Main Course' ? '🍽️' : 
                   category === 'Desserts' ? '🍰' : 
                   category === 'Beverages' ? '🥤' : '🍴'}
                </span>
                {category}
              </h2>
              <div className={classes.categoryLine}></div>
            </div>
            
            <div className={classes.menuGrid}>
              {items.map(item => (
                <ModernMealItem key={item._id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {Object.keys(categorizedItems).length === 0 && (
        <div className={classes.noItems}>
          <div className={classes.emptyState}>
            <span className={classes.emptyIcon}>🍽️</span>
            <h3>No menu items available</h3>
            <p>This restaurant is currently updating their menu. Please check back later!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;