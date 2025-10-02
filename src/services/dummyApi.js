// Dummy data for testing the FoodHub app without backend
const dummyUsers = [
  { id: 1, name: 'John Customer', email: 'customer@test.com', phone: '123-456-7890', role: 'customer' },
  { id: 2, name: 'Pizza Palace Owner', email: 'restaurant@test.com', phone: '123-456-7891', role: 'restaurant' },
  { id: 3, name: 'Admin User', email: 'admin@test.com', phone: '123-456-7892', role: 'admin' },
];

const dummyRestaurants = [
  {
    id: 1,
    name: 'Pizza Palace',
    ownerId: 2,
    cuisine: 'Italian',
    address: '123 Main St, City',
    phone: '555-0123',
    description: 'Authentic Italian pizza and pasta',
    rating: 4.5,
    status: 'active'
  },
  {
    id: 2,
    name: 'Burger Barn',
    ownerId: 2,
    cuisine: 'American',
    address: '456 Oak Ave, City',
    phone: '555-0124',
    description: 'Juicy burgers and crispy fries',
    rating: 4.2,
    status: 'active'
  },
  {
    id: 3,
    name: 'Sushi Zen',
    ownerId: 2,
    cuisine: 'Japanese',
    address: '789 Pine St, City',
    phone: '555-0125',
    description: 'Fresh sushi and Japanese cuisine',
    rating: 4.8,
    status: 'active'
  }
];

const dummyMenuItems = [
  // Pizza Palace menu
  { id: 1, restaurantId: 1, name: 'Margherita Pizza', price: 12.99, description: 'Fresh tomatoes, mozzarella, basil', category: 'Pizza', available: true },
  { id: 2, restaurantId: 1, name: 'Pepperoni Pizza', price: 14.99, description: 'Pepperoni, mozzarella, tomato sauce', category: 'Pizza', available: true },
  { id: 3, restaurantId: 1, name: 'Caesar Salad', price: 8.99, description: 'Romaine lettuce, croutons, parmesan', category: 'Salad', available: true },
  
  // Burger Barn menu
  { id: 4, restaurantId: 2, name: 'Classic Burger', price: 11.99, description: 'Beef patty, lettuce, tomato, cheese', category: 'Burger', available: true },
  { id: 5, restaurantId: 2, name: 'Chicken Deluxe', price: 13.99, description: 'Grilled chicken, avocado, bacon', category: 'Burger', available: true },
  { id: 6, restaurantId: 2, name: 'Sweet Potato Fries', price: 6.99, description: 'Crispy sweet potato fries', category: 'Sides', available: true },
  
  // Sushi Zen menu
  { id: 7, restaurantId: 3, name: 'California Roll', price: 9.99, description: 'Crab, avocado, cucumber', category: 'Sushi', available: true },
  { id: 8, restaurantId: 3, name: 'Salmon Nigiri', price: 15.99, description: 'Fresh salmon over rice (6 pieces)', category: 'Sushi', available: true },
  { id: 9, restaurantId: 3, name: 'Miso Soup', price: 4.99, description: 'Traditional soybean soup', category: 'Soup', available: true }
];

const dummyOrders = [
  {
    id: 1,
    customerId: 1,
    restaurantId: 1,
    items: [
      { menuItem: dummyMenuItems[0], quantity: 2 },
      { menuItem: dummyMenuItems[2], quantity: 1 }
    ],
    total: 34.97,
    status: 'delivered',
    createdAt: '2025-09-28T18:30:00Z',
    address: '123 Customer St, City'
  },
  {
    id: 2,
    customerId: 1,
    restaurantId: 2,
    items: [
      { menuItem: dummyMenuItems[3], quantity: 1 },
      { menuItem: dummyMenuItems[5], quantity: 1 }
    ],
    total: 18.98,
    status: 'pending',
    createdAt: '2025-10-01T12:15:00Z',
    address: '123 Customer St, City'
  }
];

// Mock API functions that simulate server responses
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const userAPI = {
  login: async (email) => {
    await mockDelay();
    const user = dummyUsers.find(u => u.email === email);
    if (user) {
      return { data: user };
    }
    throw new Error('User not found');
  },
  
  register: async (userData) => {
    await mockDelay();
    const existingUser = dummyUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    const newUser = { ...userData, id: dummyUsers.length + 1 };
    dummyUsers.push(newUser);
    return { data: newUser };
  },
  
  getAllUsers: async () => {
    await mockDelay();
    return { data: dummyUsers };
  },
  
  getUserById: async (id) => {
    await mockDelay();
    const user = dummyUsers.find(u => u.id === parseInt(id));
    return { data: user };
  },
  
  updateUser: async (id, userData) => {
    await mockDelay();
    const index = dummyUsers.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      dummyUsers[index] = { ...dummyUsers[index], ...userData };
      return { data: dummyUsers[index] };
    }
    throw new Error('User not found');
  },
  
  deleteUser: async (id) => {
    await mockDelay();
    const index = dummyUsers.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      dummyUsers.splice(index, 1);
      return { data: { message: 'User deleted successfully' } };
    }
    throw new Error('User not found');
  }
};

export const restaurantAPI = {
  getAllRestaurants: async () => {
    await mockDelay();
    return { data: dummyRestaurants };
  },
  
  getRestaurantById: async (id) => {
    await mockDelay();
    const restaurant = dummyRestaurants.find(r => r.id === parseInt(id));
    return { data: restaurant };
  },
  
  createRestaurant: async (restaurantData) => {
    await mockDelay();
    const newRestaurant = { ...restaurantData, id: dummyRestaurants.length + 1 };
    dummyRestaurants.push(newRestaurant);
    return { data: newRestaurant };
  },
  
  updateRestaurant: async (id, restaurantData) => {
    await mockDelay();
    const index = dummyRestaurants.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      dummyRestaurants[index] = { ...dummyRestaurants[index], ...restaurantData };
      return { data: dummyRestaurants[index] };
    }
    throw new Error('Restaurant not found');
  },
  
  getRestaurantsByOwner: async (ownerId) => {
    await mockDelay();
    const restaurants = dummyRestaurants.filter(r => r.ownerId === parseInt(ownerId));
    return { data: restaurants };
  },
  
  toggleRestaurantStatus: async (id) => {
    await mockDelay();
    const index = dummyRestaurants.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      dummyRestaurants[index].status = dummyRestaurants[index].status === 'active' ? 'inactive' : 'active';
      return { data: dummyRestaurants[index] };
    }
    throw new Error('Restaurant not found');
  }
};

export const menuAPI = {
  getAllMenuItems: async () => {
    await mockDelay();
    return { data: dummyMenuItems };
  },
  
  getMenuItemsByRestaurant: async (restaurantId) => {
    await mockDelay();
    const items = dummyMenuItems.filter(item => item.restaurantId === parseInt(restaurantId));
    return { data: items };
  },
  
  createMenuItem: async (menuItemData) => {
    await mockDelay();
    const newItem = { ...menuItemData, id: dummyMenuItems.length + 1 };
    dummyMenuItems.push(newItem);
    return { data: newItem };
  },
  
  updateMenuItem: async (id, menuItemData) => {
    await mockDelay();
    const index = dummyMenuItems.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      dummyMenuItems[index] = { ...dummyMenuItems[index], ...menuItemData };
      return { data: dummyMenuItems[index] };
    }
    throw new Error('Menu item not found');
  },
  
  deleteMenuItem: async (id) => {
    await mockDelay();
    const index = dummyMenuItems.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      dummyMenuItems.splice(index, 1);
      return { data: { message: 'Menu item deleted successfully' } };
    }
    throw new Error('Menu item not found');
  },
  
  toggleMenuItemAvailability: async (id) => {
    await mockDelay();
    const index = dummyMenuItems.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      dummyMenuItems[index].available = !dummyMenuItems[index].available;
      return { data: dummyMenuItems[index] };
    }
    throw new Error('Menu item not found');
  }
};

export const orderAPI = {
  getAllOrders: async () => {
    await mockDelay();
    return { data: dummyOrders };
  },
  
  createOrder: async (orderData) => {
    await mockDelay();
    const newOrder = { 
      ...orderData, 
      id: dummyOrders.length + 1,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    dummyOrders.push(newOrder);
    return { data: newOrder };
  },
  
  getOrderById: async (id) => {
    await mockDelay();
    const order = dummyOrders.find(o => o.id === parseInt(id));
    return { data: order };
  },
  
  getOrdersByCustomer: async (customerId) => {
    await mockDelay();
    const orders = dummyOrders.filter(o => o.customerId === parseInt(customerId));
    return { data: orders };
  },
  
  getOrdersByRestaurant: async (restaurantId) => {
    await mockDelay();
    const orders = dummyOrders.filter(o => o.restaurantId === parseInt(restaurantId));
    return { data: orders };
  },
  
  updateOrderStatus: async (id, status) => {
    await mockDelay();
    const index = dummyOrders.findIndex(o => o.id === parseInt(id));
    if (index !== -1) {
      dummyOrders[index].status = status;
      return { data: dummyOrders[index] };
    }
    throw new Error('Order not found');
  }
};

export default {
  userAPI,
  restaurantAPI,
  menuAPI,
  orderAPI
};