import React, { useState, useEffect } from 'react';
import { menuAPI } from '../../../services/api';
import { useUser } from '../../../contexts/UserContext';
import Card from '../../../Components/UI/Card';
import classes from './MenuManagement.module.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    prepTime: 15
  });
  const { currentUser } = useUser();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      // In real app, fetch by restaurant ID
      // For demo, use dummy data
      setMenuItems([
        {
          _id: '1',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and basil',
          price: 12.99,
          category: 'Pizza',
          prepTime: 20,
          isAvailable: true
        },
        {
          _id: '2',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with caesar dressing',
          price: 8.99,
          category: 'Salads',
          prepTime: 10,
          isAvailable: true
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = { ...formData, _id: editingItem._id };
        setMenuItems(prev => 
          prev.map(item => item._id === editingItem._id ? updatedItem : item)
        );
        setEditingItem(null);
      } else {
        // Add new item
        const newItem = {
          ...formData,
          _id: Date.now().toString(),
          isAvailable: true
        };
        setMenuItems(prev => [...prev, newItem]);
      }
      
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        prepTime: 15
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to save menu item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      prepTime: item.prepTime
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setMenuItems(prev => prev.filter(item => item._id !== itemId));
      } catch (error) {
        console.error('Failed to delete menu item:', error);
      }
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      setMenuItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, isAvailable: !item.isAvailable }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      prepTime: 15
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className={classes.loading}>Loading menu...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Menu Management</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className={classes.addBtn}
        >
          Add New Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className={classes.formCard}>
          <form onSubmit={handleSubmit} className={classes.form}>
            <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            
            <div className={classes.formRow}>
              <input
                type="text"
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>

            <div className={classes.formRow}>
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Prep Time (minutes)"
                value={formData.prepTime}
                onChange={(e) => setFormData({...formData, prepTime: parseInt(e.target.value)})}
                required
              />
            </div>

            <div className={classes.formActions}>
              <button type="submit" className={classes.saveBtn}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button type="button" onClick={resetForm} className={classes.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Menu Items List */}
      <div className={classes.menuList}>
        {menuItems.map(item => (
          <Card key={item._id} className={classes.menuItemCard}>
            <div className={classes.itemHeader}>
              <div>
                <h3>{item.name}</h3>
                <span className={classes.category}>{item.category}</span>
              </div>
              <div className={classes.itemActions}>
                <button 
                  onClick={() => toggleAvailability(item._id)}
                  className={`${classes.toggleBtn} ${
                    item.isAvailable ? classes.available : classes.unavailable
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </button>
                <button 
                  onClick={() => handleEdit(item)}
                  className={classes.editBtn}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className={classes.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>

            <p className={classes.description}>{item.description}</p>
            
            <div className={classes.itemFooter}>
              <span className={classes.price}>${item.price}</span>
              <span className={classes.prepTime}>Prep: {item.prepTime} min</span>
            </div>
          </Card>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className={classes.noItems}>
          <p>No menu items yet. Add your first item to get started!</p>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;