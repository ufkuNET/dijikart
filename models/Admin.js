const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Ad: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'Ad' // Kolon adını açıkça belirt
  },
  SoyAd: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'SoyAd' // Kolon adını açıkça belirt
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('YÖNETİCİ', 'TAM', 'YARI', 'OKUMA'),
    allowNull: false,
    defaultValue: 'OKUMA'
  },
  ekleyen_ad: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  thema_color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#007bff'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    allowNull: false,
    defaultValue: 'active'
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'admins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Admin; 