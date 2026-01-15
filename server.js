require("dotenv").config();

console.log("BOOT OK");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();
const app = express();

// Security Middleware - Güçlendirilmiş
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://kit.fontawesome.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Güvenlik middleware'lerini ekle
const { 
  loginLimiter, 
  apiLimiter, 
  userAgentCheck, 
  requestSizeLimit,
  sqlInjectionProtection,
  xssProtection,
  pathTraversalProtection,
  methodProtection,
  contentTypeProtection,
  sessionProtection,
  securityHeaders,
  securityCheck
} = require('./middleware/security');

// Global güvenlik middleware'leri
app.use(securityHeaders);
app.use(securityCheck);
app.use(userAgentCheck);
app.use(requestSizeLimit);
app.use(methodProtection);
app.use(contentTypeProtection);
app.use(pathTraversalProtection);
app.use(sessionProtection);

// Login route'larına rate limiting
app.use('/login', loginLimiter);
app.use('/login-kullanici', loginLimiter);

// API route'larına rate limiting
app.use('/api', apiLimiter);
app.use('/admin', apiLimiter);
app.use('/payment', apiLimiter);

// SQL Injection ve XSS koruması
app.use(sqlInjectionProtection);
app.use(xssProtection);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://qrtoo.de', 'https://qrtoo.de'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

// Favicon route'u
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});
// ================= SESSION (CSRF için şart) =================
app.use(session({
  secret: process.env.SESSION_SECRET || "devsecret_change_me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  }
}));

// ================= CSRF + CacheControl (SESSION'DAN SONRA) =================
const csrfMiddleware = require("./middleware/csrf");
app.use(csrfMiddleware.csrfProtection);
app.use(csrfMiddleware.addCSRFToken);

const cacheControl = require("./middleware/cacheControl");
app.use(cacheControl.sessionBasedCache);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
  }
});

// Session Ayarları
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dijikart-super-gizli-session-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 saat oturum süresi
      secure: process.env.NODE_ENV === 'production', // HTTPS'de secure
      httpOnly: true, // XSS koruması
      sameSite: 'strict' // CSRF koruması
    },
    name: 'dijikart_session' // Session cookie adı
  })
);

// Logging middleware - Session'dan sonra (sadece production'da)
const logger = require('./utils/logger');
if (process.env.NODE_ENV === 'production') {
  app.use(logger.access);
}



// MySQL bağlantısı
const sequelize = require('./config/database');
const User = require('./models/User');
const Admin = require('./models/Admin');
const QrPurchase = require('./models/QrPurchase');
const Payment = require('./models/Payment');
const Coupon = require('./models/Coupon');
const SalesAnalytics = require('./models/SalesAnalytics');
const CustomerSegmentation = require('./models/CustomerSegmentation');
const PrivacySettings = require('./models/PrivacySettings');
const SocialMedia = require('./models/SocialMedia');
const KullaniciSocialMedia = require('./models/KullaniciSocialMedia');
const SavedCard = require('./models/SavedCard');

// Veritabanı oluştur ve senkronize et
async function initializeDatabase() {
  try {
    // Önce MySQL'e bağlan (veritabanı olmadan)
    const tempSequelize = new (require('sequelize'))(
      'mysql',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
      }
    );

    // Veritabanını oluştur
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'qrtoo'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tempSequelize.close();
    
    logger.info('✅ Veritabanı oluşturuldu');
    
    // Şimdi normal bağlantı ile tabloları oluştur
    await sequelize.sync({ force: false });
    logger.info('✅ Veritabanı tabloları senkronize edildi');
    
    // PrivacySettings tablosunu oluştur
    try {
      await PrivacySettings.sync({ force: false });
      logger.info('✅ PrivacySettings tablosu oluşturuldu');
    } catch (err) {
      logger.error('❌ PrivacySettings tablosu oluşturulamadı:', err.message);
    }

    // SavedCard tablosunu oluştur
    try {
      await SavedCard.sync({ force: false });
      logger.info('✅ SavedCard tablosu oluşturuldu');
    } catch (err) {
      logger.error('❌ SavedCard tablosu oluşturulamadı:', err.message);
    }
    
    // company_logo kolonunu ekle (eğer yoksa)
    try {
      await sequelize.query('ALTER TABLE kullanici_users ADD COLUMN company_logo VARCHAR(255) DEFAULT NULL AFTER company');
              logger.info('✅ company_logo kolonu eklendi');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
                  logger.info('ℹ️ company_logo kolonu zaten mevcut');
      } else {
                  logger.error('ℹ️ company_logo kolonu eklenemedi:', err.message);
      }
    }
    
    // Varsayılan admin kullanıcısı oluştur
    const bcrypt = require('bcrypt');
    const adminCount = await Admin.count();
    
    if (adminCount === 0) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@qrtoo.de'
      });
      logger.info('✅ Varsayılan admin kullanıcısı oluşturuldu');
    }
    
  } catch (err) {
    console.error('❌ Veritabanı başlatma hatası:', err);
  }
}

initializeDatabase();

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const kullaniciRoutes = require("./routes/kullanici");
const kullaniciKisiRoutes = require('./routes/kullanici_kisi');
const paymentRoutes = require('./routes/payment');
const adminAnalyticsRoutes = require('./routes/admin-analytics');
const trackingRoutes = require('./routes/tracking');

// Public kartvizit route'u (SADECE custom_url ile erişim) - EN BAŞTA
app.get('/:slug', async (req, res, next) => {
  // Admin route'larını atla
  if (req.params.slug.startsWith('admin') || 
      req.params.slug.startsWith('kullanici') || 
      req.params.slug.startsWith('payment') ||
      req.params.slug.startsWith('login') ||
      req.params.slug.startsWith('logout') ||
      req.params.slug.startsWith('favicon') ||
      req.params.slug === '') {
    return next();
  }
  
  try {
    const User = require('./models/User');
    const KullaniciUser = require('./models/KullaniciUser');
    const SocialMedia = require('./models/SocialMedia');
    const KullaniciSocialMedia = require('./models/KullaniciSocialMedia');
    const QRCode = require('qrcode');
    const { generateQRWithCompanyLogo } = require('./utils/qrCodeGenerator');
    const { Op } = require('sequelize');
    
    // Debug log kaldırıldı - production optimizasyonu
    
    // Önce User tablosunda ara - SADECE custom_url ile
    let kullanici = await User.findOne({
      where: { custom_url: req.params.slug }
    });
    
    let socialMedias = [];
    let isKullaniciUser = false;
    
    // Eğer User tablosunda bulunamazsa KullaniciUser tablosunda ara - SADECE custom_url ile
    if (!kullanici) {
      kullanici = await KullaniciUser.findOne({
        where: { custom_url: req.params.slug }
      });
      isKullaniciUser = true;
    }
    
    if (!kullanici) {
      // Warning log kaldırıldı - production optimizasyonu
      // Custom URL bulunamadıysa 404 hatası ver
      return res.status(404).render('404', { 
        message: 'Kartvizit bulunamadı. Lütfen doğru URL\'yi kontrol edin.' 
      });
    }

    // Info log kaldırıldı - production optimizasyonu

    // Görüntülenme sayısını artır
    await kullanici.increment('goruntulenme');
    await kullanici.reload();

    // Gizlilik ayarlarını çek
    const privacySettings = await PrivacySettings.findOne({ 
      where: { user_id: kullanici.id } 
    });
    
    // Sosyal medya hesaplarını doğru tablodan al
    if (isKullaniciUser) {
      socialMedias = await KullaniciSocialMedia.findAll({ where: { kullanici_user_id: kullanici.id } });
    } else {
      socialMedias = await SocialMedia.findAll({ where: { user_id: kullanici.id } });
    }
    
    // QR kod URL'si oluştur - SADECE custom_url kullan
    const baseUrl = req.protocol + '://' + req.get('host');
    const qrUrl = `${baseUrl}/${kullanici.custom_url}`;
    
    // Kullanıcı bilgilerini hazırla
    const userInfo = {
      name: `${kullanici.firstname} ${kullanici.lastname || ''}`,
      company: kullanici.company,
      company_logo: kullanici.company_logo,
      thema_color: kullanici.thema_color
    };
    
    // Özel QR kod oluştur (şirket logosu ve tema rengi ile)
    const qrCodeDataUrl = await generateQRWithCompanyLogo(qrUrl, userInfo, {
      width: 400,
      margin: 4
    });

    // Doğru template'i kullan
    const template = isKullaniciUser ? 'kullanici-public-card' : 'public-card';
    
    // Debug log kaldırıldı - production optimizasyonu
    
    res.render(template, { 
      kullanici, 
      socialMedias, 
      qrCodeDataUrl,
      privacySettings
    });
  } catch (err) {
    console.error('Public card hatası:', err);
    return res.status(500).render('404', { 
      message: 'Kartvizit görüntülenirken hata oluştu.' 
    });
  }
});

app.use("/", authRoutes);     // /login, /logout
app.use("/admin", adminRoutes); // /admin/users, /admin/card/:id vs.
app.use("/kullanici", kullaniciRoutes);
app.use('/kullanici/kisi', kullaniciKisiRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin/analytics', adminAnalyticsRoutes.router);
app.use('/track', trackingRoutes); // Mail tracking routes

// Error handling middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// 404 handler (en sona ekle)
app.use(notFoundHandler);

// Error handler (en sona ekle)
app.use(errorHandler);

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
