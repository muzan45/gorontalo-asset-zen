const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Furniture', 'Electronics', 'Tools', 'Vehicles', 'Books', 'Equipment', 'Others'),
    allowNull: false
  },
  specification: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  brand: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'serial_number'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  condition: {
    type: DataTypes.ENUM('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'),
    allowNull: false,
    defaultValue: 'Baik'
  },
  acquisitionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'acquisition_date'
  },
  acquisitionValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'acquisition_value'
  },
  responsible: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  qrCode: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'qr_code'
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
  tableName: 'inventory'
});

module.exports = Inventory;