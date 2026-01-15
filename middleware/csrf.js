const crypto = require("crypto");

// CSRF token oluştur
const generateCSRFToken = () => crypto.randomBytes(32).toString("hex");

// CSRF koruma middleware
// - Session varsa token üretir/saklar
// - POST/PUT/DELETE'de token kontrol eder
const csrfProtection = (req, res, next) => {
  try {
    // Session yoksa daha anlaşılır hata ver (ve app'i çökertme)
    if (!req.session) {
      return res.status(500).send(
        "CSRF middleware requires session. Make sure express-session is registered BEFORE csrf middleware."
      );
    }

    // Token oluştur veya mevcut token'ı al
    if (!req.session.csrfToken) {
      req.session.csrfToken = generateCSRFToken();
    }

    // Token'ı response'a ekle (template'lerde kullanmak için)
    res.locals.csrfToken = req.session.csrfToken;

    // POST, PUT, DELETE isteklerinde token kontrolü
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      const tokenFromBody = req.body && req.body._csrf;
      const tokenFromHeader = req.headers["x-csrf-token"];
      const token = tokenFromBody || tokenFromHeader;

      if (!token || token !== req.session.csrfToken) {
        return res.status(403).json({
          success: false,
          message: "CSRF token geçersiz",
        });
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

// CSRF token'ı her requestte template'e koy
// - Token yoksa üretir ve session'a da yazar (stabil olması için)
const addCSRFToken = (req, res, next) => {
  try {
    if (req.session) {
      if (!req.session.csrfToken) {
        req.session.csrfToken = generateCSRFToken();
      }
      res.locals.csrfToken = req.session.csrfToken;
    } else {
      // Session yoksa yine de locals'a bir token koy (form render bozulmasın)
      res.locals.csrfToken = generateCSRFToken();
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  csrfProtection,
  addCSRFToken,
  generateCSRFToken,
};
