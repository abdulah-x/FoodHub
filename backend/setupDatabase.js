const mongoose = require('mongoose');

// Import all models to register them
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

// Sample data
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: {
      street: "123 Main St",
      city: "New York",
      zipCode: "10001"
    }
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321",
    address: {
      street: "456 Oak Ave",
      city: "New York",
      zipCode: "10002"
    }
  }
];

// We'll create restaurants after users are created so we can assign owners
const getRestaurantData = (ownerId) => [
  {
    name: "Pizza Palace",
    description: "Authentic Italian pizzas made with fresh ingredients",
    owner: ownerId,
    cuisineType: "Italian",
    address: {
      street: "789 Pizza St",
      city: "New York",
      zipCode: "10003"
    },
    rating: 4.5,
    deliveryFee: 2.99,
    minOrder: 15.00
  },
  {
    name: "Burger King",
    description: "Classic American burgers and fast food",
    owner: ownerId,
    cuisineType: "American",
    address: {
      street: "321 Burger Rd",
      city: "New York",
      zipCode: "10004"
    },
    rating: 4.2,
    deliveryFee: 1.99,
    minOrder: 10.00
  },
  {
    name: "Sushi House",
    description: "Fresh sushi and Japanese cuisine",
    owner: ownerId,
    cuisineType: "Japanese",
    address: {
      street: "654 Sushi Ave",
      city: "New York",
      zipCode: "10005"
    },
    rating: 4.8,
    deliveryFee: 3.49,
    minOrder: 20.00
  },
  {
    name: "Taco Fiesta",
    description: "Authentic Mexican tacos and vibrant flavors",
    owner: ownerId,
    cuisineType: "Mexican",
    address: {
      street: "987 Taco Blvd",
      city: "New York",
      zipCode: "10006"
    },
    rating: 4.6,
    deliveryFee: 2.49,
    minOrder: 12.00
  }
];

async function setupDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/reactmeals', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully!');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing data cleared!');

    // Create users
    console.log('Creating users...');
    const users = await User.create(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create restaurants
    console.log('Creating restaurants...');
    const restaurantData = getRestaurantData(users[0]._id); // Use first user as owner
    const restaurants = await Restaurant.create(restaurantData);
    console.log(`Created ${restaurants.length} restaurants`);

    // Create menu items for each restaurant
    console.log('Creating menu items...');
    const menuItems = [];
    
    // Pizza Palace menu
    const pizzaItems = [
      {
        name: "Margherita Pizza",
        description: "Fresh tomatoes, mozzarella, basil",
        price: 12.99,
        category: "Pizza",
        restaurant: restaurants[0]._id,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300"
      },
      {
        name: "Pepperoni Pizza",
        description: "Pepperoni, mozzarella, tomato sauce",
        price: 14.99,
        category: "Pizza",
        restaurant: restaurants[0]._id,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300"
      },
      {
        name: "Caesar Salad",
        description: "Romaine lettuce, parmesan, croutons",
        price: 8.99,
        category: "Salad",
        restaurant: restaurants[0]._id,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300"
      }
    ];

    // Burger King menu
    const burgerItems = [
      {
        name: "Classic Burger",
        description: "Beef patty, lettuce, tomato, onion",
        price: 9.99,
        category: "Burger",
        restaurant: restaurants[1]._id,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"
      },
      {
        name: "Chicken Burger",
        description: "Grilled chicken, lettuce, mayo",
        price: 10.99,
        category: "Burger",
        restaurant: restaurants[1]._id,
        image: "https://images.unsplash.com/photo-1606755962773-d324e9eaab26?w=300"
      },
      {
        name: "French Fries",
        description: "Crispy golden fries",
        price: 4.99,
        category: "Sides",
        restaurant: restaurants[1]._id,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300"
      }
    ];

    // Sushi House menu
    const sushiItems = [
      {
        name: "Salmon Roll",
        description: "Fresh salmon, avocado, cucumber",
        price: 13.99,
        category: "Sushi",
        restaurant: restaurants[2]._id,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300"
      },
      {
        name: "Tuna Roll",
        description: "Fresh tuna, wasabi, pickled ginger",
        price: 15.99,
        category: "Sushi",
        restaurant: restaurants[2]._id,
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300"
      },
      {
        name: "Miso Soup",
        description: "Traditional Japanese soup",
        price: 3.99,
        category: "Soup",
        restaurant: restaurants[2]._id,
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300"
      }
    ];

    // Taco Fiesta menu
    const tacoItems = [
      {
        name: "Beef Tacos",
        description: "Seasoned ground beef with lettuce, tomato, cheese",
        price: 11.99,
        category: "Tacos",
        restaurant: restaurants[3]._id,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300"
      },
      {
        name: "Chicken Quesadilla",
        description: "Grilled chicken with melted cheese in flour tortilla",
        price: 10.99,
        category: "Quesadilla",
        restaurant: restaurants[3]._id,
        image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300"
      },
      {
        name: "Fish Tacos",
        description: "Grilled fish with cabbage slaw and lime crema",
        price: 13.99,
        category: "Tacos",
        restaurant: restaurants[3]._id,
        image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=300"
      },
      {
        name: "Guacamole & Chips",
        description: "Fresh avocado dip with crispy tortilla chips",
        price: 7.99,
        category: "Appetizer",
        restaurant: restaurants[3]._id,
        image: "https://images.unsplash.com/photo-1541544181051-e46607e4370c?w=300"
      }
    ];

    const allMenuItems = [...pizzaItems, ...burgerItems, ...sushiItems, ...tacoItems];
    const createdMenuItems = await MenuItem.create(allMenuItems);
    console.log(`Created ${createdMenuItems.length} menu items`);

    // Create a sample order
    console.log('Creating sample order...');
    const sampleOrder = {
      customer: users[0]._id,
      restaurant: restaurants[0]._id,
      items: [
        {
          menuItem: createdMenuItems[0]._id,
          quantity: 2,
          price: createdMenuItems[0].price
        },
        {
          menuItem: createdMenuItems[2]._id,
          quantity: 1,
          price: createdMenuItems[2].price
        }
      ],
      totalAmount: (createdMenuItems[0].price * 2) + createdMenuItems[2].price,
      status: 'pending',
      deliveryAddress: users[0].address,
      customerPhone: users[0].phone
    };

    const order = await Order.create(sampleOrder);
    console.log('Created sample order');

    console.log('\n=== Database Setup Complete! ===');
    console.log(`✅ Users: ${users.length}`);
    console.log(`✅ Restaurants: ${restaurants.length}`);
    console.log(`✅ Menu Items: ${createdMenuItems.length}`);
    console.log(`✅ Orders: 1`);
    console.log('\nDatabase is ready for your application!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the setup
setupDatabase();