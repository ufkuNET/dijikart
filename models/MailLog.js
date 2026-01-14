const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MailLog = sequelize.define('MailLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Maili gönderen admin ID'
  },
  recipient_email: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Alıcı email adresi'
  },
  recipient_name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Alıcı adı'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Mail konusu'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Mail içeriği'
  },
  status: {
    type: DataTypes.ENUM('sent', 'failed', 'pending'),
    defaultValue: 'pending',
    comment: 'Mail durumu: gönderildi, başarısız, bekliyor'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Hata mesajı (varsa)'
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Gönderim tarihi'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'mail_logs',
  timestamps: false,
  indexes: [
    { fields: ['admin_id'] },
    { fields: ['recipient_email'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

// Admin ile ilişki tanımla
const Admin = require('./Admin');
MailLog.belongsTo(Admin, { 
  foreignKey: 'admin_id', 
  as: 'admin',
  targetKey: 'id'
});

module.exports = MailLog;
