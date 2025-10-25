import React, { useState, useEffect } from 'react';
import { sendVerificationEmail, getCurrentUser, reloadUser } from '../firebase/authService';
import './EmailVerification.css';

const EmailVerification = ({ onVerified }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleSendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await sendVerificationEmail();
      
      if (result.success) {
        setMessage('Doğrulama emaili gönderildi. Lütfen email kutunuzu kontrol edin.');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Email gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Kullanıcı bilgilerini yenile
      const result = await reloadUser();
      
      if (result.success) {
        if (result.user.emailVerified) {
          setUser(result.user);
          onVerified();
        } else {
          setMessage('Email henüz doğrulanmamış. Lütfen email kutunuzu kontrol edin.');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Doğrulama kontrol edilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="email-verification">
        <div className="verification-card">
          <h2>Giriş Yapın</h2>
          <p>Email doğrulama için önce giriş yapmanız gerekiyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-verification">
      <div className="verification-card">
        <div className="verification-header">
          <h2>Email Doğrulama</h2>
          <p>Hesabınızı aktifleştirmek için email adresinizi doğrulamanız gerekiyor.</p>
        </div>

        <div className="verification-info">
          <div className="user-info">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="verification-status">
            <strong>Durum:</strong> 
            <span className={user.emailVerified ? 'verified' : 'not-verified'}>
              {user.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
            </span>
          </div>
        </div>

        {!user.emailVerified && (
          <div className="verification-actions">
            <button 
              onClick={handleSendVerification}
              disabled={loading}
              className="send-verification-btn"
            >
              {loading ? 'Gönderiliyor...' : 'Doğrulama Emaili Gönder'}
            </button>
            
            <button 
              onClick={handleCheckVerification}
              disabled={loading}
              className="check-verification-btn"
            >
              {loading ? 'Kontrol Ediliyor...' : 'Doğrulamayı Kontrol Et'}
            </button>
          </div>
        )}

        {user.emailVerified && (
          <div className="verification-success">
            <div className="success-icon">✓</div>
            <p>Email adresiniz başarıyla doğrulandı!</p>
            <button 
              onClick={onVerified}
              className="continue-btn"
            >
              Devam Et
            </button>
          </div>
        )}

        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <div className="verification-help">
          <h4>Yardım</h4>
          <ul>
            <li>Email gelmedi mi? Spam klasörünü kontrol edin.</li>
            <li>Email adresinizi yanlış girdiyseniz, çıkış yapıp tekrar kayıt olun.</li>
            <li>Doğrulama linkine tıkladıktan sonra "Doğrulamayı Kontrol Et" butonuna basın.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
