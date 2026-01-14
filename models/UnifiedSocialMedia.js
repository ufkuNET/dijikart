const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnifiedSocialMedia = sequelize.define('UnifiedSocialMedia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Hangi kullanıcıya ait
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'unified_users',
      key: 'id'
    }
  },
  // Sosyal medya platformu
  platform: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Kullanıcı adı
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // URL
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Zaman damgası
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'unified_social_media',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['platform']
    }
  ]
});

module.exports = UnifiedSocialMedia; 