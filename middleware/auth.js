// Kullanıcı kontrol middleware'i
const kullaniciKontrolEt = (req, res, next) => {
  if (!req.session.kullanici) {
    return res.redirect('/kullanici/login');
  }
  
  // Şifre değiştirme sayfası hariç diğer sayfalarda şifre değiştirme kontrolü
  if (req.path !== '/kullanici/change-password' && req.path !== '/kullanici/logout') {
    // Kullanıcı şifresini değiştirmemişse şifre değiştirme sayfasına yönlendir
    if (req.session.kullanici.password_changed === false) {
      return res.redirect('/kullanici/change-password');
    }
  }
  
  next();
};

// Admin kontrol middleware'i
const adminKontrolEt = (req, res, next) => {
  if (!req.session.kullanici || !req.session.isAdmin) {
    return res.redirect('/login');
  }
  next();
};

module.exports = {
  kullaniciKontrolEt,
  adminKontrolEt
}; 