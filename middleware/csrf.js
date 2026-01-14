const crypto = require('crypto');

// CSRF token oluştur
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF token middleware
const csrfProtection = (req, res, next) => {
  // Token oluştur veya mevcut token'ı al
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCSRFToken();
  }
  
  // Token'ı response'a ekle
  res.locals.csrfToken = req.session.csrfToken;
  
  // POST, PUT, DELETE isteklerinde token kontrolü
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = req.body._csrf || req.headers['x-csrf-token'];
    
    if (!token || token !== req.session.csrfToken) {
      return res.status(403).json({
        success: false,
        message: 'CSRF token geçersiz'
      });
    }
  }
  
  next();
};

// CSRF token'ı form'a ekle
const addCSRFToken = (req, res, next) => {
  res.locals.csrfToken = req.session.csrfToken || generateCSRFToken();
  next();
};

module.exports = {
  csrfProtection,
  addCSRFToken,
  generateCSRFToken
}; 