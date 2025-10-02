const mongoose = require('mongoose');

// Import models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

async function viewDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/reactmeals', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4
    });
    console.log('Connected to MongoDB successfully!\n');

    // Get all data
    const users = await User.find({});
    const restaurants = await Restaurant.find({}).populate('owner', 'name email');
    const menuItems = await MenuItem.find({}).populate('restaurant', 'name');
    const orders = await Order.find({}).populate('customer', 'name').populate('restaurant', 'name');

    console.log('=== DATABASE CONTENT ===\n');
    
    console.log(`📊 USERS (${users.length}):`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Phone: ${user.phone}`);
    });

    console.log(`\n🏪 RESTAURANTS (${restaurants.length}):`);
    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name} - ${restaurant.cuisineType} - Owner: ${restaurant.owner.name}`);
    });

    console.log(`\n🍽️ MENU ITEMS (${menuItems.length}):`);
    menuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - $${item.price} (${item.restaurant.name})`);
    });

    console.log(`\n📋 ORDERS (${orders.length}):`);
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order by ${order.customer.name} from ${order.restaurant.name} - $${order.totalAmount} - Status: ${order.status}`);
    });

    console.log('\n✅ Database verification complete!');

  } catch (error) {
    console.error('Error viewing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

viewDatabase();