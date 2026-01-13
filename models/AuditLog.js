const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    comment: 'İşlemi yapan kullanıcı ID'
  },
  user_type: { 
    type: DataTypes.ENUM('admin', 'user', 'kullanici', 'unified'),
    allowNull: false,
    comment: 'Kullanıcı tipi'
  },
  action: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Yapılan işlem'
  },
  table_name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Etkilenen tablo adı'
  },
  record_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    comment: 'Etkilenen kayıt ID'
  },
  old_values: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    comment: 'Eski değerler (JSON)'
  },
  new_values: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    comment: 'Yeni değerler (JSON)'
  },
  ip_address: { 
    type: DataTypes.STRING(45), 
    allowNull: true,
    comment: 'IP adresi'
  },
  user_agent: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    comment: 'Tarayıcı bilgisi'
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW,
    comment: 'Oluşturulma tarihi'
  }
}, {
  tableName: 'audit_logs',
  timestamps: false,
  indexes: [
    { fields: ['user_id', 'user_type'] },
    { fields: ['action'] },
    { fields: ['table_name'] },
    { fields: ['created_at'] }
  ]
});

module.exports = AuditLog; 