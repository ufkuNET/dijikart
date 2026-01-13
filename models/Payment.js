const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  package_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Paket adı (Starter, Business, Premium, Enterprise)'
  },
  qr_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Satın alınan QR kod adedi'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Ödeme tutarı (TL)'
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'İndirim tutarı'
  },
  final_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'İndirim sonrası final tutar'
  },
  coupon_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Kullanılan kupon kodu'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending',
    comment: 'Ödeme durumu'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'credit_card',
    comment: 'Ödeme yöntemi'
  },
  card_last4: {
    type: DataTypes.STRING(4),
    allowNull: true,
    comment: 'Kartın son 4 hanesi'
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'İşlem ID (ödeme sağlayıcısından)'
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
  invoice_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Fatura numarası'
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
  tableName: 'payments',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['payment_status'] },
    { fields: ['created_at'] },
    { fields: ['transaction_id'] }
  ]
});

module.exports = Payment; 