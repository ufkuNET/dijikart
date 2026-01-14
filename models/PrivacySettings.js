const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrivacySettings = sequelize.define('PrivacySettings', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  show_phone: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_email: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_address: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_website: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_fax: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_job_title: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_company: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_social_media: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_profile_image: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'privacy_settings',
  timestamps: false,
  indexes: [
    {
      name: 'idx_privacy_settings_user_id',
      fields: ['user_id']
    }
  ]
});

module.exports = PrivacySettings; 