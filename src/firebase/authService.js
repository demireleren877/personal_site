import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from './config';

// Kullanıcı kayıt olma
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı adını güncelle
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Email verification gönder
    await sendEmailVerification(user);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Kullanıcı giriş yapma
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Google ile giriş yapma
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Kullanıcı çıkış yapma
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Email verification gönderme
export const sendVerificationEmail = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Kullanıcı giriş yapmamış'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Şifre sıfırlama emaili gönderme
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Auth state değişikliklerini dinleme
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Mevcut kullanıcıyı alma
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Kullanıcı bilgilerini yenileme (email verification sonrası)
export const reloadUser = async () => {
  try {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return {
        success: true,
        user: {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          emailVerified: auth.currentUser.emailVerified
        }
      };
    } else {
      return {
        success: false,
        error: 'Kullanıcı giriş yapmamış'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Hata mesajlarını Türkçe'ye çevirme
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Bu email adresi zaten kullanılıyor',
    'auth/invalid-email': 'Geçersiz email adresi',
    'auth/operation-not-allowed': 'Bu işlem şu anda izin verilmiyor',
    'auth/weak-password': 'Şifre çok zayıf',
    'auth/user-disabled': 'Bu kullanıcı hesabı devre dışı bırakılmış',
    'auth/user-not-found': 'Bu email adresi ile kayıtlı kullanıcı bulunamadı',
    'auth/wrong-password': 'Yanlış şifre',
    'auth/invalid-credential': 'Geçersiz kimlik bilgileri',
    'auth/too-many-requests': 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin',
    'auth/network-request-failed': 'Ağ bağlantısı hatası',
    'auth/requires-recent-login': 'Bu işlem için tekrar giriş yapmanız gerekiyor'
  };
  
  return errorMessages[errorCode] || 'Bilinmeyen bir hata oluştu';
};
