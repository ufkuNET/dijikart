const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MailTracking = sequelize.define('MailTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mail_log_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'mail_logs',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tracking_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  opened_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  opened_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clicked_links: {
    type: DataTypes.JSON,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'mail_tracking',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = MailTracking;

