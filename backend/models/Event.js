const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('ujian', 'pelatihan', 'workshop', 'rapat', 'seminar', 'others'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'active', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  participants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  responsible: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'location_id',
    references: {
      model: 'locations',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'events'
});

module.exports = Event;