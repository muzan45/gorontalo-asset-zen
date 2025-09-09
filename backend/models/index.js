const sequelize = require('../config/database');
const User = require('./User');
const Location = require('./Location');
const Inventory = require('./Inventory');
const Event = require('./Event');
const EventItem = require('./EventItem');

// Define associations
// Location associations
Location.hasMany(Inventory, { 
  foreignKey: 'locationId', 
  as: 'inventoryItems' 
});

Location.hasMany(Event, { 
  foreignKey: 'locationId', 
  as: 'events' 
});

// Inventory associations
Inventory.belongsTo(Location, { 
  foreignKey: 'locationId', 
  as: 'location' 
});

Inventory.belongsTo(User, { 
  foreignKey: 'createdBy', 
  as: 'creator' 
});

Inventory.hasMany(EventItem, { 
  foreignKey: 'inventoryId', 
  as: 'eventItems' 
});

// Event associations
Event.belongsTo(Location, { 
  foreignKey: 'locationId', 
  as: 'location' 
});

Event.belongsTo(User, { 
  foreignKey: 'createdBy', 
  as: 'creator' 
});

Event.hasMany(EventItem, { 
  foreignKey: 'eventId', 
  as: 'eventItems' 
});

// EventItem associations
EventItem.belongsTo(Event, { 
  foreignKey: 'eventId', 
  as: 'event' 
});

EventItem.belongsTo(Inventory, { 
  foreignKey: 'inventoryId', 
  as: 'inventory' 
});

EventItem.belongsTo(User, { 
  foreignKey: 'assignedBy', 
  as: 'assignedByUser' 
});

// User associations
User.hasMany(Inventory, { 
  foreignKey: 'createdBy', 
  as: 'createdInventory' 
});

User.hasMany(Event, { 
  foreignKey: 'createdBy', 
  as: 'createdEvents' 
});

User.hasMany(EventItem, { 
  foreignKey: 'assignedBy', 
  as: 'assignedEventItems' 
});

module.exports = {
  sequelize,
  User,
  Location,
  Inventory,
  Event,
  EventItem
};