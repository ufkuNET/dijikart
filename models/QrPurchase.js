const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QrPurchase = sequelize.define('QrPurchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Satın alınan QR kod adedi'
  },
  old_limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Satın alma öncesi limit'
  },
  new_limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Satın alma sonrası limit'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'qr_purchases',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = QrPurchase; 