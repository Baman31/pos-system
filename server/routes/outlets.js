const express = require('express');
const Outlet = require('../models/Outlet');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all outlets (admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const outlets = await Outlet.find({ status: 'active' });
    res.json(outlets);
  } catch (error) {
    console.error('Get outlets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single outlet
router.get('/:id', auth, async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({ message: 'Outlet not found' });
    }

    // Check if user has access to this outlet
    if (req.user.role !== 'admin' && req.user.outletId.toString() !== outlet._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(outlet);
  } catch (error) {
    console.error('Get outlet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create outlet (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const outlet = new Outlet(req.body);
    await outlet.save();
    res.status(201).json(outlet);
  } catch (error) {
    console.error('Create outlet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update outlet
router.put('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({ message: 'Outlet not found' });
    }

    // Check if user has access to this outlet
    if (req.user.role !== 'admin' && req.user.outletId.toString() !== outlet._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(outlet, req.body);
    await outlet.save();
    
    res.json(outlet);
  } catch (error) {
    console.error('Update outlet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete outlet (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({ message: 'Outlet not found' });
    }

    outlet.status = 'inactive';
    await outlet.save();
    
    res.json({ message: 'Outlet deactivated successfully' });
  } catch (error) {
    console.error('Delete outlet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;