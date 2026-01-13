const { body, validationResult } = require('express-validator');

// Email validation
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Geçerli bir email adresi giriniz');

// Password validation
const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Şifre en az 6 karakter olmalıdır')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir');

// Name validation
const validateName = body(['firstname', 'lastname', 'Ad', 'SoyAd'])
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('İsim 2-50 karakter arasında olmalıdır')
  .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/)
  .withMessage('İsim sadece harf içerebilir');

// Phone validation
const validatePhone = body('phone')
  .optional()
  .matches(/^[\+]?[0-9\s\-\(\)]+$/)
  .withMessage('Geçerli bir telefon numarası giriniz');

// URL validation
const validateUrl = body(['website', 'social_url'])
  .optional()
  .isURL()
  .withMessage('Geçerli bir URL giriniz');

// Company validation
const validateCompany = body('company')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('Şirket adı 100 karakterden uzun olamaz');

// Job title validation
const validateJobTitle = body('job_title')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('İş unvanı 100 karakterden uzun olamaz');

// Address validation
const validateAddress = body('address')
  .optional()
  .trim()
  .isLength({ max: 200 })
  .withMessage('Adres 200 karakterden uzun olamaz');

// Theme color validation
const validateThemeColor = body('thema_color')
  .optional()
  .matches(/^#[0-9A-Fa-f]{6}$/)
  .withMessage('Geçerli bir renk kodu giriniz (örn: #FF0000)');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Sanitize inputs
const sanitizeInputs = (req, res, next) => {
  // XSS koruması için HTML karakterlerini temizle
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
    }
  };
  
  sanitize(req.body);
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateUrl,
  validateCompany,
  validateJobTitle,
  validateAddress,
  validateThemeColor,
  handleValidationErrors,
  sanitizeInputs
}; 