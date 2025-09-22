const express = require('express');
const InventoryItem = require('../models/InventoryItem');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get inventory items for outlet
router.get('/', auth, async (req, res) => {
  try {
    const { category, stockStatus } = req.query;
    const outletId = req.user.outletId;

    let filter = { outletId, isActive: true };
    
    if (category) {
      filter.category = category;
    }

    const inventoryItems = await InventoryItem.find(filter).sort({ category: 1, name: 1 });
    
    // Filter by stock status if requested
    let filteredItems = inventoryItems;
    if (stockStatus) {
      filteredItems = inventoryItems.filter(item => {
        const status = item.currentStock <= item.minStock ? 'low' : 'normal';
        return status === stockStatus;
      });
    }

    res.json(filteredItems);
  } catch (error) {
    console.error('Get inventory items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inventory categories
router.get('/categories', auth, async (req, res) => {
  try {
    const outletId = req.user.outletId;
    const categories = await InventoryItem.distinct('category', { outletId, isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Get inventory categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get low stock items
router.get('/low-stock', auth, async (req, res) => {
  try {
    const outletId = req.user.outletId;
    const lowStockItems = await InventoryItem.find({
      outletId,
      isActive: true,
      $expr: { $lte: ['$currentStock', '$minStock'] }
    }).sort({ currentStock: 1 });

    res.json(lowStockItems);
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single inventory item
router.get('/:id', auth, async (req, res) => {
  try {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Check if user has access to this outlet's inventory
    if (req.user.outletId.toString() !== inventoryItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(inventoryItem);
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create inventory item
router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const inventoryItem = new InventoryItem({
      ...req.body,
      outletId: req.user.outletId
    });
    
    await inventoryItem.save();
    res.status(201).json(inventoryItem);
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update inventory item
router.put('/:id', auth, authorize('admin', 'manager', 'kitchen'), async (req, res) => {
  try {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Check if user has access to this outlet's inventory
    if (req.user.outletId.toString() !== inventoryItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(inventoryItem, req.body);
    await inventoryItem.save();
    
    res.json(inventoryItem);
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update stock quantity
router.patch('/:id/stock', auth, authorize('admin', 'manager', 'kitchen'), async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    const inventoryItem = await InventoryItem.findById(req.params.id);
    
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Check if user has access to this outlet's inventory
    if (req.user.outletId.toString() !== inventoryItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (operation === 'add') {
      inventoryItem.currentStock += quantity;
      inventoryItem.lastRestocked = new Date();
    } else if (operation === 'subtract') {
      inventoryItem.currentStock = Math.max(0, inventoryItem.currentStock - quantity);
    } else {
      inventoryItem.currentStock = quantity;
    }
    
    await inventoryItem.save();
    res.json(inventoryItem);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inventory item
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Check if user has access to this outlet's inventory
    if (req.user.outletId.toString() !== inventoryItem.outletId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    inventoryItem.isActive = false;
    await inventoryItem.save();
    
    res.json({ message: 'Inventory item deactivated successfully' });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inventory analytics
router.get('/analytics/summary', auth, async (req, res) => {
  try {
    const outletId = req.user.outletId;
    
    const [totalItems, lowStockCount, totalValue, categoryBreakdown] = await Promise.all([
      InventoryItem.countDocuments({ outletId, isActive: true }),
      InventoryItem.countDocuments({
        outletId,
        isActive: true,
        $expr: { $lte: ['$currentStock', '$minStock'] }
      }),
      InventoryItem.aggregate([
        { $match: { outletId, isActive: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$currentStock', '$cost'] } } } }
      ]),
      InventoryItem.aggregate([
        { $match: { outletId, isActive: true } },
        { 
          $group: { 
            _id: '$category', 
            count: { $sum: 1 },
            value: { $sum: { $multiply: ['$currentStock', '$cost'] } }
          } 
        }
      ])
    ]);
    
    res.json({
      totalItems,
      lowStockCount,
      totalValue: totalValue[0]?.total || 0,
      categoryBreakdown
    });
  } catch (error) {
    console.error('Get inventory analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;