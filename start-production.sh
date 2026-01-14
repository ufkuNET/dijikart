#!/bin/bash

# DijiKart Production Startup Script
# Bu script production ortamında uygulamayı başlatır

echo "🚀 DijiKart Production Startup Script"
echo "======================================"

# Environment kontrolü
if [ ! -f .env ]; then
    echo "❌ .env dosyası bulunamadı!"
    echo "📝 env.example dosyasını .env olarak kopyalayın ve gerekli değerleri düzenleyin"
    exit 1
fi

# Node.js versiyon kontrolü
NODE_VERSION=$(node -v)
echo "📦 Node.js versiyonu: $NODE_VERSION"

# Bağımlılıkları kontrol et
if [ ! -d "node_modules" ]; then
    echo "📦 Bağımlılıklar yükleniyor..."
    npm install --production
fi

# Database bağlantısını test et
echo "🔍 Database bağlantısı test ediliyor..."
node -e "
const sequelize = require('./config/database');
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database bağlantısı başarılı');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database bağlantı hatası:', err.message);
    process.exit(1);
  });
"

if [ $? -ne 0 ]; then
    echo "❌ Database bağlantısı başarısız!"
    exit 1
fi

# Log klasörünü oluştur
mkdir -p logs

# Production modunda başlat
echo "🚀 Uygulama production modunda başlatılıyor..."
echo "📊 Port: ${PORT:-3000}"
echo "🌍 Environment: production"
echo "🔒 Güvenlik: Aktif"
echo "📝 Logging: Production optimized"

# Uygulamayı başlat
NODE_ENV=production node server.js
