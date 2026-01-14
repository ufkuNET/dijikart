const nodemailer = require('nodemailer');

// Mail transporter konfigürasyonu - Güncellenmiş Gmail SMTP ayarları
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS kullanıyoruz
  auth: {
    user: process.env.MAIL_USER || 'your-email@gmail.com',
    pass: process.env.MAIL_PASS || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Mail gönderme fonksiyonu - Gerçek mail gönderimi
async function sendMail(to, subject, content, fromName = 'DijiKart') {
  try {
    const mailOptions = {
      from: `"${fromName}" <${process.env.MAIL_USER || 'your-email@gmail.com'}>`,
      to: to,
      subject: subject,
      html: content,
      text: content.replace(/<[^>]*>/g, '')
    };

    
    const info = await transporter.sendMail(mailOptions);
    
    // Mail gerçekten gönderildi mi kontrol et
    if (info && info.messageId && info.response) {
      // Gmail başarılı yanıt kodları: 250, 235, 334
      const successCodes = ['250', '235', '334'];
      const isSuccess = successCodes.some(code => info.response.includes(code));
      
      if (isSuccess) {
        
        return {
          success: true,
          messageId: info.messageId,
          response: info.response
        };
        } else {
          
        return {
          success: false,
          error: `Mail sunucusundan başarısız yanıt: ${info.response}`,
          response: info.response
        };
      }
    } else {
        
      return {
        success: false,
        error: 'Mail sunucusundan eksik yanıt alındı',
        response: info ? info.response : 'No response'
      };
    }
  } catch (error) {
    console.error('❌ Mail gönderme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Mail template'leri - Düzenli ve Profesyonel
const mailTemplates = {
  // Kullanıcı kayıt onayı
  welcome: (userName, customUrl, password, email, trackingId, domain = 'qrtoo.de') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hoş Geldiniz - DijiKart QR Kod</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">Hoş Geldiniz!</h1>
                  <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 18px; opacity: 0.9; font-weight: 300;">DijiKart QR Kod Sistemine Başarıyla Kayıt Oldunuz</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 50px 40px;">
                  
                  <!-- Greeting -->
                  <h2 style="color: #2c3e50; margin: 0 0 30px 0; font-size: 28px; font-weight: 600;">Merhaba ${userName},</h2>
                  
                  <p style="color: #5a6c7d; line-height: 1.7; margin: 0 0 35px 0; font-size: 16px;">
                    DijiKart QR Kod sistemine başarıyla kayıt oldunuz. Artık profesyonel QR kodlarınızı oluşturabilir ve yönetebilirsiniz.
                  </p>
                  
                  <!-- Kullanıcı Giriş Bilgileri -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%); border: 2px solid #2196f3; border-radius: 12px; margin: 35px 0; box-shadow: 0 4px 20px rgba(33, 150, 243, 0.1);">
                    <tr>
                      <td style="padding: 35px;">
                        <h3 style="color: #1976d2; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; text-align: center;">
                          🔐 Kullanıcı Giriş Bilgilerin Bu
                        </h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
                          <tr>
                            <td style="padding: 25px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                        <td style="width: 140px; color: #5a6c7d; font-size: 15px; font-weight: 600;">🌐 Giriş Adresi:</td>
                                        <td>
                          <a href="https://${domain}/" style="color: #2196f3; font-weight: 600; text-decoration: none; font-size: 16px;">
                                            ${domain}
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="width: 140px; color: #5a6c7d; font-size: 15px; font-weight: 600;">📧 E-posta:</td>
                                        <td style="color: #2c3e50; font-weight: 600; font-size: 16px;">${email}</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 15px 0;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="width: 140px; color: #5a6c7d; font-size: 15px; font-weight: 600;">🔑 Şifre:</td>
                                        <td>
                                          <span style="color: #2196f3; font-weight: 700; background: linear-gradient(135deg, #e3f2fd, #f0f8ff); padding: 12px 16px; border-radius: 8px; border: 2px solid #2196f3; font-size: 16px; display: inline-block; min-width: 140px; text-align: center; letter-spacing: 1px;">${password}</span>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <div style="margin-top: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #2196f3;">
                          <p style="color: #5a6c7d; margin: 0; font-size: 14px; line-height: 1.6;">
                            <strong>💡 Giriş Yapmak İçin:</strong> Yukarıdaki bilgileri kullanarak sisteme giriş yapabilirsiniz. Güvenliğiniz için şifrenizi kimseyle paylaşmayın.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- QR Code URL Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #6c757d; border-radius: 12px; margin: 35px 0; box-shadow: 0 4px 20px rgba(108, 117, 125, 0.1);">
                    <tr>
                      <td style="padding: 35px; text-align: center;">
                        <h3 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                          🎯 Kişisel QR Kod Adresiniz
                        </h3>
                        <p style="margin: 0;">
                          <a href="https://${domain}/${customUrl}" style="color: #007bff; font-size: 22px; font-weight: 700; text-decoration: none; background-color: #ffffff; padding: 15px 25px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            ${domain}/${customUrl}
                          </a>
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 30px; padding: 18px 40px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);">
                              <a href="https://${domain}/" style="color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">
                                🚀 Giriş Yap ve QR Kodlarını Oluştur
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Features -->
                  <div style="background-color: #f8f9fa; border-radius: 12px; padding: 35px; margin: 35px 0;">
                    <h3 style="color: #2c3e50; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; text-align: center;">
                      ✨ Özellikler
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          🎨 Profesyonel QR kod tasarımları
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          🎯 Kişiselleştirilebilir renkler ve logolar
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          📊 Detaylı analitik ve takip
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          🛡️ 7/24 teknik destek
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 2px solid #e9ecef; margin: 40px 0;">
                  <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0; line-height: 1.6;">
                    Bu mail DijiKart QR Kod sistemi tarafından gönderilmiştir.<br>
                    Sorularınız için: <a href="mailto:pak@medya.group" style="color: #007bff; text-decoration: none; font-weight: 600;">pak@medya.group</a>
                  </p>
                  
                  <!-- Tracking Pixel (placeholder) -->
                  <img src="https://${domain}/" width="1" height="1" style="display:none;" alt="" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  // QR kod paketi satın alma onayı
  qrPackage: (userName, packageName, qrAmount, price, email, invoiceNumber, discountAmount, finalPrice, trackingId, domain = 'qrtoo.de') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ödeme Onaylandı - DijiKart QR Kod</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 50px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">Ödeme Onaylandı!</h1>
                  <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 18px; opacity: 0.9; font-weight: 300;">QR Kod Paketiniz Başarıyla Satın Alındı</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 50px 40px;">
                  
                  <!-- Greeting -->
                  <h2 style="color: #2c3e50; margin: 0 0 30px 0; font-size: 28px; font-weight: 600;">Merhaba ${userName},</h2>
                  
                  <p style="color: #5a6c7d; line-height: 1.7; margin: 0 0 35px 0; font-size: 16px;">
                    QR kod paketiniz başarıyla satın alındı. Artık <strong>${qrAmount} adet</strong> QR kod oluşturabilirsiniz.
                  </p>
                  
                  <!-- Fatura Detayları -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #28a745; border-radius: 12px; margin: 35px 0; box-shadow: 0 4px 20px rgba(40, 167, 69, 0.1);">
                    <tr>
                      <td style="padding: 35px;">
                        <!-- Fatura Başlığı -->
                        <div style="text-align: center; margin-bottom: 30px;">
                          <h2 style="color: #28a745; margin: 0 0 15px 0; font-size: 26px; font-weight: 700;">
                            📋 FATURA
                          </h2>
                          <p style="color: #6c757d; margin: 0; font-size: 14px;">
                            Fatura No: <strong style="color: #28a745;">${invoiceNumber}</strong>
                          </p>
                          <p style="color: #6c757d; margin: 5px 0 0 0; font-size: 14px;">
                            Tarih: <strong>${new Date().toLocaleDateString('tr-TR')}</strong>
                          </p>
                        </div>
                        
                        <!-- Fatura İçeriği -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
                          <!-- Fatura Başlık Satırı -->
                          <tr style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                            <td style="padding: 18px 25px; color: white; font-weight: 600; font-size: 16px;">
                              Ürün/Hizmet
                            </td>
                            <td style="padding: 18px 25px; color: white; font-weight: 600; font-size: 16px; text-align: center;">
                              Adet
                            </td>
                            <td style="padding: 18px 25px; color: white; font-weight: 600; font-size: 16px; text-align: right;">
                              Birim Fiyat
                            </td>
                            <td style="padding: 18px 25px; color: white; font-weight: 600; font-size: 16px; text-align: right;">
                              Toplam
                            </td>
                          </tr>
                          
                          <!-- Ürün Satırı -->
                          <tr style="border-bottom: 1px solid #e9ecef;">
                            <td style="padding: 18px 25px; color: #2c3e50; font-size: 16px;">
                              <strong>${packageName}</strong><br>
                              <span style="color: #6c757d; font-size: 14px;">QR Kod Paketi</span>
                            </td>
                            <td style="padding: 18px 25px; color: #2c3e50; font-size: 16px; text-align: center; font-weight: 600;">
                              ${qrAmount}
                            </td>
                            <td style="padding: 18px 25px; color: #2c3e50; font-size: 16px; text-align: right;">
                              ${(price / qrAmount).toFixed(2)} TL
                            </td>
                            <td style="padding: 18px 25px; color: #2c3e50; font-size: 16px; text-align: right; font-weight: 600;">
                              ${price} TL
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Fatura Özeti -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 25px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #6c757d; font-size: 16px; text-align: right;">Ara Toplam:</td>
                                  <td style="color: #2c3e50; font-weight: 600; font-size: 16px; text-align: right; padding-left: 25px;">${price} TL</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          ${discountAmount > 0 ? `
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #28a745; font-size: 16px; text-align: right;">İndirim:</td>
                                  <td style="color: #28a745; font-weight: 600; font-size: 16px; text-align: right; padding-left: 25px;">-${discountAmount} TL</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 15px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #28a745; font-size: 20px; font-weight: 700; text-align: right;">GENEL TOPLAM:</td>
                                  <td style="color: #28a745; font-weight: 700; font-size: 22px; text-align: right; padding-left: 25px;">${finalPrice} TL</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Fatura Notları -->
                        <div style="margin-top: 25px; padding: 20px; background: rgba(40, 167, 69, 0.1); border-radius: 8px; border-left: 4px solid #28a745;">
                          <p style="color: #28a745; margin: 0; font-size: 14px; line-height: 1.6;">
                            <strong>📋 Fatura Bilgileri:</strong><br>
                            • Bu fatura elektronik ortamda oluşturulmuştur<br>
                            • Ödeme işleminiz başarıyla tamamlanmıştır<br>
                            • Fatura numarası: <strong>${invoiceNumber}</strong><br>
                            • Tarih: <strong>${new Date().toLocaleDateString('tr-TR')}</strong>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 30px; padding: 18px 40px; box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);">
                              <a href="https://${domain}/" style="color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">
                                🎯 QR Kodlarımı Oluştur
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Next Steps -->
                  <div style="background-color: #f8f9fa; border-radius: 12px; padding: 35px; margin: 35px 0;">
                    <h3 style="color: #2c3e50; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; text-align: center;">
                      📋 Sonraki Adımlar
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          1️⃣ Profil sayfanıza giriş yapın
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          2️⃣ QR kod paketinizi seçin
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          3️⃣ Kişisel bilgilerinizi girin
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5a6c7d; font-size: 16px;">
                          4️⃣ QR kodlarınızı oluşturun ve indirin
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 2px solid #e9ecef; margin: 40px 0;">
                  <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0; line-height: 1.6;">
                    Bu mail DijiKart QR Kod sistemi tarafından gönderilmiştir.<br>
                    Sorularınız için: <a href="mailto:pak@medya.group" style="color: #007bff; text-decoration: none; font-weight: 600;">pak@medya.group</a>
                  </p>
                  
                  <!-- Tracking Pixel (placeholder) -->
                  <img src="https://${domain}/" width="1" height="1" style="display:none;" alt="" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  // Şifre sıfırlama
  passwordReset: (userName, resetLink, trackingId, domain = 'qrtoo.de') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Şifre Sıfırlama - DijiKart QR Kod</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 50px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">Şifre Sıfırlama</h1>
                  <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 18px; opacity: 0.9; font-weight: 300;">DijiKart Hesabınız İçin Şifre Sıfırlama Talebi</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 50px 40px;">
                  
                  <!-- Greeting -->
                  <h2 style="color: #2c3e50; margin: 0 0 30px 0; font-size: 28px; font-weight: 600;">Merhaba ${userName},</h2>
                  
                  <p style="color: #5a6c7d; line-height: 1.7; margin: 0 0 35px 0; font-size: 16px;">
                    DijiKart hesabınız için şifre sıfırlama talebinde bulundunuz. Eğer bu talebi siz yapmadıysanız, bu maili görmezden gelebilirsiniz.
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 30px; padding: 18px 40px; box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);">
                              <a href="https://${domain}/" style="color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">
                                🔐 Şifremi Sıfırla
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Security Notes -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 2px solid #ffc107; border-radius: 12px; margin: 35px 0; box-shadow: 0 4px 20px rgba(255, 193, 7, 0.1);">
                    <tr>
                      <td style="padding: 35px;">
                        <h3 style="color: #856404; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; text-align: center;">
                          🛡️ Güvenlik Notu
                        </h3>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #856404; font-size: 16px;">
                              ⏰ Bu link 24 saat geçerlidir
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #856404; font-size: 16px;">
                              🔒 Linki kimseyle paylaşmayın
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #856404; font-size: 16px;">
                              💪 Şifrenizi güçlü tutun
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #856404; font-size: 16px;">
                              🔐 İki faktörlü doğrulama kullanın
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 2px solid #e9ecef; margin: 40px 0;">
                  <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0; line-height: 1.6;">
                    Bu mail DijiKart QR Kod sistemi tarafından gönderilmiştir.<br>
                    Sorularınız için: <a href="mailto:pak@medya.group" style="color: #007bff; text-decoration: none; font-weight: 600;">pak@medya.group</a>
                  </p>
                  
                  <!-- Tracking Pixel (placeholder) -->
                  <img src="https://${domain}/" width="1" height="1" style="display:none;" alt="" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
};

// Test mail gönderme fonksiyonu
async function testMail() {
  try {
    const result = await sendMail(
      'test@example.com',
      'Test Mail - DijiKart',
      '<h1>Bu bir test mailidir</h1><p>Mail sistemi çalışıyor!</p>'
    );
    return result;
  } catch (error) {
    console.error('Test mail hatası:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendMail,
  mailTemplates,
  testMail
};
