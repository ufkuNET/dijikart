const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerSegmentation = sequelize.define('CustomerSegmentation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Kullanıcı ID'
  },
  user_type: {
    type: DataTypes.ENUM('user', 'kullanici', 'unified'),
    allowNull: false,
    comment: 'Kullanıcı tipi'
  },
  segment: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum', 'vip'),
    allowNull: false,
    defaultValue: 'bronze',
    comment: 'Müşteri segmenti (bronze, silver, gold, platinum, vip)'
  },
  total_spent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Toplam harcama'
  },
  order_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Sipariş sayısı'
  },
  last_order_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Son sipariş tarihi'
  },
  avg_order_value: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Ortalama sipariş değeri'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'customer_segmentation',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['segment'] },
    { fields: ['total_spent'] }
  ]
});

// İlişkileri tanımla (opsiyonel)
CustomerSegmentation.associate = function(models) {
  // İlişki tanımları burada yapılabilir
};

module.exports = CustomerSegmentation; 