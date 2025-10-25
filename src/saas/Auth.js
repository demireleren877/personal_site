import React, { useState } from 'react';
import { registerUser, loginUser, reloadUser, loginWithGoogle } from '../firebase/authService';
import { useAuth } from '../hooks/useAuth';
import { handleError } from '../utils/errorHandler';
import EmailVerification from '../components/EmailVerification';
import LoadingSpinner from '../components/LoadingSpinner';
import './Auth.css';

const Auth = () => {
    const { loading: authLoading, error: authError } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEmailVerification, setShowEmailVerification] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!isLogin) {
                // Kayıt ol
                if (formData.password !== formData.confirmPassword) {
                    setError('Şifreler eşleşmiyor');
                    setLoading(false);
                    return;
                }

                const result = await registerUser(formData.email, formData.password, formData.name);
                
                if (result.success) {
                    setShowEmailVerification(true);
                } else {
                    setError(result.error);
                }
            } else {
                // Giriş yap
                const result = await loginUser(formData.email, formData.password);
                
                if (result.success) {
                    if (result.user.emailVerified) {
                        // useAuth hook will handle the authentication state
                        window.location.href = '/dashboard';
                    } else {
                        setShowEmailVerification(true);
                    }
                } else {
                    setError(result.error);
                }
            }
        } catch (error) {
            const errorInfo = handleError(error, 'Auth form submission');
            setError(errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError('');

            const result = await loginWithGoogle();
            
            if (result.success) {
                // useAuth hook will handle the authentication state
                window.location.href = '/dashboard';
            } else {
                setError(result.error);
            }
        } catch (error) {
            const errorInfo = handleError(error, 'Google login');
            setError(errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailVerified = async () => {
        try {
            // Kullanıcı bilgilerini yenile
            const result = await reloadUser();
            
            if (result.success && result.user.emailVerified) {
                // useAuth hook will handle the authentication state
                window.location.href = '/dashboard';
            } else {
                console.error('Email verification failed:', result.error);
                setError('Email doğrulama başarısız. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            const errorInfo = handleError(error, 'Email verification');
            setError(errorInfo.message);
        }
    };

    // Show loading spinner if auth is loading
    if (authLoading) {
        return <LoadingSpinner fullscreen text="Kimlik doğrulama yükleniyor..." />;
    }

    // Email verification ekranını göster
    if (showEmailVerification) {
        return <EmailVerification onVerified={handleEmailVerified} />;
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Personal Site Builder</h1>
                    <p>Kendi portfolyo sitenizi oluşturun</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(true)}
                    >
                        Giriş Yap
                    </button>
                    <button
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(false)}
                    >
                        Kayıt Ol
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Ad Soyad</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Adınızı girin"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">E-posta</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Şifrenizi girin"
                            minLength="6"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Şifre Tekrar</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Şifrenizi tekrar girin"
                                minLength="6"
                            />
                        </div>
                    )}

                    {(error || authError) && (
                        <div className="error-message">
                            {error || authError}
                        </div>
                    )}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>veya</span>
                    </div>

                    <button
                        className="google-button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg className="google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>

                <div className="auth-footer">
                    <p>
                        {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Kayıt olun' : 'Giriş yapın'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;