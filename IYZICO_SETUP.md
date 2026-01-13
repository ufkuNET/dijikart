# 🚀 Iyzico Ödeme Sistemi Kurulum Rehberi

## 📋 Gereksinimler

### 1. Iyzico Hesabı
- [Iyzico](https://www.iyzico.com) hesabı oluşturun
- Test ortamı için sandbox hesabı alın
- Production için gerçek hesap alın

### 2. API Anahtarları
Iyzico hesabınızdan şu bilgileri alın:
- **API Key** (Test/Production)
- **Secret Key** (Test/Production)
- **Base URL** (Test: `https://sandbox-api.iyzipay.com`, Production: `https://api.iyzipay.com`)

## ⚙️ Kurulum Adımları

### 1. .env Dosyası Oluşturun
Proje ana dizininde `.env` dosyası oluşturun:

```env
# ===== IYZICO PAYMENT CONFIGURATION =====
PAYMENT_PROVIDER=iyzico

# Test ortamı için:
IYZICO_API_KEY=your_test_api_key_here
IYZICO_SECRET_KEY=your_test_secret_key_here
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Production ortamı için (test tamamlandıktan sonra):
# IYZICO_BASE_URL=https://api.iyzipay.com

# Iyzico Webhook Secret (güvenlik için)
IYZICO_WEBHOOK_SECRET=your_webhook_secret_here

# Iyzico Callback URL
IYZICO_CALLBACK_URL=https://yourdomain.com/payment/callback

# Iyzico 3D Secure Configuration
IYZICO_3DS_ENABLED=true
IYZICO_3DS_CALLBACK_URL=https://yourdomain.com/payment/3ds/callback
```

### 2. Paket Yükleme
```bash
npm install iyzipay
```

### 3. Veritabanı Güncellemesi
SavedCard tablosu zaten `provider_token` alanına sahip, ek güncelleme gerekmez.

## 🔧 Konfigürasyon

### Test Kartları
Iyzico test ortamında kullanabileceğiniz kartlar:

#### VISA Test Kartları:
- **Kart No:** 5528790000000008
- **SKT:** 12/30
- **CVV:** 123

#### MasterCard Test Kartları:
- **Kart No:** 5406670000000009
- **SKT:** 12/30
- **CVV:** 123

#### 3D Secure Test Kartları:
- **Kart No:** 4111111111111129
- **SKT:** 12/30
- **CVV:** 123

## 🧪 Test Etme

### 1. Test Ortamında
```bash
# .env dosyasında test API key'lerini kullanın
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```

### 2. Ödeme Testi
1. Uygulamayı başlatın
2. QR kod paketi seçin
3. Test kartı ile ödeme yapın
4. 3D Secure doğrulamasını test edin

### 3. Log Kontrolü
```bash
# Logları kontrol edin
tail -f logs/app.log
```

## 🚀 Production'a Geçiş

### 1. API Anahtarlarını Güncelleyin
```env
# Production API key'leri
IYZICO_API_KEY=your_production_api_key
IYZICO_SECRET_KEY=your_production_secret_key
IYZICO_BASE_URL=https://api.iyzipay.com
```

### 2. SSL Sertifikası
Production'da mutlaka SSL sertifikası kullanın:
```env
SSL_ENABLED=true
SSL_KEY_PATH=/path/to/private.key
SSL_CERT_PATH=/path/to/certificate.crt
```

### 3. Webhook URL'leri
Production domain'inizi kullanın:
```env
IYZICO_CALLBACK_URL=https://yourdomain.com/payment/callback
IYZICO_3DS_CALLBACK_URL=https://yourdomain.com/payment/3ds/callback
```

## 🔒 Güvenlik

### 1. API Anahtarları
- ✅ API anahtarlarını asla kod içinde tutmayın
- ✅ .env dosyasını git'e commit etmeyin
- ✅ Production anahtarlarını güvenli tutun

### 2. Webhook Güvenliği
- ✅ Webhook imzalarını doğrulayın
- ✅ HTTPS kullanın
- ✅ Rate limiting uygulayın

### 3. Kart Verileri
- ✅ Kart verilerini asla saklamayın
- ✅ Iyzico token'larını kullanın
- ✅ PCI DSS uyumluluğunu sağlayın

## 📊 Monitoring

### 1. Log Takibi
```javascript
// Ödeme logları
logger.info('💳 IYZICO ÖDEME BAŞLIYOR:', { amount, orderRef });
logger.info('✅ IYZICO ÖDEME SONUCU:', result);
```

### 2. Hata Takibi
```javascript
// Hata logları
logger.error('❌ IYZICO ÖDEME HATASI:', error);
logger.error('❌ 3DS CALLBACK HATASI:', error);
```

## 🆘 Sorun Giderme

### Yaygın Hatalar:

#### 1. "API Key Geçersiz"
- ✅ API key'in doğru olduğunu kontrol edin
- ✅ Test/Production ortamını karıştırmayın

#### 2. "3DS Hatası"
- ✅ Callback URL'in doğru olduğunu kontrol edin
- ✅ SSL sertifikasının geçerli olduğunu kontrol edin

#### 3. "Kart Kaydetme Hatası"
- ✅ Kart bilgilerinin doğru olduğunu kontrol edin
- ✅ Iyzico kart kaydetme limitlerini kontrol edin

## 📞 Destek

- **Iyzico Destek:** https://www.iyzico.com/tr/destek
- **API Dokümantasyonu:** https://dev.iyzipay.com/tr
- **Test Ortamı:** https://sandbox-merchant.iyzipay.com

## ✅ Kontrol Listesi

- [ ] Iyzico hesabı oluşturuldu
- [ ] API anahtarları alındı
- [ ] .env dosyası oluşturuldu
- [ ] Test kartları ile test edildi
- [ ] 3D Secure test edildi
- [ ] Webhook URL'leri ayarlandı
- [ ] SSL sertifikası kuruldu (production)
- [ ] Loglar kontrol edildi
- [ ] Güvenlik önlemleri alındı

---

**🎉 Tebrikler! Iyzico entegrasyonu tamamlandı!**
