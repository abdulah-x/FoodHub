import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuAPI, restaurantAPI } from '../../../services/api';
import { useContext } from 'react';
import CartContext from '../../../Components/store/Cart-context';
import Card from '../../../Components/UI/Card';
import MealItem from '../../../Components/Meal/MealItem/MealItem';
import classes from './RestaurantMenu.module.css';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      price: item.price
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

  return (
    <div className={classes.container}>
      <div className={classes.restaurantHeader}>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <div className={classes.restaurantMeta}>
          <span className={classes.cuisine}>{restaurant.cuisineType}</span>
          <span className={classes.rating}>⭐ {restaurant.rating}</span>
        </div>
      </div>

      {error && <div className={classes.error}>{error}</div>}

      <div className={classes.menu}>
        {Object.entries(categorizedItems).map(([category, items]) => (
          <section key={category} className={classes.category}>
            <h2>{category}</h2>
            <Card>
              <ul className={classes.menuList}>
                {items.map(item => (
                  <MealItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    desc={item.description}
                    price={item.price}
                    onAddToCart={(amount) => addToCartHandler(item, amount)}
                  />
                ))}
              </ul>
            </Card>
          </section>
        ))}
      </div>

      {Object.keys(categorizedItems).length === 0 && (
        <div className={classes.noItems}>
          <p>No menu items available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;