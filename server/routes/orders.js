const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Customer = require('../models/Customer');
const InventoryItem = require('../models/InventoryItem');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get orders for outlet
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, date, limit = 50 } = req.query;
    const outletId = req.user.outletId;

    let filter = { outletId };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(filter)
      .populate('createdBy', 'name')
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('customerId', 'name phone email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this outlet's orders
    if (req.user.outletId.toString() !== order.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/', auth, authorize('admin', 'manager', 'cashier'), async (req, res) => {
  try {
    const { items, customerName, customerPhone, type, tableNumber, deliveryAddress, paymentMethod } = req.body;
    
    // Validate menu items and calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.id);
      if (!menuItem || !menuItem.available) {
        return res.status(400).json({ message: `Menu item ${item.name} is not available` });
      }
      
      if (menuItem.outletId.toString() !== req.user.outletId.toString()) {
        return res.status(400).json({ message: 'Invalid menu item for this outlet' });
      }
      
      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions
      });
    }
    
    // Calculate tax (18% GST)
    const taxAmount = Math.round(subtotal * 0.18);
    const total = subtotal + taxAmount;
    
    // Find or create customer
    let customer = null;
    if (customerPhone) {
      customer = await Customer.findOne({ phone: customerPhone });
      if (!customer) {
        customer = new Customer({
          name: customerName || 'Walk-in Customer',
          phone: customerPhone
        });
        await customer.save();
      }
    }
    
    // Create order
    const order = new Order({
      customerName: customerName || 'Walk-in Customer',
      customerPhone,
      customerId: customer?._id,
      type,
      tableNumber,
      deliveryAddress,
      items: orderItems,
      subtotal,
      taxAmount,
      total,
      paymentMethod,
      outletId: req.user.outletId,
      createdBy: req.user._id
    });
    
    await order.save();
    
    // Update inventory for items with ingredients
    for (const orderItem of orderItems) {
      const menuItem = await MenuItem.findById(orderItem.menuItemId).populate('ingredients.inventoryItemId');
      if (menuItem.ingredients && menuItem.ingredients.length > 0) {
        for (const ingredient of menuItem.ingredients) {
          if (ingredient.inventoryItemId) {
            const inventoryItem = await InventoryItem.findById(ingredient.inventoryItemId);
            if (inventoryItem) {
              inventoryItem.currentStock -= (ingredient.quantity * orderItem.quantity);
              await inventoryItem.save();
            }
          }
        }
      }
    }
    
    // Update customer stats if customer exists
    if (customer) {
      await customer.updateStats(total);
    }
    
    await order.populate('createdBy', 'name');
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this outlet's orders
    if (req.user.outletId.toString() !== order.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate status transition
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    if (status === 'completed') {
      order.paymentStatus = 'paid';
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order item status (for kitchen)
router.patch('/:orderId/items/:itemId/status', auth, authorize('admin', 'manager', 'kitchen'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this outlet's orders
    if (req.user.outletId.toString() !== order.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const item = order.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    item.status = status;
    
    // Check if all items are ready to update order status
    const allItemsReady = order.items.every(item => item.status === 'ready' || item.status === 'served');
    if (allItemsReady && order.status === 'preparing') {
      order.status = 'ready';
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update order item status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order analytics
router.get('/analytics/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const outletId = req.user.outletId;
    
    let dateFilter = { outletId };
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const [totalOrders, totalRevenue, ordersByStatus, ordersByType] = await Promise.all([
      Order.countDocuments(dateFilter),
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$type', count: { $sum: 1 }, revenue: { $sum: '$total' } } }
      ])
    ]);
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      ordersByType
    });
  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;