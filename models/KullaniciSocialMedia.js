const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KullaniciSocialMedia = sequelize.define('KullaniciSocialMedia', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  kullanici_user_id: { type: DataTypes.INTEGER, allowNull: false },
  platform: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'kullanici_social_media',
  timestamps: false
});

module.exports = KullaniciSocialMedia; 