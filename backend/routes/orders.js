const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    
    // Populate order details for notification
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price');
    
    // Emit new order notification to restaurant
    const io = req.app.get('io');
    if (io) {
      io.to(`restaurant_${req.body.restaurant}`).emit('newOrder', {
        _id: populatedOrder._id,
        customer: populatedOrder.customer,
        items: populatedOrder.items,
        totalAmount: populatedOrder.totalAmount,
        status: populatedOrder.status,
        timestamp: new Date()
      });
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId })
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('customer', 'name phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).populate('customer', 'name email phone')
     .populate('restaurant', 'name')
     .populate('items.menuItem', 'name price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit order status update to both customer and restaurant
    const io = req.app.get('io');
    if (io) {
      const updateData = {
        _id: order._id,
        status: order.status,
        customer: order.customer,
        restaurant: order.restaurant,
        totalAmount: order.totalAmount,
        timestamp: new Date()
      };

      // Notify customer
      io.to(`customer_${order.customer._id}`).emit('orderUpdate', updateData);
      
      // Notify restaurant
      io.to(`restaurant_${order.restaurant._id}`).emit('orderUpdate', updateData);
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order statistics (for admin dashboard)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;