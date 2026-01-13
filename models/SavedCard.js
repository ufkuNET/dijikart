const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedCard = sequelize.define('SavedCard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  last4: {
    type: DataTypes.STRING(4),
    allowNull: false
  },
  expiry_month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expiry_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  holder_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  provider_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'saved_cards',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { name: 'idx_saved_cards_user_id', fields: ['user_id'] },
    { name: 'idx_saved_cards_default', fields: ['user_id', 'is_default'] }
  ]
});

module.exports = SavedCard;



