const express = require('express');
const MenuItem = require('../models/MenuItem');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get menu items for outlet
router.get('/', auth, async (req, res) => {
  try {
    const { category, available } = req.query;
    const outletId = req.user.outletId;

    let filter = { outletId };
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get menu categories for outlet
router.get('/categories', auth, async (req, res) => {
  try {
    const outletId = req.user.outletId;
    const categories = await MenuItem.distinct('category', { outletId });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single menu item
router.get('/:id', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if user has access to this outlet's menu
    if (req.user.outletId.toString() !== menuItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create menu item
router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const menuItem = new MenuItem({
      ...req.body,
      outletId: req.user.outletId
    });
    
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update menu item
router.put('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if user has access to this outlet's menu
    if (req.user.outletId.toString() !== menuItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(menuItem, req.body);
    await menuItem.save();
    
    res.json(menuItem);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle menu item availability
router.patch('/:id/availability', auth, authorize('admin', 'manager', 'cashier'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if user has access to this outlet's menu
    if (req.user.outletId.toString() !== menuItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    menuItem.available = !menuItem.available;
    await menuItem.save();
    
    res.json(menuItem);
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete menu item
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if user has access to this outlet's menu
    if (req.user.outletId.toString() !== menuItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;