const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  job_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fax: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Profile_Image: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'Profile_Image' // Kolon adını açıkça belirt
  },
  thema_color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#20c997'
  },
  qr_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  custom_url: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  goruntulenme: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  ekleme_limiti: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  company_logo: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Şirket logosu dosya yolu'
  },
  password_changed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Kullanıcının şifresini değiştirip değiştirmediği'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_users_email',
      fields: ['email']
    },
    {
      name: 'idx_users_custom_url',
      fields: ['custom_url']
    },
    {
      name: 'idx_users_parent_id',
      fields: ['parent_id']
    },
    {
      name: 'idx_users_admin_id',
      fields: ['admin_id']
    }
  ]
});

module.exports = User;