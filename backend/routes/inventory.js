const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Inventory, Location, User } = require('../models');
const { verifyToken, requireAdminOrSupervisor } = require('../middleware/auth');

const router = express.Router();

// GET /api/inventory
router.get('/', verifyToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().notEmpty().withMessage('Category cannot be empty'),
  query('condition').optional().notEmpty().withMessage('Condition cannot be empty'),
  query('locationId').optional().isInt().withMessage('Location ID must be an integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      condition, 
      locationId 
    } = req.query;

    const where = {};
    
    if (search) {
      where.$or = [
        { name: { $like: `%${search}%` } },
        { specification: { $like: `%${search}%` } },
        { brand: { $like: `%${search}%` } },
        { model: { $like: `%${search}%` } },
        { responsible: { $like: `%${search}%` } }
      ];
    }
    
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (locationId) where.locationId = locationId;

    const offset = (page - 1) * limit;

    const { count, rows: inventory } = await Inventory.findAndCountAll({
      where,
      include: [
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'building', 'floor']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        inventory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory',
      error: error.message
    });
  }
});

// GET /api/inventory/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id, {
      include: [
        {
          model: Location,
          as: 'location'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory item',
      error: error.message
    });
  }
});

// POST /api/inventory
router.post('/', verifyToken, requireAdminOrSupervisor, [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').isIn(['Furniture', 'Electronics', 'Tools', 'Vehicles', 'Books', 'Equipment', 'Others']).withMessage('Invalid category'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('condition').isIn(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const itemData = {
      ...req.body,
      createdBy: req.user.id
    };

    const item = await Inventory.create(itemData);

    // Fetch the created item with associations
    const createdItem = await Inventory.findByPk(item.id, {
      include: [
        {
          model: Location,
          as: 'location'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: { item: createdItem }
    });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create inventory item',
      error: error.message
    });
  }
});

// PUT /api/inventory/:id
router.put('/:id', verifyToken, requireAdminOrSupervisor, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().isIn(['Furniture', 'Electronics', 'Tools', 'Vehicles', 'Books', 'Equipment', 'Others']).withMessage('Invalid category'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be at least 0'),
  body('condition').optional().isIn(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    await item.update(req.body);

    // Fetch the updated item with associations
    const updatedItem = await Inventory.findByPk(item.id, {
      include: [
        {
          model: Location,
          as: 'location'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: { item: updatedItem }
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory item',
      error: error.message
    });
  }
});

// DELETE /api/inventory/:id
router.delete('/:id', verifyToken, requireAdminOrSupervisor, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item',
      error: error.message
    });
  }
});

// GET /api/inventory/stats/summary
router.get('/stats/summary', verifyToken, async (req, res) => {
  try {
    const totalItems = await Inventory.count();
    
    const conditionStats = await Inventory.findAll({
      attributes: [
        'condition',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['condition'],
      raw: true
    });

    const categoryStats = await Inventory.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalItems,
        conditionStats,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory statistics',
      error: error.message
    });
  }
});

module.exports = router;