const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalesAnalytics = sequelize.define('SalesAnalytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Analiz tarihi'
  },
  total_sales: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Toplam satış tutarı'
  },
  total_orders: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Toplam sipariş sayısı'
  },
  total_customers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Toplam müşteri sayısı'
  },
  average_order_value: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Ortalama sipariş tutarı'
  },
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'İade tutarı'
  },
  refund_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'İade sayısı'
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
  tableName: 'sales_analytics',
  timestamps: false,
  indexes: [
    { fields: ['date'] }
  ]
});

module.exports = SalesAnalytics; 