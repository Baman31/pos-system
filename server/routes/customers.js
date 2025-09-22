const express = require('express');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;
    
    let filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(filter)
      .sort({ totalSpent: -1, lastVisit: -1 })
      .limit(parseInt(limit));

    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single customer
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get customer's recent orders
    const recentOrders = await Order.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber total status type createdAt');

    res.json({
      ...customer.toJSON(),
      recentOrders
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create customer
router.post('/', auth, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Customer with this phone/email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    Object.assign(customer, req.body);
    await customer.save();
    
    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Customer with this phone/email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Find customer by phone
router.get('/phone/:phone', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: req.params.phone, isActive: true });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Find customer by phone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update loyalty points
router.patch('/:id/loyalty', auth, async (req, res) => {
  try {
    const { points, operation } = req.body; // operation: 'add', 'subtract', or 'set'
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (operation === 'add') {
      customer.loyaltyPoints += points;
    } else if (operation === 'subtract') {
      customer.loyaltyPoints = Math.max(0, customer.loyaltyPoints - points);
    } else {
      customer.loyaltyPoints = points;
    }
    
    await customer.save();
    res.json(customer);
  } catch (error) {
    console.error('Update loyalty points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer analytics
router.get('/analytics/summary', auth, async (req, res) => {
  try {
    const [totalCustomers, newCustomersThisMonth, topCustomers, loyaltyStats] = await Promise.all([
      Customer.countDocuments({ isActive: true }),
      Customer.countDocuments({
        isActive: true,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      Customer.find({ isActive: true })
        .sort({ totalSpent: -1 })
        .limit(10)
        .select('name phone totalSpent totalOrders'),
      Customer.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalLoyaltyPoints: { $sum: '$loyaltyPoints' },
            avgLoyaltyPoints: { $avg: '$loyaltyPoints' }
          }
        }
      ])
    ]);
    
    res.json({
      totalCustomers,
      newCustomersThisMonth,
      topCustomers,
      loyaltyStats: loyaltyStats[0] || { totalLoyaltyPoints: 0, avgLoyaltyPoints: 0 }
    });
  } catch (error) {
    console.error('Get customer analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete customer (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.isActive = false;
    await customer.save();
    
    res.json({ message: 'Customer deactivated successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;