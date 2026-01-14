const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnifiedUser = sequelize.define('UnifiedUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Kullanıcı türü: 'admin', 'user', 'contact'
  user_type: {
    type: DataTypes.ENUM('admin', 'user', 'contact'),
    allowNull: false,
    defaultValue: 'user'
  },
  // Rol sistemi (admin için)
  role: {
    type: DataTypes.ENUM('YÖNETİCİ', 'TAM', 'YARI', 'OKUMA'),
    allowNull: true
  },
  // Kimlik bilgileri
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // Kişisel bilgiler
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
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
  // Görsel ve tema
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  thema_color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#20c997'
  },
  // QR kod ve görüntülenme
  qr_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  goruntulenme: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // İlişki sistemi
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'unified_users',
      key: 'id'
    }
  },
  // Limit sistemi
  ekleme_limiti: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  // Zaman damgaları
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'unified_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_type']
    },
    {
      fields: ['parent_id']
    },
    {
      fields: ['qr_code']
    },
    {
      fields: ['email']
    }
  ]
});

module.exports = UnifiedUser; 