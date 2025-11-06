import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import Card from '../../../Components/UI/Card';
import classes from './RestaurantProfile.module.css';

const RestaurantProfile = () => {
  const { currentUser } = useUser();
  const [restaurantData, setRestaurantData] = useState({
    name: 'Demo Restaurant',
    description: 'Great food served fresh daily',
    cuisineType: 'International',
    address: {
      street: '123 Restaurant St',
      city: 'Food City',
      zipCode: '12345'
    },
    phone: '+1234567890',
    deliveryFee: 2.99,
    minOrder: 15.00,
    operatingHours: {
      open: '09:00',
      close: '22:00'
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setRestaurantData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setRestaurantData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      // In real app, save to API
      console.log('Saving restaurant data:', restaurantData);
      setIsEditing(false);
      // Show success message
      alert('Restaurant profile updated successfully!');
    } catch (error) {
      console.error('Failed to update restaurant profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset to original data in real app
    setIsEditing(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Restaurant Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={classes.editBtn}>
            Edit Profile
          </button>
        )}
      </div>

      <div className={classes.profileContent}>
        <Card className={classes.profileCard}>
          <div className={classes.section}>
            <h3>Basic Information</h3>
            
            <div className={classes.formGroup}>
              <label>Restaurant Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={restaurantData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <p>{restaurantData.name}</p>
              )}
            </div>

            <div className={classes.formGroup}>
              <label>Description</label>
              {isEditing ? (
                <textarea
                  value={restaurantData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                ></textarea>
              ) : (
                <p>{restaurantData.description}</p>
              )}
            </div>

            <div className={classes.formGroup}>
              <label>Cuisine Type</label>
              {isEditing ? (
                <input
                  type="text"
                  value={restaurantData.cuisineType}
                  onChange={(e) => handleInputChange('cuisineType', e.target.value)}
                />
              ) : (
                <p>{restaurantData.cuisineType}</p>
              )}
            </div>
          </div>

          <div className={classes.section}>
            <h3>Contact & Location</h3>
            
            <div className={classes.formGroup}>
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={restaurantData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p>{restaurantData.phone}</p>
              )}
            </div>

            <div className={classes.formGroup}>
              <label>Street Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={restaurantData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                />
              ) : (
                <p>{restaurantData.address.street}</p>
              )}
            </div>

            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={restaurantData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                  />
                ) : (
                  <p>{restaurantData.address.city}</p>
                )}
              </div>

              <div className={classes.formGroup}>
                <label>Zip Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={restaurantData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  />
                ) : (
                  <p>{restaurantData.address.zipCode}</p>
                )}
              </div>
            </div>
          </div>

          <div className={classes.section}>
            <h3>Business Settings</h3>
            
            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label>Delivery Fee ($)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={restaurantData.deliveryFee}
                    onChange={(e) => handleInputChange('deliveryFee', parseFloat(e.target.value))}
                  />
                ) : (
                  <p>${restaurantData.deliveryFee}</p>
                )}
              </div>

              <div className={classes.formGroup}>
                <label>Minimum Order ($)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={restaurantData.minOrder}
                    onChange={(e) => handleInputChange('minOrder', parseFloat(e.target.value))}
                  />
                ) : (
                  <p>${restaurantData.minOrder}</p>
                )}
              </div>
            </div>

            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label>Opening Time</label>
                {isEditing ? (
                  <input
                    type="time"
                    value={restaurantData.operatingHours.open}
                    onChange={(e) => handleInputChange('operatingHours.open', e.target.value)}
                  />
                ) : (
                  <p>{restaurantData.operatingHours.open}</p>
                )}
              </div>

              <div className={classes.formGroup}>
                <label>Closing Time</label>
                {isEditing ? (
                  <input
                    type="time"
                    value={restaurantData.operatingHours.close}
                    onChange={(e) => handleInputChange('operatingHours.close', e.target.value)}
                  />
                ) : (
                  <p>{restaurantData.operatingHours.close}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className={classes.actions}>
              <button onClick={handleSave} className={classes.saveBtn}>
                Save Changes
              </button>
              <button onClick={handleCancel} className={classes.cancelBtn}>
                Cancel
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RestaurantProfile;