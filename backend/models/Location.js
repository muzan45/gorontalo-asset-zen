const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  building: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  floor: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'room_number'
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'locations'
});

module.exports = Location;