const { Sequelize } = require('sequelize');
require('dotenv').config();

// Production optimizasyonu
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'qrtoo',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // SQL loglarını kapatır
    pool: {
      max: isProduction ? 10 : 5, // Production'da daha fazla bağlantı
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // Veritabanı yoksa oluştur
    dialectOptions: {
      multipleStatements: true,
      // Production optimizasyonları
      ...(isProduction && {
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000
      })
    },
    // Query optimizasyonu
    benchmark: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Bağlantıyı test et
sequelize.authenticate()
  .then(() => {
    if (!isProduction) {
    }
  })
  .catch(err => {
    console.error('❌ MySQL bağlantı hatası:', err);
  });

module.exports = sequelize; 