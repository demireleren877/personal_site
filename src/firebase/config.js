import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase konfigürasyonu
// Bu değerleri Firebase Console'dan alacaksınız
const firebaseConfig = {
  apiKey: "AIzaSyBlWbeCGXBoNnjrOtJWU8UyTEaPuRA1Fsk",
  authDomain: "cvapp-c13d9.firebaseapp.com",
  projectId: "cvapp-c13d9",
  storageBucket: "cvapp-c13d9.firebasestorage.app",
  messagingSenderId: "1005723033938",
  appId: "1:1005723033938:web:fc04b09e27ce4f7279da8b",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Authentication servisini al
export const auth = getAuth(app);

export default app;
