const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventItem = sequelize.define('EventItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'event_id',
    references: {
      model: 'events',
      key: 'id'
    }
  },
  inventoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'inventory_id',
    references: {
      model: 'inventory',
      key: 'id'
    }
  },
  quantityUsed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'quantity_used',
    validate: {
      min: 1
    }
  },
  conditionBefore: {
    type: DataTypes.ENUM('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'),
    allowNull: false,
    field: 'condition_before'
  },
  conditionAfter: {
    type: DataTypes.ENUM('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'),
    allowNull: true,
    field: 'condition_after'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'assigned_date'
  },
  returnedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'returned_date'
  },
  assignedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'assigned_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'event_items'
});

module.exports = EventItem;