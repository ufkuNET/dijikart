// Cache control middleware - Geri tuşu koruması
const noCache = (req, res, next) => {
  // Tüm cache'leri devre dışı bırak
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};

// Sadece belirli sayfalar için cache kontrolü
const selectiveNoCache = (req, res, next) => {
  // Admin ve kullanıcı dashboard sayfaları için cache'i devre dışı bırak
  const protectedRoutes = [
    '/admin/dashboard',
    '/admin/users',
    '/admin/profile',
    '/kullanici/dashboard',
    '/kullanici/profile',
    '/kullanici/kisi/dashboard',
    '/kullanici/kisi/users'
  ];
  
  if (protectedRoutes.some(route => req.path.startsWith(route))) {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }
  
  next();
};

// Session kontrolü ile cache kontrolü
const sessionBasedCache = (req, res, next) => {
  // Kullanıcı giriş yapmışsa cache'i devre dışı bırak
  if (req.session.kullanici) {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }
  
  next();
};

module.exports = {
  noCache,
  selectiveNoCache,
  sessionBasedCache
}; 