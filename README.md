# 🚀 DijiKart - QR Kod Yönetim ve Sosyal Medya Platformu

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![Iyzico](https://img.shields.io/badge/Iyzico-Payment-9C27B0.svg)](https://www.iyzico.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🏗️ Sistem Mimarisi](#️-sistem-mimarisi)
- [📦 Kurulum](#-kurulum)
- [⚙️ Konfigürasyon](#️-konfigürasyon)
- [🚀 Kullanım](#-kullanım)
- [🔧 API Dokümantasyonu](#-api-dokümantasyonu)
- [💳 Ödeme Sistemi](#-ödeme-sistemi)
- [🔒 Güvenlik](#-güvenlik)
- [📊 Veritabanı](#-veritabanı)
- [🧪 Test](#-test)
- [📈 Monitoring ve Logging](#-monitoring-ve-logging)
- [🛠️ Geliştirme](#️-geliştirme)
- [🚀 Production Deployment](#-production-deployment)
- [📞 Destek](#-destek)

## 🎯 Proje Hakkında

**DijiKart**, modern bir QR kod yönetim ve sosyal medya platformudur. Kullanıcıların dijital kartlarını oluşturmasına, sosyal medya hesaplarını yönetmesine ve QR kodlar aracılığıyla etkileşim kurmasına olanak tanır.

### 🎯 Ana Hedefler
- **Dijital Kart Yönetimi**: Kullanıcıların profesyonel dijital kartlarını oluşturması
- **Sosyal Medya Entegrasyonu**: Tüm sosyal medya platformlarıyla entegrasyon
- **QR Kod Sistemi**: Dinamik QR kodlar ile kolay paylaşım
- **Ödeme Sistemi**: Iyzico entegrasyonu ile güvenli ödemeler
- **Analitik**: Detaylı kullanıcı ve satış analitikleri

## ✨ Özellikler

### 🎨 Kullanıcı Özellikleri
- ✅ **Dijital Kart Oluşturma**: Profesyonel dijital kartlar
- ✅ **Sosyal Medya Entegrasyonu**: Instagram, Twitter, LinkedIn, Facebook
- ✅ **QR Kod Yönetimi**: Dinamik QR kodlar
- ✅ **Profil Düzenleme**: Gelişmiş profil yönetimi
- ✅ **Kişi Yönetimi**: Kişi listesi ve kategorileri
- ✅ **Bildirim Sistemi**: Gerçek zamanlı bildirimler
- ✅ **Gizlilik Ayarları**: Detaylı gizlilik kontrolü

### 💳 Ödeme Sistemi
- ✅ **Iyzico Entegrasyonu**: Güvenli ödeme işlemleri
- ✅ **3D Secure**: PCI DSS uyumlu güvenlik
- ✅ **Kart Kaydetme**: Güvenli kart saklama
- ✅ **Paket Sistemi**: Farklı özellik paketleri
- ✅ **Kupon Sistemi**: İndirim kuponları
- ✅ **Ödeme Geçmişi**: Detaylı ödeme kayıtları

### 👨‍💼 Admin Paneli
- ✅ **Kullanıcı Yönetimi**: Kullanıcı CRUD işlemleri
- ✅ **Analitik Dashboard**: Detaylı istatistikler
- ✅ **Ödeme Takibi**: Ödeme durumu izleme
- ✅ **Sistem Logları**: Güvenlik ve performans logları
- ✅ **Mail Yönetimi**: Toplu mail gönderimi
- ✅ **Raporlama**: Excel/PDF raporları

### 🔒 Güvenlik Özellikleri
- ✅ **JWT Authentication**: Güvenli oturum yönetimi
- ✅ **Rate Limiting**: API koruma
- ✅ **CSRF Protection**: Cross-site request forgery koruması
- ✅ **SQL Injection Protection**: Veritabanı güvenliği
- ✅ **XSS Protection**: Cross-site scripting koruması
- ✅ **Input Validation**: Giriş verisi doğrulama
- ✅ **Audit Logging**: Güvenlik denetim kayıtları

## 🏗️ Sistem Mimarisi

### 📁 Proje Yapısı
```
dijikart/
├── config/                 # Konfigürasyon dosyaları
│   ├── database.js        # Veritabanı bağlantısı
│   ├── mail.js           # Mail konfigürasyonu
│   └── mail-backup.js    # Yedek mail ayarları
├── middleware/            # Express middleware'leri
│   ├── auth.js           # Kimlik doğrulama
│   ├── security.js       # Güvenlik middleware'leri
│   ├── validation.js     # Veri doğrulama
│   └── rateLimit.js      # Rate limiting
├── models/               # Sequelize modelleri
│   ├── User.js          # Kullanıcı modeli
│   ├── Payment.js       # Ödeme modeli
│   ├── SocialMedia.js   # Sosyal medya modeli
│   └── ...              # Diğer modeller
├── routes/               # API route'ları
│   ├── auth.js          # Kimlik doğrulama
│   ├── kullanici.js     # Kullanıcı işlemleri
│   ├── payment.js       # Ödeme işlemleri
│   └── admin.js         # Admin paneli
├── views/               # EJS template'leri
│   ├── kullanici-*.ejs  # Kullanıcı sayfaları
│   ├── admin-*.ejs      # Admin sayfaları
│   └── public-*.ejs     # Genel sayfalar
├── utils/               # Yardımcı fonksiyonlar
│   ├── logger.js        # Loglama sistemi
│   ├── qrCodeGenerator.js # QR kod oluşturucu
│   └── paymentProvider.js # Ödeme sağlayıcısı
├── tools/               # Yardımcı araçlar
│   ├── create-admin.js  # Admin oluşturucu
│   └── security-audit.js # Güvenlik denetimi
├── sql/                 # Veritabanı scriptleri
│   ├── 01_ana_tablolar.sql
│   ├── 02_sosyal_medya_tablolari.sql
│   └── ...              # Diğer SQL dosyaları
└── logs/                # Log dosyaları
```

### 🔄 Teknoloji Stack'i
- **Backend**: Node.js, Express.js
- **Veritabanı**: MySQL/MariaDB
- **ORM**: Sequelize
- **Template Engine**: EJS
- **Ödeme**: Iyzico
- **Güvenlik**: Helmet, bcrypt, JWT
- **Logging**: Winston
- **Mail**: Nodemailer
- **QR Kod**: qrcode, canvas

## 📦 Kurulum

### 🎯 Gereksinimler
- **Node.js**: 18.0.0 veya üzeri
- **MySQL**: 8.0 veya üzeri
- **npm**: 9.0.0 veya üzeri
- **Git**: 2.30.0 veya üzeri

### 🚀 Hızlı Kurulum

#### 1. Projeyi İndirin
```bash
git clone https://github.com/your-username/dijikart.git
cd dijikart
```

#### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

#### 3. Veritabanını Kurun
```bash
# MySQL'e bağlanın
mysql -u root -p

# Veritabanını oluşturun
CREATE DATABASE qrtoo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# SQL dosyalarını çalıştırın (sırayla)
source sql/01_ana_tablolar.sql
source sql/02_sosyal_medya_tablolari.sql
source sql/03_odeme_paket_tablolari.sql
source sql/04_log_takip_tablolari.sql
source sql/05_mail_tracking_tablolari.sql
source sql/06_analitik_tablolari.sql
source sql/07_diger_tablolari.sql
source sql/08_viewler.sql
source sql/09_stored_procedures.sql
```

#### 4. Konfigürasyon
```bash
# .env dosyasını oluşturun
cp env.example .env

# .env dosyasını düzenleyin
nano .env
```

#### 5. Admin Kullanıcısı Oluşturun
```bash
node tools/create-admin.js
```

#### 6. Uygulamayı Başlatın
```bash
# Geliştirme modu
npm run dev

# Production modu
npm start
```

### 🔧 Detaylı Kurulum

#### Veritabanı Kurulumu
```bash
# MySQL kurulumu (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server

# MySQL kurulumu (CentOS/RHEL)
sudo yum install mysql-server

# MySQL kurulumu (Windows)
# MySQL Installer'ı indirin ve kurun

# MySQL servisini başlatın
sudo systemctl start mysql
sudo systemctl enable mysql

# Güvenlik ayarları
sudo mysql_secure_installation
```

#### Node.js Kurulumu
```bash
# Node.js kurulumu (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Node.js kurulumu (CentOS/RHEL)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Node.js kurulumu (Windows)
# Node.js installer'ı indirin ve kurun
```

## ⚙️ Konfigürasyon

### 🔐 Environment Variables

#### Temel Konfigürasyon
```env
# Veritabanı Konfigürasyonu
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qrtoo
DB_USER=root
DB_PASSWORD=your_password

# Session Konfigürasyonu
SESSION_SECRET=your_super_secret_session_key_here_make_it_long_and_random_at_least_32_characters

# Admin Konfigürasyonu
ADMIN_PASSWORD=your_secure_admin_password_here

# Server Konfigürasyonu
PORT=3000
NODE_ENV=production
```

#### Iyzico Ödeme Konfigürasyonu
```env
# Iyzico Konfigürasyonu
PAYMENT_PROVIDER=iyzico
IYZICO_API_KEY=your_api_key_here
IYZICO_SECRET_KEY=your_secret_key_here
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Test ortamı için:
# IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Production ortamı için:
# IYZICO_BASE_URL=https://api.iyzipay.com
```

#### Mail Konfigürasyonu
```env
# Mail Konfigürasyonu
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password
```

#### Güvenlik Konfigürasyonu
```env
# Güvenlik Ayarları
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=3
LOGIN_RATE_LIMIT_WINDOW_MS=300000

# SSL Konfigürasyonu (Production)
SSL_ENABLED=true
SSL_KEY_PATH=/path/to/private.key
SSL_CERT_PATH=/path/to/certificate.crt
```

### 🔧 Konfigürasyon Dosyaları

#### Database Konfigürasyonu (`config/database.js`)
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    }
  }
);

module.exports = sequelize;
```

#### Mail Konfigürasyonu (`config/mail.js`)
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

module.exports = transporter;
```

## 🚀 Kullanım

### 👤 Kullanıcı Paneli

#### 1. Kayıt ve Giriş
```bash
# Tarayıcıda açın
http://localhost:3000

# Kayıt olun veya giriş yapın
```

#### 2. Profil Oluşturma
1. **Kişisel Bilgiler**: Ad, soyad, telefon, email
2. **Sosyal Medya**: Instagram, Twitter, LinkedIn, Facebook
3. **Profil Fotoğrafı**: Profil resmi yükleme
4. **Hakkımda**: Kişisel açıklama

#### 3. QR Kod Oluşturma
1. **Paket Seçimi**: Ücretsiz veya premium paket
2. **QR Kod Oluşturma**: Otomatik QR kod oluşturma
3. **Paylaşım**: QR kod paylaşım linkleri

#### 4. Kişi Yönetimi
1. **Kişi Ekleme**: Yeni kişi ekleme
2. **Kategoriler**: Kişi kategorileri
3. **Arama**: Kişi arama ve filtreleme

### 👨‍💼 Admin Paneli

#### 1. Admin Girişi
```bash
# Admin paneline erişim
http://localhost:3000/admin

# Admin bilgileri
Email: admin@dijikart.com
Password: (kurulum sırasında belirlediğiniz)
```

#### 2. Kullanıcı Yönetimi
- **Kullanıcı Listesi**: Tüm kullanıcıları görüntüleme
- **Kullanıcı Düzenleme**: Kullanıcı bilgilerini güncelleme
- **Kullanıcı Silme**: Kullanıcı hesabını silme
- **Kullanıcı Detayları**: Detaylı kullanıcı bilgileri

#### 3. Analitik Dashboard
- **Kullanıcı İstatistikleri**: Kayıt, aktif kullanıcı sayıları
- **Ödeme İstatistikleri**: Gelir, ödeme başarı oranları
- **QR Kod İstatistikleri**: QR kod kullanım istatistikleri
- **Sosyal Medya İstatistikleri**: Platform kullanım oranları

#### 4. Sistem Yönetimi
- **Log Yönetimi**: Sistem loglarını görüntüleme
- **Mail Yönetimi**: Toplu mail gönderimi
- **Güvenlik**: Güvenlik ayarları ve denetimleri
- **Yedekleme**: Veritabanı yedekleme

## 🔧 API Dokümantasyonu

### 🔐 Kimlik Doğrulama

#### Kullanıcı Girişi
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Kullanıcı Kaydı
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+905551234567"
}
```

### 👤 Kullanıcı API'leri

#### Profil Güncelleme
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+905551234567",
  "bio": "Software Developer"
}
```

#### Sosyal Medya Ekleme
```http
POST /api/user/social-media
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "instagram",
  "username": "johndoe",
  "url": "https://instagram.com/johndoe"
}
```

### 💳 Ödeme API'leri

#### Ödeme Başlatma
```http
POST /api/payment/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "packageId": 1,
  "amount": 99.99,
  "currency": "TRY"
}
```

#### Kart Kaydetme
```http
POST /api/payment/save-card
Authorization: Bearer <token>
Content-Type: application/json

{
  "cardNumber": "5528790000000008",
  "expiryMonth": "12",
  "expiryYear": "2030",
  "cvv": "123"
}
```

### 👨‍💼 Admin API'leri

#### Kullanıcı Listesi
```http
GET /api/admin/users?page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Kullanıcı Düzenleme
```http
PUT /api/admin/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "status": "active"
}
```

## 💳 Ödeme Sistemi

### 🏦 Iyzico Entegrasyonu

#### Kurulum
1. **Iyzico Hesabı**: [Iyzico](https://www.iyzico.com) hesabı oluşturun
2. **API Anahtarları**: Test ve production API anahtarlarını alın
3. **Konfigürasyon**: `.env` dosyasına API bilgilerini ekleyin

#### Test Kartları
```bash
# VISA Test Kartı
Kart No: 5528790000000008
SKT: 12/30
CVV: 123

# 3D Secure Test Kartı
Kart No: 4111111111111129
SKT: 12/30
CVV: 123
```

#### Ödeme Akışı
1. **Kart Bilgileri**: Kullanıcı kart bilgilerini girer
2. **Iyzico'ya Gönderim**: Kart bilgileri Iyzico'ya gönderilir
3. **3D Secure**: Gerekirse 3D Secure doğrulaması
4. **Ödeme Tamamlama**: Başarılı ödeme sonrası işlemler
5. **Kart Kaydetme**: İsteğe bağlı kart kaydetme

### 📦 Paket Sistemi

#### Ücretsiz Paket
- ✅ Temel QR kod oluşturma
- ✅ 5 sosyal medya hesabı
- ✅ Temel profil özellikleri
- ❌ Gelişmiş analitikler
- ❌ Özel tasarımlar

#### Premium Paket (99.99 TL)
- ✅ Sınırsız QR kod oluşturma
- ✅ Sınırsız sosyal medya hesabı
- ✅ Gelişmiş profil özellikleri
- ✅ Detaylı analitikler
- ✅ Özel tasarımlar
- ✅ Öncelikli destek

#### Pro Paket (199.99 TL)
- ✅ Premium özellikler
- ✅ API erişimi
- ✅ Beyaz etiket çözümü
- ✅ Özel entegrasyonlar
- ✅ 7/24 destek

## 🔒 Güvenlik

### 🛡️ Güvenlik Önlemleri

#### Kimlik Doğrulama
- **JWT Tokens**: Güvenli token tabanlı kimlik doğrulama
- **Session Management**: Güvenli oturum yönetimi
- **Password Hashing**: bcrypt ile şifre hashleme
- **Rate Limiting**: API koruma

#### Veri Güvenliği
- **SQL Injection Protection**: Parametreli sorgular
- **XSS Protection**: Cross-site scripting koruması
- **CSRF Protection**: Cross-site request forgery koruması
- **Input Validation**: Giriş verisi doğrulama

#### Ödeme Güvenliği
- **PCI DSS Compliance**: Kredi kartı güvenlik standardı
- **3D Secure**: 3D Secure doğrulama
- **Tokenization**: Kart verisi tokenleme
- **Encryption**: Veri şifreleme

### 🔍 Güvenlik Denetimi

#### Güvenlik Kontrolü
```bash
# Güvenlik denetimi çalıştırın
npm run security-audit

# Güvenlik açıklarını kontrol edin
npm audit
```

#### Güvenlik Raporu
```bash
# Güvenlik raporu oluşturun
node tools/security-audit.js
```

## 📊 Veritabanı

### 🗄️ Veritabanı Şeması

#### Ana Tablolar
- **users**: Kullanıcı bilgileri
- **social_media**: Sosyal medya hesapları
- **payments**: Ödeme kayıtları
- **qr_purchases**: QR kod satın alımları
- **saved_cards**: Kayıtlı kartlar

#### Log Tabloları
- **audit_logs**: Güvenlik denetim kayıtları
- **admin_logs**: Admin işlem kayıtları
- **mail_logs**: Mail gönderim kayıtları
- **mail_tracking**: Mail takip kayıtları

#### Analitik Tabloları
- **sales_analytics**: Satış analitikleri
- **customer_segmentation**: Müşteri segmentasyonu
- **user_relations**: Kullanıcı ilişkileri

### 🔄 Veritabanı Yönetimi

#### Yedekleme
```bash
# Veritabanı yedeği alın
mysqldump -u root -p qrtoo > backup_$(date +%Y%m%d_%H%M%S).sql

# Yedekten geri yükleme
mysql -u root -p qrtoo < backup_file.sql
```

#### Migration
```bash
# Sequelize migration çalıştırın
npx sequelize-cli db:migrate

# Migration geri alın
npx sequelize-cli db:migrate:undo
```

## 🧪 Test

### 🧪 Test Senaryoları

#### Birim Testleri
```bash
# Test çalıştırın
npm test

# Test coverage
npm run test:coverage
```

#### Entegrasyon Testleri
```bash
# API testleri
npm run test:api

# Ödeme testleri
npm run test:payment
```

#### Güvenlik Testleri
```bash
# Güvenlik testleri
npm run test:security

# Penetrasyon testleri
npm run test:penetration
```

### 🧪 Test Verileri

#### Test Kullanıcıları
```javascript
// Test kullanıcısı
{
  email: "test@example.com",
  password: "test123",
  name: "Test User"
}

// Admin kullanıcısı
{
  email: "admin@dijikart.com",
  password: "admin123",
  role: "admin"
}
```

#### Test Ödemeleri
```javascript
// Test ödeme kartı
{
  cardNumber: "5528790000000008",
  expiryMonth: "12",
  expiryYear: "2030",
  cvv: "123"
}
```

## 📈 Monitoring ve Logging

### 📊 Logging Sistemi

#### Log Seviyeleri
- **ERROR**: Hata logları
- **WARN**: Uyarı logları
- **INFO**: Bilgi logları
- **DEBUG**: Debug logları

#### Log Dosyaları
```bash
# Uygulama logları
logs/app.log

# Hata logları
logs/error.log

# Ödeme logları
logs/payment.log

# Güvenlik logları
logs/security.log
```

### 📈 Monitoring

#### Performans İzleme
```javascript
// Response time izleme
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Request completed in ${duration}ms`);
  });
  next();
});
```

#### Sistem Sağlığı
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 🛠️ Geliştirme

### 🔧 Geliştirme Ortamı

#### Gerekli Araçlar
- **VS Code**: Kod editörü
- **Postman**: API test aracı
- **MySQL Workbench**: Veritabanı yönetimi
- **Git**: Versiyon kontrolü

#### Geliştirme Komutları
```bash
# Geliştirme sunucusu
npm run dev

# Kod formatı
npm run format

# Linting
npm run lint

# Test
npm test
```

### 📝 Kod Standartları

#### JavaScript Standartları
```javascript
// ES6+ kullanın
const user = await User.findByPk(id);

// Async/await kullanın
async function getUser(id) {
  try {
    return await User.findByPk(id);
  } catch (error) {
    logger.error('User fetch error:', error);
    throw error;
  }
}

// Error handling
try {
  // işlem
} catch (error) {
  logger.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

#### Veritabanı Standartları
```sql
-- İndeksler ekleyin
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Foreign key'ler ekleyin
ALTER TABLE payments ADD CONSTRAINT fk_payments_user 
FOREIGN KEY (user_id) REFERENCES users(id);
```

### 🔄 Git Workflow

#### Branch Stratejisi
```bash
# Feature branch oluşturun
git checkout -b feature/new-feature

# Değişiklikleri commit edin
git add .
git commit -m "feat: add new feature"

# Pull request oluşturun
git push origin feature/new-feature
```

#### Commit Mesajları
```bash
# Commit mesaj formatı
feat: add new payment feature
fix: resolve login issue
docs: update README
style: format code
refactor: improve code structure
test: add unit tests
chore: update dependencies
```

## 🚀 Production Deployment

### 🌐 Production Sunucusu

#### Sunucu Gereksinimleri
- **CPU**: 2+ çekirdek
- **RAM**: 4GB+
- **Disk**: 50GB+ SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+

#### Sunucu Kurulumu
```bash
# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL kurulumu
sudo apt install mysql-server -y

# Nginx kurulumu
sudo apt install nginx -y

# PM2 kurulumu
sudo npm install -g pm2
```

#### Uygulama Deployment
```bash
# Projeyi klonlayın
git clone https://github.com/your-username/dijikart.git
cd dijikart

# Bağımlılıkları yükleyin
npm install --production

# Environment dosyasını oluşturun
cp env.example .env
nano .env

# Veritabanını kurun
mysql -u root -p < sql/00_komple_veritabani_kurulum.sql

# PM2 ile başlatın
pm2 start server.js --name "dijikart"

# PM2 startup
pm2 startup
pm2 save
```

### 🔒 SSL Sertifikası

#### Let's Encrypt Kurulumu
```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx -y

# SSL sertifikası alın
sudo certbot --nginx -d yourdomain.com

# Otomatik yenileme
sudo crontab -e
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 📊 Nginx Konfigürasyonu

#### Nginx Config
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🔄 CI/CD Pipeline

#### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to server
      run: |
        ssh user@server "cd /var/www/dijikart && git pull && npm install && pm2 restart dijikart"
```

## 📞 Destek

### 🆘 Sorun Giderme

#### Yaygın Sorunlar

**1. Veritabanı Bağlantı Hatası**
```bash
# MySQL servisini kontrol edin
sudo systemctl status mysql

# MySQL'i yeniden başlatın
sudo systemctl restart mysql

# Bağlantıyı test edin
mysql -u root -p
```

**2. Port Çakışması**
```bash
# Port kullanımını kontrol edin
sudo netstat -tulpn | grep :3000

# Process'i sonlandırın
sudo kill -9 <PID>
```

**3. Permission Hatası**
```bash
# Dosya izinlerini düzeltin
sudo chown -R $USER:$USER /var/www/dijikart
sudo chmod -R 755 /var/www/dijikart
```

### 📧 İletişim

- **Email**: support@dijikart.com
- **GitHub Issues**: [GitHub Issues](https://github.com/your-username/dijikart/issues)
- **Dokümantasyon**: [Wiki](https://github.com/your-username/dijikart/wiki)

### 📚 Faydalı Linkler

- **Node.js Dokümantasyonu**: https://nodejs.org/docs/
- **Express.js Dokümantasyonu**: https://expressjs.com/
- **Sequelize Dokümantasyonu**: https://sequelize.org/
- **Iyzico API Dokümantasyonu**: https://dev.iyzipay.com/tr
- **MySQL Dokümantasyonu**: https://dev.mysql.com/doc/

---

## 📄 Lisans

Bu proje [ISC License](LICENSE) altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 🙏 Teşekkürler

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [Sequelize](https://sequelize.org/) - ORM
- [Iyzico](https://www.iyzico.com/) - Ödeme sistemi
- [MySQL](https://www.mysql.com/) - Veritabanı

---

**🎉 DijiKart ile dijital dünyada izinizi bırakın!**
