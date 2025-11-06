import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  // Simple login (no password required)
  login: (email) => api.post('/users/login', { email }),
  register: (userData) => api.post('/users', userData),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Restaurant APIs
export const restaurantAPI = {
  getAllRestaurants: () => api.get('/restaurants'),
  getRestaurantById: (id) => api.get(`/restaurants/${id}`),
  createRestaurant: (restaurantData) => api.post('/restaurants', restaurantData),
  updateRestaurant: (id, restaurantData) => api.put(`/restaurants/${id}`, restaurantData),
  getRestaurantsByOwner: (ownerId) => api.get(`/restaurants/owner/${ownerId}`),
  toggleRestaurantStatus: (id) => api.patch(`/restaurants/${id}/toggle-status`),
};

// Menu APIs
export const menuAPI = {
  getAllMenuItems: () => api.get('/menu'),
  getMenuItemsByRestaurant: (restaurantId) => api.get(`/menu/restaurant/${restaurantId}`),
  createMenuItem: (menuItemData) => api.post('/menu', menuItemData),
  updateMenuItem: (id, menuItemData) => api.put(`/menu/${id}`, menuItemData),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  toggleMenuItemAvailability: (id) => api.patch(`/menu/${id}/toggle-availability`),
};

// Order APIs
export const orderAPI = {
  getAllOrders: () => api.get('/orders'),
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getOrdersByCustomer: (customerId) => api.get(`/orders/customer/${customerId}`),
  getOrdersByRestaurant: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getOrderStats: () => api.get('/orders/stats/overview'),
};

export default api;