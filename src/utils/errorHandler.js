// Centralized error handling utility
export const ErrorTypes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTH_ERROR: 'AUTH_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const ErrorMessages = {
    [ErrorTypes.NETWORK_ERROR]: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
    [ErrorTypes.AUTH_ERROR]: 'Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.',
    [ErrorTypes.VALIDATION_ERROR]: 'Girilen bilgiler geçersiz. Lütfen kontrol edin.',
    [ErrorTypes.SERVER_ERROR]: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    [ErrorTypes.UNKNOWN_ERROR]: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
};

// Standardized error handler
export const handleError = (error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    // Network errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        return {
            type: ErrorTypes.NETWORK_ERROR,
            message: ErrorMessages[ErrorTypes.NETWORK_ERROR],
            originalError: error
        };
    }
    
    // Firebase auth errors
    if (error.code?.startsWith('auth/')) {
        return {
            type: ErrorTypes.AUTH_ERROR,
            message: getFirebaseErrorMessage(error.code),
            originalError: error
        };
    }
    
    // API errors
    if (error.status) {
        if (error.status === 401 || error.status === 403) {
            return {
                type: ErrorTypes.AUTH_ERROR,
                message: 'Yetkilendirme hatası. Lütfen tekrar giriş yapın.',
                originalError: error
            };
        }
        
        if (error.status >= 400 && error.status < 500) {
            return {
                type: ErrorTypes.VALIDATION_ERROR,
                message: error.message || ErrorMessages[ErrorTypes.VALIDATION_ERROR],
                originalError: error
            };
        }
        
        if (error.status >= 500) {
            return {
                type: ErrorTypes.SERVER_ERROR,
                message: ErrorMessages[ErrorTypes.SERVER_ERROR],
                originalError: error
            };
        }
    }
    
    // Default error
    return {
        type: ErrorTypes.UNKNOWN_ERROR,
        message: error.message || ErrorMessages[ErrorTypes.UNKNOWN_ERROR],
        originalError: error
    };
};

// Firebase error message mapping
const getFirebaseErrorMessage = (code) => {
    const firebaseErrors = {
        'auth/user-not-found': 'Kullanıcı bulunamadı.',
        'auth/wrong-password': 'Hatalı şifre.',
        'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanımda.',
        'auth/weak-password': 'Şifre çok zayıf. En az 6 karakter olmalı.',
        'auth/invalid-email': 'Geçersiz e-posta adresi.',
        'auth/user-disabled': 'Bu hesap devre dışı bırakılmış.',
        'auth/too-many-requests': 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.',
        'auth/network-request-failed': 'Ağ bağlantısı hatası.',
        'auth/invalid-credential': 'Geçersiz kimlik bilgileri.',
        'auth/email-not-verified': 'E-posta adresinizi doğrulamanız gerekiyor.',
        'auth/requires-recent-login': 'Bu işlem için tekrar giriş yapmanız gerekiyor.'
    };
    
    return firebaseErrors[code] || 'Kimlik doğrulama hatası.';
};

// Success message handler
export const handleSuccess = (message, context = '') => {
    console.log(`Success in ${context}:`, message);
    return {
        success: true,
        message: message,
        context: context
    };
};

// API response handler
export const handleApiResponse = async (response, context = '') => {
    try {
        if (response.ok) {
            const data = await response.json();
            return handleSuccess(data.message || 'İşlem başarılı', context);
        } else {
            const errorData = await response.json();
            // eslint-disable-next-line no-throw-literal
            throw {
                status: response.status,
                message: errorData.error || errorData.message || 'API hatası',
                data: errorData
            };
        }
        } catch (error) {
            const errorInfo = handleError(error, context);
            // eslint-disable-next-line no-throw-literal
            throw errorInfo;
        }
};
