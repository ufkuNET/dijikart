const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const logger = require('../utils/logger');

// Production optimizasyonu - Debug logları kaldır
const productionLogger = {
  warn: (message) => {
    if (process.env.NODE_ENV === 'production') {
      // Production'da sadece kritik güvenlik logları
      console.warn(`[SECURITY] ${message}`);
    }
  },
  error: (message) => {
    console.error(`[SECURITY ERROR] ${message}`);
  }
};

// Güvenlik kontrolü - Hardcoded credentials kontrolü
const securityCheck = (req, res, next) => {
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  
  // Hardcoded password pattern'leri
  const passwordPatterns = [
    /password.*=.*['"]0000['"]/i,
    /password.*=.*['"]admin123['"]/i,
    /password.*=.*['"]Test123['"]/i,
    /password.*=.*['"]123456['"]/i,
    /password.*=.*['"]password['"]/i,
    /mongodb.*password.*=.*['"][^'"]+['"]/i
  ];
  
  for (const pattern of passwordPatterns) {
    if (pattern.test(body) || pattern.test(query)) {
      productionLogger.error(`Hardcoded password tespit edildi - IP: ${req.ip}`);
      return res.status(403).json({
        error: 'Güvenlik ihlali',
        message: 'Hardcoded password kullanımı tespit edildi.'
      });
    }
  }
  
  next();
};

// Rate Limiting - Brute Force saldırılarına karşı koruma
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: 3, // 5 dakikada maksimum 3 giriş denemesi
  message: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    productionLogger.warn(`Brute force saldırısı tespit edildi - IP: ${req.ip}`);
    return {
      error: 'Çok fazla giriş denemesi!',
      message: `${remainingTime} dakika sonra tekrar deneyin.`,
      remainingTime: remainingTime,
      attemptsLeft: 0,
      maxAttempts: 3
    };
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    productionLogger.warn(`Rate limit aşıldı - IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      error: 'Çok fazla giriş denemesi!',
      message: `${remainingTime} dakika sonra tekrar deneyin.`,
      remainingTime: remainingTime,
      attemptsLeft: 0,
      maxAttempts: 3
    });
  }
});

// API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 15 dakikada maksimum 100 istek
  message: {
    error: 'Çok fazla istek! Lütfen bekleyin.',
    remainingTime: '15 dakika'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`🚫 API rate limit aşıldı - IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      error: 'Çok fazla istek! Lütfen bekleyin.',
      remainingTime: '15 dakika'
    });
  }
});

// Slow Down - DDoS saldırılarına karşı koruma
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 dakika
  delayAfter: 50, // 50 istekten sonra yavaşlat
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    const delay = (used - delayAfter) * 500;
    logger.warn(`🐌 Slow down aktif - IP: ${req.ip}, Delay: ${delay}ms`);
    return delay;
  }
});

// IP Blacklist - Kötü IP'leri engelle
const blacklistedIPs = new Set([
  // Kötü IP'ler buraya eklenebilir
  // '192.168.1.100',
  // '10.0.0.50'
]);

const ipBlacklist = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (blacklistedIPs.has(clientIP)) {
    logger.warn(`🚫 Blacklisted IP erişim denemesi: ${clientIP}`);
    return res.status(403).json({
      error: 'Erişim engellendi',
      message: 'IP adresiniz engellenmiştir.'
    });
  }
  
  next();
};

// User Agent Kontrolü - Bot saldırılarına karşı koruma
const userAgentCheck = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Şüpheli User Agent'ları engelle
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
    /ruby/i,
    /php/i,
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /dirb/i,
    /gobuster/i,
    /wfuzz/i,
    /burp/i,
    /zap/i,
    /postman/i,
    /insomnia/i,
    /thunder client/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      logger.warn(`🚫 Şüpheli User Agent engellendi: ${userAgent} - IP: ${req.ip}`);
      return res.status(403).json({
        error: 'Erişim engellendi',
        message: 'Geçersiz User Agent.'
      });
    }
  }
  
  next();
};

// Request Size Limiting - Büyük istekleri engelle
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  
  if (contentLength > 10 * 1024 * 1024) { // 10MB limit
    logger.warn(`🚫 Büyük istek engellendi: ${contentLength} bytes - IP: ${req.ip}`);
    return res.status(413).json({
      error: 'İstek çok büyük',
      message: 'Maksimum 10MB istek gönderebilirsiniz.'
    });
  }
  
  next();
};

// SQL Injection Koruması - Ek koruma
const sqlInjectionProtection = (req, res, next) => {
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  const params = JSON.stringify(req.params);
  
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\b)/i,
    /(\b(or|and)\s+\d+\s*=\s*\d+)/i,
    /(\b(union|select)\s+.*\bfrom\b)/i,
    /(\b(insert|update|delete)\s+.*\binto\b)/i,
    /(\b(drop|create|alter)\s+.*\btable\b)/i,
    /(\b(exec|execute)\s+.*\bstored\s+procedure\b)/i,
    /(\b(script|javascript|vbscript)\b)/i,
    /(\b(onload|onerror|onclick)\s*=)/i,
    /(\b(union|select)\s+.*\bwhere\b)/i,
    /(\b(insert|update|delete)\s+.*\bwhere\b)/i,
    /(\b(union|select)\s+.*\bfrom\b.*\bwhere\b)/i,
    /(\b(insert|update|delete)\s+.*\bwhere\b.*\b=\b)/i,
    /(\b(drop|create|alter)\s+.*\bindex\b)/i,
    /(\b(union|select)\s+.*\bgroup\s+by\b)/i,
    /(\b(union|select)\s+.*\border\s+by\b)/i
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(body) || pattern.test(query) || pattern.test(params)) {
      logger.warn(`🚫 SQL Injection tespit edildi - IP: ${req.ip}, Pattern: ${pattern}`);
      return res.status(403).json({
        error: 'Geçersiz istek',
        message: 'SQL injection tespit edildi.'
      });
    }
  }
  
  next();
};

// XSS Koruması - Ek koruma
const xssProtection = (req, res, next) => {
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  const params = JSON.stringify(req.params);
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
    /onfocus\s*=/gi,
    /onblur\s*=/gi,
    /onchange\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi,
    /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi,
    /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi,
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi,
    /<a\b[^<]*(?:(?!<\/a>)<[^<]*)*<\/a>/gi,
    /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*>/gi,
    /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
    /<canvas\b[^<]*(?:(?!<\/canvas>)<[^<]*)*<\/canvas>/gi
  ];
  
  for (const pattern of xssPatterns) {
    if (pattern.test(body) || pattern.test(query) || pattern.test(params)) {
      logger.warn(`🚫 XSS saldırısı tespit edildi - IP: ${req.ip}, Pattern: ${pattern}`);
      return res.status(403).json({
        error: 'Geçersiz istek',
        message: 'XSS saldırısı tespit edildi.'
      });
    }
  }
  
  next();
};

// Path Traversal Koruması
const pathTraversalProtection = (req, res, next) => {
  const url = req.url;
  const pathTraversalPatterns = [
    /\.\./g,
    /\/\.\./g,
    /\.\.\//g,
    /\/etc\/passwd/i,
    /\/proc\/version/i,
    /\/sys\/class/i,
    /\/dev\/null/i,
    /\/tmp\/test/i,
    /\/var\/log/i,
    /\/root/i,
    /\/home/i,
    /\/bin/i,
    /\/sbin/i,
    /\/usr/i,
    /\/opt/i
  ];
  
  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(url)) {
      logger.warn(`🚫 Path traversal tespit edildi - IP: ${req.ip}, URL: ${url}`);
      return res.status(403).json({
        error: 'Geçersiz istek',
        message: 'Path traversal tespit edildi.'
      });
    }
  }
  
  next();
};

// Request Method Koruması
const methodProtection = (req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  
  if (!allowedMethods.includes(req.method)) {
    logger.warn(`🚫 Method not allowed - IP: ${req.ip}, Method: ${req.method}`);
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Bu HTTP metodu desteklenmiyor.'
    });
  }
  
  next();
};

// Content Type Koruması
const contentTypeProtection = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type') || '';
    
    if (!contentType.includes('application/json') && 
        !contentType.includes('application/x-www-form-urlencoded') &&
        !contentType.includes('multipart/form-data')) {
      logger.warn(`🚫 Unsupported media type - IP: ${req.ip}, Content-Type: ${contentType}`);
      return res.status(415).json({
        error: 'Unsupported media type',
        message: 'Desteklenmeyen content type.'
      });
    }
  }
  
  next();
};

// Referer Koruması - Sadece kritik route'larda aktif
const refererProtection = (req, res, next) => {
  // Sadece admin ve kritik API route'larında referer kontrolü yap
  const criticalRoutes = [
    '/admin/add-user',
    '/admin/delete-user',
    '/admin/update-user',
    '/api/admin',
    '/admin/analytics'
  ];
  
  const isCriticalRoute = criticalRoutes.some(route => req.path.includes(route));
  
  if (isCriticalRoute && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
    const referer = req.get('Referer');
    
    if (!referer) {
      logger.warn(`🚫 Referer header gerekli - IP: ${req.ip}`);
      return res.status(403).json({
        error: 'Geçersiz istek',
        message: 'Referer header gerekli.'
      });
    }
    
    // Sadece kendi domain'inden gelen istekleri kabul et
    const allowedDomains = ['localhost', 'qrtoo.de',];
    try {
      const url = new URL(referer);
      const refererDomain = url.hostname;
      
      if (!allowedDomains.includes(refererDomain)) {
        logger.warn(`🚫 Geçersiz referer domain - IP: ${req.ip}, Referer: ${referer}`);
        return res.status(403).json({
          error: 'Geçersiz istek',
          message: 'Geçersiz referer domain.'
        });
      }
    } catch (error) {
      // Geçersiz referer URL'i - normal kullanıcılar için izin ver
      return next();
    }
  }
  
  next();
};

// Session Hijacking Koruması
const sessionProtection = (req, res, next) => {
  if (req.session && req.session.kullanici) {
    const userAgent = req.get('User-Agent');
    const ip = req.ip || req.connection.remoteAddress;
    
    // Session'da User Agent ve IP kaydet
    if (!req.session.userAgent) {
      req.session.userAgent = userAgent;
      req.session.userIP = ip;
    } else {
      // User Agent veya IP değiştiyse session'ı temizle
      if (req.session.userAgent !== userAgent || req.session.userIP !== ip) {
        logger.warn(`🚫 Session hijacking tespit edildi - IP: ${ip}`);
        req.session.destroy();
        return res.status(401).json({
          error: 'Oturum sonlandırıldı',
          message: 'Güvenlik nedeniyle oturumunuz sonlandırıldı.'
        });
      }
    }
  }
  
  next();
};

// Brute Force Koruması - Ek koruma
const bruteForceProtection = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // IP bazlı başarısız giriş sayısını takip et
  if (!req.app.locals.failedLogins) {
    req.app.locals.failedLogins = new Map();
  }
  
  const failedLogins = req.app.locals.failedLogins;
  const userFailedLogins = failedLogins.get(clientIP) || { count: 0, lastAttempt: 0 };
  
  // 15 dakika geçtiyse sayacı sıfırla
  if (now - userFailedLogins.lastAttempt > 15 * 60 * 1000) {
    userFailedLogins.count = 0;
  }
  
  // 10 başarısız girişten sonra 1 saat engelle
  if (userFailedLogins.count >= 10) {
    const blockTime = 60 * 60 * 1000; // 1 saat
    if (now - userFailedLogins.lastAttempt < blockTime) {
      logger.warn(`🚫 Brute force engellendi - IP: ${clientIP}`);
      return res.status(429).json({
        error: 'Çok fazla başarısız giriş',
        message: '1 saat boyunca engellendiniz.'
      });
    } else {
      userFailedLogins.count = 0;
    }
  }
  
  req.app.locals.failedLogins.set(clientIP, userFailedLogins);
  next();
};

// Güvenlik Headers - Ek koruma
const securityHeaders = (req, res, next) => {
  // X-Frame-Options - Clickjacking koruması
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-Content-Type-Options - MIME type sniffing koruması
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection - XSS koruması
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy - Referrer bilgisi koruması
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy - Feature policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Strict-Transport-Security - HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  next();
};

// NoSQL Injection Koruması
const noSqlInjectionProtection = (req, res, next) => {
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  const params = JSON.stringify(req.params);
  
  const noSqlPatterns = [
    /\$where/i,
    /\$ne/i,
    /\$gt/i,
    /\$lt/i,
    /\$gte/i,
    /\$lte/i,
    /\$in/i,
    /\$nin/i,
    /\$regex/i,
    /\$options/i,
    /\$or/i,
    /\$and/i,
    /\$not/i,
    /\$exists/i,
    /\$type/i,
    /\$mod/i,
    /\$all/i,
    /\$elemMatch/i,
    /\$size/i,
    /\$unset/i,
    /\$inc/i,
    /\$set/i,
    /\$push/i,
    /\$pull/i,
    /\$pop/i,
    /\$addToSet/i,
    /\$each/i,
    /\$slice/i,
    /\$sort/i,
    /\$bit/i
  ];
  
  for (const pattern of noSqlPatterns) {
    if (pattern.test(body) || pattern.test(query) || pattern.test(params)) {
      logger.warn(`🚫 NoSQL Injection tespit edildi - IP: ${req.ip}, Pattern: ${pattern}`);
      return res.status(403).json({
        error: 'Geçersiz istek',
        message: 'NoSQL injection tespit edildi.'
      });
    }
  }
  
  next();
};

// Command Injection Koruması - Sadece kritik route'larda
const commandInjectionProtection = (req, res, next) => {
  // Sadece admin ve kritik API route'larında command injection kontrolü yap
  const criticalRoutes = [
    '/admin',
    '/api/admin',
    '/admin/analytics',
    '/admin/users',
    '/admin/add-user',
    '/admin/delete-user',
    '/admin/update-user'
  ];
  
  const isCriticalRoute = criticalRoutes.some(route => req.path.includes(route));
  
  if (isCriticalRoute) {
    const body = JSON.stringify(req.body);
    const query = JSON.stringify(req.query);
    const params = JSON.stringify(req.params);
    
    const commandPatterns = [
      /[;&|`$(){}[\]]/g,
      /(rm\s+-rf|del\s+\/s|format\s+c:|shutdown|reboot|halt)/i,
      /(cat|ls|dir|pwd|whoami|id|uname|ps|top|kill)/i,
      /(wget|curl|nc|telnet|ssh|ftp|scp)/i,
      /(eval|exec|system|shell_exec|passthru)/i,
      /(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/i,
      /(javascript:|vbscript:|data:|file:|ftp:|gopher:|http:|https:|mailto:|news:|telnet:)/i
    ];
    
    for (const pattern of commandPatterns) {
      if (pattern.test(body) || pattern.test(query) || pattern.test(params)) {
        logger.warn(`🚫 Command injection tespit edildi - IP: ${req.ip}, Pattern: ${pattern}`);
        return res.status(403).json({
          error: 'Geçersiz istek',
          message: 'Command injection tespit edildi.'
        });
      }
    }
  }
  
  next();
};

// File Upload Güvenliği
const fileUploadSecurity = (req, res, next) => {
  if (req.files || req.file) {
    const files = req.files || [req.file];
    
    for (const file of files) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        logger.warn(`🚫 Dosya boyutu limiti aşıldı - IP: ${req.ip}, Dosya: ${file.originalname}`);
        return res.status(413).json({
          error: 'Dosya çok büyük',
          message: 'Maksimum 5MB dosya yükleyebilirsiniz.'
        });
      }
      
      // Dosya tipi kontrolü
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp'
      ];
      
      if (!allowedMimeTypes.includes(file.mimetype)) {
        logger.warn(`🚫 Geçersiz dosya tipi - IP: ${req.ip}, Dosya: ${file.originalname}`);
        return res.status(415).json({
          error: 'Geçersiz dosya tipi',
          message: 'Sadece resim dosyaları yükleyebilirsiniz.'
        });
      }
      
      // Dosya adı güvenliği
      const fileName = file.originalname || file.name;
      if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
        logger.warn(`🚫 Dosya adı güvenliği ihlali - IP: ${req.ip}, Dosya: ${fileName}`);
        return res.status(400).json({
          error: 'Geçersiz dosya adı',
          message: 'Dosya adında geçersiz karakterler var.'
        });
      }
    }
  }
  
  next();
};

// Session Fixation Koruması
const sessionFixationProtection = (req, res, next) => {
  if (req.session && req.session.kullanici && req.method === 'POST') {
    // Login işlemlerinde session'ı yenile
    if (req.path.includes('/login') || req.path.includes('/auth')) {
      const oldSession = req.session;
      req.session.regenerate((err) => {
        if (err) {
          logger.error(`🚫 Session yenilenemedi - IP: ${req.ip}, Hata: ${err.message}`);
          return res.status(500).json({
            error: 'Session hatası',
            message: 'Oturum yenilenirken hata oluştu.'
          });
        }
        
        // Eski session verilerini yeni session'a kopyala
        req.session.kullanici = oldSession.kullanici;
        req.session.userAgent = oldSession.userAgent;
        req.session.userIP = oldSession.userIP;
        req.session.csrfToken = oldSession.csrfToken;
        
        next();
      });
      return;
    }
  }
  
  next();
};

// HTTP Parameter Pollution Koruması
const httpParameterPollutionProtection = (req, res, next) => {
  // req.query ve req.body null/undefined olabilir, kontrol et
  const queryParams = req.query ? Object.keys(req.query) : [];
  const bodyParams = req.body ? Object.keys(req.body) : [];
  
  // Aynı parametrenin birden fazla değeri varsa engelle
  for (const param of [...queryParams, ...bodyParams]) {
    if ((req.query && Array.isArray(req.query[param])) || 
        (req.body && Array.isArray(req.body[param]))) {
      logger.warn(`🚫 HTTP Parameter Pollution - IP: ${req.ip}, Parametre: ${param}`);
      return res.status(400).json({
        error: 'Geçersiz parametre',
        message: 'Aynı parametre birden fazla değer alamaz.'
      });
    }
  }
  
  next();
};

module.exports = {
  loginLimiter,
  apiLimiter,
  speedLimiter,
  ipBlacklist,
  userAgentCheck,
  requestSizeLimit,
  sqlInjectionProtection,
  xssProtection,
  pathTraversalProtection,
  methodProtection,
  contentTypeProtection,
  refererProtection,
  sessionProtection,
  bruteForceProtection,
  securityHeaders,
  noSqlInjectionProtection,
  commandInjectionProtection,
  fileUploadSecurity,
  sessionFixationProtection,
  httpParameterPollutionProtection,
  securityCheck
};
