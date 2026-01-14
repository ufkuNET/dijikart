const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRelation = sequelize.define('UserRelation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Kullanıcı ID'
  },
  user_type: {
    type: DataTypes.ENUM('user', 'kullanici', 'unified'),
    allowNull: false,
    comment: 'Kullanıcı tipi'
  },
  related_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'İlişkili kullanıcı ID'
  },
  related_user_type: {
    type: DataTypes.ENUM('user', 'kullanici', 'unified'),
    allowNull: false,
    comment: 'İlişkili kullanıcı tipi'
  },
  relation_type: {
    type: DataTypes.ENUM('friend', 'family', 'colleague', 'business', 'other'),
    allowNull: false,
    defaultValue: 'other',
    comment: 'İlişki tipi'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Aktif mi?'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_relations',
  timestamps: false,
  indexes: [
    { fields: ['relation_type'] },
    { fields: ['is_active'] }
  ]
});

module.exports = UserRelation; 