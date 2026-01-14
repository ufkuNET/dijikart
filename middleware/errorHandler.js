// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Hata:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Veri doğrulama hatası',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Bu kayıt zaten mevcut',
      field: err.errors[0].path
    });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Dosya boyutu çok büyük (max 5MB)'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Beklenmeyen dosya türü'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Sunucu hatası' 
      : err.message
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).render('404', { 
    message: 'Sayfa bulunamadı',
    url: req.url
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
}; 