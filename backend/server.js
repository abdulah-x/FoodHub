const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reactmeals', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4, // Use IPv4, skip trying IPv6
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Import routes
const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'ReactMeals API is running!' });
});

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Store user info when they connect
  socket.on('authenticate', (userData) => {
    connectedUsers.set(socket.id, {
      userId: userData.userId,
      userRole: userData.userRole,
      socketId: socket.id
    });
    
    // Join room based on user role
    if (userData.userRole === 'restaurant') {
      socket.join(`restaurant_${userData.userId}`);
    } else if (userData.userRole === 'customer') {
      socket.join(`customer_${userData.userId}`);
    }
    
    console.log(`User authenticated: ${userData.userRole} - ${userData.userId}`);
  });

  // Handle order status updates
  socket.on('updateOrderStatus', (data) => {
    const { orderId, status, customerId, restaurantId } = data;
    
    // Emit to customer
    if (customerId) {
      io.to(`customer_${customerId}`).emit('orderUpdate', {
        orderId,
        status,
        timestamp: new Date()
      });
    }
    
    // Emit to restaurant
    if (restaurantId) {
      io.to(`restaurant_${restaurantId}`).emit('orderUpdate', {
        orderId,
        status,
        timestamp: new Date()
      });
    }
    
    console.log(`Order ${orderId} status updated to: ${status}`);
  });

  // Handle new order notifications
  socket.on('newOrder', (orderData) => {
    // Notify restaurant about new order
    io.to(`restaurant_${orderData.restaurantId}`).emit('newOrder', orderData);
    console.log(`New order notification sent to restaurant: ${orderData.restaurantId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const userInfo = connectedUsers.get(socket.id);
    if (userInfo) {
      console.log(`User disconnected: ${userInfo.userRole} - ${userInfo.userId}`);
      connectedUsers.delete(socket.id);
    }
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server with Socket.io is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reactmeals'}`); 
});