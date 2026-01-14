const nodemailer = require('nodemailer');

// Mail transporter konfigürasyonu
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail kullanıyoruz
  auth: {
    user: process.env.MAIL_USER || 'your-email@gmail.com', // Gmail adresiniz
    pass: process.env.MAIL_PASS || 'your-app-password' // Gmail uygulama şifresi
  }
});

// Mail gönderme fonksiyonu
async function sendMail(to, subject, content, fromName = 'DijiKart') {
  try {
    const mailOptions = {
      from: `"${fromName}" <${process.env.MAIL_USER || 'your-email@gmail.com'}>`,
      to: to,
      subject: subject,
      html: content, // HTML formatında mail içeriği
      text: content.replace(/<[^>]*>/g, '') // Plain text versiyonu
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Mail template'leri - Outlook Uyumlu + Tracking
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
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #667eea; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Hoş Geldiniz!</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">DijiKart QR Kod Sistemine Başarıyla Kayıt Oldunuz</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 25px 0; font-size: 24px;">Merhaba ${userName},</h2>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                    DijiKart QR Kod sistemine başarıyla kayıt oldunuz. Artık profesyonel QR kodlarınızı oluşturabilir ve yönetebilirsiniz.
                  </p>
                  
                  <!-- Kullanıcı Giriş Bilgileri -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e3f2fd; border: 2px solid #2196f3; border-radius: 8px; margin: 25px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="color: #1976d2; margin: 0 0 15px 0; font-size: 18px;">Kullanıcı Giriş Bilgileriniz:</h3>
                        <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width: 120px; color: #666666; font-size: 15px; font-weight: 600;">Giriş Adresi:</td>
                                    <td>
                                      <a href="https://${domain}/" style="color: #2196f3; font-weight: bold; text-decoration: none; font-size: 16px;">
                                        ${domain}
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width: 120px; color: #666666; font-size: 15px; font-weight: 600;">E-posta:</td>
                                    <td style="color: #333333; font-weight: bold; font-size: 16px;">${email}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width: 120px; color: #666666; font-size: 15px; font-weight: 600;">Şifre:</td>
                                    <td>
                                      <span style="color: #2196f3; font-weight: bold; background: linear-gradient(135deg, #e3f2fd, #f0f8ff); padding: 8px 12px; border-radius: 6px; border: 2px solid #2196f3; font-size: 16px; display: inline-block; min-width: 120px; text-align: center;">${password}</span>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #2196f3;">
                            <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.5;">
                              <strong>💡 Giriş Yapmak İçin:</strong> Yukarıdaki bilgileri kullanarak sisteme giriş yapabilirsiniz. Güvenliğiniz için şifrenizi kimseyle paylaşmayın.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- QR Code URL Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; margin: 25px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Kişisel QR Kod Adresiniz:</h3>
                        <p style="margin: 0;">
                          <a href="https://${domain}/${customUrl}" style="color: #007bff; font-size: 20px; font-weight: bold; text-decoration: none;">
                            ${domain}/${customUrl}
                          </a>
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background-color: #667eea; border-radius: 25px; padding: 15px 30px;">
                              <a href="https://${domain}" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                                Giriş Yap ve QR Kodlarını Oluştur
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Features -->
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                    <strong style="color: #333333;">Özellikler:</strong>
                  </p>
                  <ul style="color: #666666; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Profesyonel QR kod tasarımları</li>
                    <li style="margin-bottom: 8px;">Kişiselleştirilebilir renkler ve logolar</li>
                    <li style="margin-bottom: 8px;">Detaylı analitik ve takip</li>
                    <li style="margin-bottom: 8px;">7/24 teknik destek</li>
                  </ul>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 35px 0;">
                  <p style="color: #999999; font-size: 14px; text-align: center; margin: 0;">
                    Bu mail DijiKart QR Kod sistemi tarafından gönderilmiştir.<br>
                    Sorularınız için: <a href="mailto:pak@medya.group" style="color: #007bff;">pak@medya.group</a>
                  </p>
                  
                  <!-- Tracking Pixel (1x1 görünmez resim) -->
                  <img src="https://${domain}/" 
                       width="1" height="1" style="display:none;" 
                       alt="" />
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
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #28a745; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Ödeme Onaylandı!</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">QR Kod Paketiniz Başarıyla Satın Alındı</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 25px 0; font-size: 24px;">Merhaba ${userName},</h2>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                    QR kod paketiniz başarıyla satın alındı. Artık ${qrAmount} adet QR kod oluşturabilirsiniz.
                  </p>
                  
                  <!-- Fatura Detayları -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); border: 2px solid #28a745; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 30px;">
                        <!-- Fatura Başlığı -->
                        <div style="text-align: center; margin-bottom: 25px;">
                          <h2 style="color: #28a745; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">
                            <i class="fas fa-receipt" style="margin-right: 10px;"></i>FATURA
                          </h2>
                          <p style="color: #666666; margin: 0; font-size: 14px;">
                            Fatura No: <strong style="color: #28a745;">${invoiceNumber}</strong>
                          </p>
                          <p style="color: #666666; margin: 5px 0 0 0; font-size: 14px;">
                            Tarih: <strong>${new Date().toLocaleDateString('tr-TR')}</strong>
                          </p>
                        </div>
                        
                        <!-- Fatura İçeriği -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                          <!-- Fatura Başlık Satırı -->
                          <tr style="background: linear-gradient(135deg, #28a745, #20c997);">
                            <td style="padding: 15px 20px; color: white; font-weight: bold; font-size: 16px;">
                              Ürün/Hizmet
                            </td>
                            <td style="padding: 15px 20px; color: white; font-weight: bold; font-size: 16px; text-align: center;">
                              Adet
                            </td>
                            <td style="padding: 15px 20px; color: white; font-weight: bold; font-size: 16px; text-align: right;">
                              Birim Fiyat
                            </td>
                            <td style="padding: 15px 20px; color: white; font-weight: bold; font-size: 16px; text-align: right;">
                              Toplam
                            </td>
                          </tr>
                          
                          <!-- Ürün Satırı -->
                          <tr style="border-bottom: 1px solid #e9ecef;">
                            <td style="padding: 15px 20px; color: #333333; font-size: 16px;">
                              <strong>${packageName}</strong><br>
                              <span style="color: #666666; font-size: 14px;">QR Kod Paketi</span>
                            </td>
                            <td style="padding: 15px 20px; color: #333333; font-size: 16px; text-align: center; font-weight: bold;">
                              ${qrAmount}
                            </td>
                            <td style="padding: 15px 20px; color: #333333; font-size: 16px; text-align: right;">
                              ${(price / qrAmount).toFixed(2)} TL
                            </td>
                            <td style="padding: 15px 20px; color: #333333; font-size: 16px; text-align: right; font-weight: bold;">
                              ${price} TL
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Fatura Özeti -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #666666; font-size: 16px; text-align: right;">Ara Toplam:</td>
                                  <td style="color: #333333; font-weight: bold; font-size: 16px; text-align: right; padding-left: 20px;">${price} TL</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          ${discountAmount > 0 ? `
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #28a745; font-size: 16px; text-align: right;">İndirim:</td>
                                  <td style="color: #28a745; font-weight: bold; font-size: 16px; text-align: right; padding-left: 20px;">-${discountAmount} TL</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 12px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #28a745; font-size: 18px; font-weight: bold; text-align: right;">GENEL TOPLAM:</td>
                                  <td style="color: #28a745; font-weight: bold; font-size: 20px; text-align: right; padding-left: 20px;">${finalPrice} TL</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Fatura Notları -->
                        <div style="margin-top: 20px; padding: 15px; background: rgba(40, 167, 69, 0.1); border-radius: 8px; border-left: 4px solid #28a745;">
                          <p style="color: #28a745; margin: 0; font-size: 14px; line-height: 1.5;">
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
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background-color: #28a745; border-radius: 25px; padding: 15px 30px;">
                               <a href="https://${domain}/" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                                QR Kodlarımı Oluştur
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Next Steps -->
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                    <strong style="color: #333333;">Sonraki Adımlar:</strong>
                  </p>
                  <ol style="color: #666666; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Profil sayfanıza giriş yapın</li>
                    <li style="margin-bottom: 8px;">QR kod paketinizi seçin</li>
                    <li style="margin-bottom: 8px;">Kişisel bilgilerinizi girin</li>
                    <li style="margin-bottom: 8px;">QR kodlarınızı oluşturun ve indirin</li>
                  </ol>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 35px 0;">
                  <p style="color: #999999; font-size: 14px; text-align: center; margin: 0;">
                    Bu mail DijiKart QR Kod sistemi tarafından gönderilmiştir.<br>
                    Sorularınız için: <a href="mailto:pak@medya.group" style="color: #007bff;">pak@medya.group</a>
                  </p>
                  
                  <!-- Tracking Pixel (1x1 görünmez resim) -->
                   <img src="https://${domain}/" 
                       width="1" height="1" style="display:none;" 
                       alt="" />
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
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #dc3545; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Şifre Sıfırlama</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">DijiKart Hesabınız İçin Şifre Sıfırlama Talebi</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 25px 0; font-size: 24px;">Merhaba ${userName},</h2>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                    DijiKart hesabınız için şifre sıfırlama talebinde bulundunuz. Eğer bu talebi siz yapmadıysanız, bu maili görmezden gelebilirsiniz.
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background-color: #dc3545; border-radius: 25px; padding: 15px 30px;">
                              <a href="${resetLink}" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">Şifremi Sıfırla</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Security Notes -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border: 2px solid #ffeaa7; border-radius: 8px; margin: 25px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="color: #856404; margin: 0 0 20px 0; font-size: 18px;">Güvenlik Notu:</h3>
                        <ul style="color: #856404; line-height: 1.6; margin: 0; font-size: 16px; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Bu link 24 saat geçerlidir</li>
                          <li style="margin-bottom: 8px;">Linki kimseyle paylaşmayın</li>
                          <li style="margin-bottom: 8px;">Şifrenizi güçlü tutun</li>
                          <li style="margin-bottom: 8px;">İki faktörlü doğrulama kullanın</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 35px 0;">
                  <p style="color: #999999; font-size: 14px; text-align: center; margin: 0;">
                    Bu mail DijiKart QR Kod sistemi tarafından gönderilmiştir.<br>
                    Sorularınız için: <a href="mailto:pak@medya.group" style="color: #007bff;">pak@medya.group</a>
                  </p>
                  
                  <!-- Tracking Pixel (1x1 görünmez resim) -->
                  <img src="https://${domain}/" 
                       width="1" height="1" style="display:none;" 
                       alt="" />
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

module.exports = {
  sendMail,
  mailTemplates
};

