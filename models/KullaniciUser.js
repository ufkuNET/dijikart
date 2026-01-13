const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KullaniciUser = sequelize.define('KullaniciUser', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  goruntulenme: { type: DataTypes.INTEGER, defaultValue: 0 },
  firstname: { type: DataTypes.STRING, allowNull: false },
  lastname: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false },
  job_title: { type: DataTypes.STRING, allowNull: true },
  company: { type: DataTypes.STRING, allowNull: true },
  company_logo: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  fax: { type: DataTypes.STRING, allowNull: true },
  website: { type: DataTypes.STRING, allowNull: true },
  thema_color: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  profile_image: { type: DataTypes.STRING, allowNull: true },
  qr_code: { type: DataTypes.STRING, allowNull: true },
  custom_url: { type: DataTypes.STRING, allowNull: true, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  parent_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'kullanici_users',
  timestamps: false,
  indexes: [
    {
      name: 'idx_kullanici_users_email',
      fields: ['email']
    },
    {
      name: 'idx_kullanici_users_custom_url',
      fields: ['custom_url']
    },
    {
      name: 'idx_kullanici_users_parent_id',
      fields: ['parent_id']
    }
  ]
});

module.exports = KullaniciUser; 