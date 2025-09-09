const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Event, EventItem, Inventory, Location, User } = require('../models');
const { verifyToken, requireAdminOrSupervisor } = require('../middleware/auth');

const router = express.Router();

// GET /api/events
router.get('/', verifyToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().notEmpty().withMessage('Type cannot be empty'),
  query('status').optional().notEmpty().withMessage('Status cannot be empty')
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
      type, 
      status, 
      locationId 
    } = req.query;

    const where = {};
    
    if (search) {
      where.$or = [
        { name: { $like: `%${search}%` } },
        { description: { $like: `%${search}%` } },
        { responsible: { $like: `%${search}%` } }
      ];
    }
    
    if (type) where.type = type;
    if (status) where.status = status;
    if (locationId) where.locationId = locationId;

    const offset = (page - 1) * limit;

    const { count, rows: events } = await Event.findAndCountAll({
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
        },
        {
          model: EventItem,
          as: 'eventItems',
          include: [
            {
              model: Inventory,
              as: 'inventory',
              attributes: ['id', 'name', 'category']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['startDate', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get events',
      error: error.message
    });
  }
});

// GET /api/events/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: Location,
          as: 'location'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        },
        {
          model: EventItem,
          as: 'eventItems',
          include: [
            {
              model: Inventory,
              as: 'inventory'
            },
            {
              model: User,
              as: 'assignedByUser',
              attributes: ['id', 'fullName', 'username']
            }
          ]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get event',
      error: error.message
    });
  }
});

// POST /api/events
router.post('/', verifyToken, requireAdminOrSupervisor, [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['ujian', 'pelatihan', 'workshop', 'rapat', 'seminar', 'others']).withMessage('Invalid type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('responsible').notEmpty().withMessage('Responsible person is required')
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

    // Validate date range
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user.id
    };

    const event = await Event.create(eventData);

    // Fetch the created event with associations
    const createdEvent = await Event.findByPk(event.id, {
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
      message: 'Event created successfully',
      data: { event: createdEvent }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// PUT /api/events/:id
router.put('/:id', verifyToken, requireAdminOrSupervisor, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn(['ujian', 'pelatihan', 'workshop', 'rapat', 'seminar', 'others']).withMessage('Invalid type'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('status').optional().isIn(['scheduled', 'active', 'completed', 'cancelled']).withMessage('Invalid status')
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

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validate date range if both dates are provided
    if (req.body.startDate && req.body.endDate) {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      
      if (endDate < startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    await event.update(req.body);

    // Fetch the updated event with associations
    const updatedEvent = await Event.findByPk(event.id, {
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
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
});

// DELETE /api/events/:id
router.delete('/:id', verifyToken, requireAdminOrSupervisor, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete related event items first
    await EventItem.destroy({ where: { eventId: id } });
    
    await event.destroy();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// POST /api/events/:id/items (Assign inventory to event)
router.post('/:id/items', verifyToken, requireAdminOrSupervisor, [
  body('inventoryId').isInt().withMessage('Inventory ID is required'),
  body('quantityUsed').isInt({ min: 1 }).withMessage('Quantity used must be at least 1'),
  body('conditionBefore').isIn(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']).withMessage('Invalid condition')
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

    const { id: eventId } = req.params;
    const { inventoryId, quantityUsed, conditionBefore, notes } = req.body;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if inventory exists and has sufficient quantity
    const inventory = await Inventory.findByPk(inventoryId);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    if (inventory.quantity < quantityUsed) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient inventory quantity'
      });
    }

    // Check if item is already assigned to this event
    const existingAssignment = await EventItem.findOne({
      where: { eventId, inventoryId }
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Item is already assigned to this event'
      });
    }

    // Create event item assignment
    const eventItem = await EventItem.create({
      eventId,
      inventoryId,
      quantityUsed,
      conditionBefore,
      notes,
      assignedBy: req.user.id
    });

    // Update inventory quantity
    await inventory.update({
      quantity: inventory.quantity - quantityUsed
    });

    // Fetch the created event item with associations
    const createdEventItem = await EventItem.findByPk(eventItem.id, {
      include: [
        {
          model: Inventory,
          as: 'inventory'
        },
        {
          model: User,
          as: 'assignedByUser',
          attributes: ['id', 'fullName', 'username']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Item assigned to event successfully',
      data: { eventItem: createdEventItem }
    });
  } catch (error) {
    console.error('Assign item to event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign item to event',
      error: error.message
    });
  }
});

// PUT /api/events/:id/items/:itemId (Update item condition after event)
router.put('/:id/items/:itemId', verifyToken, requireAdminOrSupervisor, [
  body('conditionAfter').isIn(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']).withMessage('Invalid condition')
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

    const { id: eventId, itemId } = req.params;
    const { conditionAfter, notes, returnedDate } = req.body;

    const eventItem = await EventItem.findOne({
      where: { id: itemId, eventId },
      include: [
        {
          model: Inventory,
          as: 'inventory'
        }
      ]
    });

    if (!eventItem) {
      return res.status(404).json({
        success: false,
        message: 'Event item not found'
      });
    }

    // Update event item
    await eventItem.update({
      conditionAfter,
      notes: notes || eventItem.notes,
      returnedDate: returnedDate || new Date()
    });

    // Update inventory condition and return quantity
    await eventItem.inventory.update({
      condition: conditionAfter,
      quantity: eventItem.inventory.quantity + eventItem.quantityUsed
    });

    // Fetch the updated event item
    const updatedEventItem = await EventItem.findByPk(eventItem.id, {
      include: [
        {
          model: Inventory,
          as: 'inventory'
        },
        {
          model: User,
          as: 'assignedByUser',
          attributes: ['id', 'fullName', 'username']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Item condition updated successfully',
      data: { eventItem: updatedEventItem }
    });
  } catch (error) {
    console.error('Update item condition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item condition',
      error: error.message
    });
  }
});

module.exports = router;