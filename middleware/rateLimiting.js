const rateLimit = require('express-rate-limit');

// Admin login için rate limiting
const adminLoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: 3, // 5 dakikada maksimum 3 giriş denemesi
  message: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
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
    res.status(429).render('login', { 
      hata: `Çok fazla giriş denemesi! ${remainingTime} dakika sonra tekrar deneyin.` 
    });
  }
});

// Kullanıcı login için rate limiting
const userLoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: 3, // 5 dakikada maksimum 3 giriş denemesi
  message: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
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
    res.status(429).render('login-kullanici', { 
      hata: `Çok fazla giriş denemesi! ${remainingTime} dakika sonra tekrar deneyin.` 
    });
  }
});

module.exports = {
  adminLoginLimiter,
  userLoginLimiter
};
