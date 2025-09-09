const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Location, Inventory } = require('../models');
const { verifyToken, requireAdminOrSupervisor } = require('../middleware/auth');

const router = express.Router();

// GET /api/locations
router.get('/', verifyToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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
      building,
      isActive 
    } = req.query;

    const where = {};
    
    if (search) {
      where.$or = [
        { name: { $like: `%${search}%` } },
        { description: { $like: `%${search}%` } },
        { building: { $like: `%${search}%` } }
      ];
    }
    
    if (building) where.building = building;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const offset = (page - 1) * limit;

    const { count, rows: locations } = await Location.findAndCountAll({
      where,
      include: [
        {
          model: Inventory,
          as: 'inventoryItems',
          attributes: ['id', 'name', 'category', 'condition']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        locations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get locations',
      error: error.message
    });
  }
});

// GET /api/locations/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByPk(id, {
      include: [
        {
          model: Inventory,
          as: 'inventoryItems'
        }
      ]
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: { location }
    });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get location',
      error: error.message
    });
  }
});

// POST /api/locations
router.post('/', verifyToken, requireAdminOrSupervisor, [
  body('name').notEmpty().withMessage('Name is required'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a non-negative integer')
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

    // Check if location with same name already exists
    const existingLocation = await Location.findOne({
      where: { name: req.body.name }
    });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'Location with this name already exists'
      });
    }

    const location = await Location.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: { location }
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create location',
      error: error.message
    });
  }
});

// PUT /api/locations/:id
router.put('/:id', verifyToken, requireAdminOrSupervisor, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a non-negative integer')
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

    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Check if name is being changed and if it conflicts with existing location
    if (req.body.name && req.body.name !== location.name) {
      const existingLocation = await Location.findOne({
        where: { 
          name: req.body.name,
          id: { $ne: id }
        }
      });

      if (existingLocation) {
        return res.status(400).json({
          success: false,
          message: 'Location with this name already exists'
        });
      }
    }

    await location.update(req.body);

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: { location }
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
});

// DELETE /api/locations/:id
router.delete('/:id', verifyToken, requireAdminOrSupervisor, async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByPk(id, {
      include: [
        {
          model: Inventory,
          as: 'inventoryItems'
        }
      ]
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Check if location has inventory items
    if (location.inventoryItems && location.inventoryItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete location that contains inventory items. Please move or delete the items first.'
      });
    }

    await location.destroy();

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete location',
      error: error.message
    });
  }
});

// GET /api/locations/stats/summary
router.get('/stats/summary', verifyToken, async (req, res) => {
  try {
    const totalLocations = await Location.count({ where: { isActive: true } });
    
    const locationStats = await Location.findAll({
      attributes: [
        'id',
        'name',
        'building',
        [sequelize.fn('COUNT', sequelize.col('inventoryItems.id')), 'itemCount']
      ],
      include: [
        {
          model: Inventory,
          as: 'inventoryItems',
          attributes: []
        }
      ],
      group: ['Location.id'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalLocations,
        locationStats
      }
    });
  } catch (error) {
    console.error('Get location stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get location statistics',
      error: error.message
    });
  }
});

module.exports = router;