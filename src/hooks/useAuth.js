import { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChange, getCurrentUser, logoutUser } from '../firebase/authService';
import { apiClient } from '../utils/apiClient';

// Centralized authentication state management
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isD1Registered, setIsD1Registered] = useState(false);
    
    // Ref to prevent infinite loops
    const processingUserRef = useRef(null);
    const isInitializedRef = useRef(false);

    // Check if user is registered in D1 database
    const checkD1Registration = useCallback(async (firebaseUser) => {
        if (!firebaseUser) return false;

        try {
            const response = await apiClient.get('/api/user/check', {
                headers: {
                    'Authorization': `Bearer ${firebaseUser.uid}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                return result.registered;
            }
            return false;
        } catch (error) {
            console.error('Error checking D1 registration:', error);
            return false;
        }
    }, []);

    // Register Firebase user in D1 database
    const registerInD1 = useCallback(async (firebaseUser) => {
        if (!firebaseUser) return false;

        try {
            const response = await apiClient.post('/api/auth/firebase-register', {
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
            });

            if (response.ok) {
                const result = await response.json();
                console.log('D1 registration successful:', result);
                return true;
            } else {
                const error = await response.json();
                console.error('D1 registration failed:', error);
                return false;
            }
        } catch (error) {
            console.error('Error registering in D1:', error);
            return false;
        }
    }, []);

    // Handle authentication state changes with improved loop protection
    const handleAuthStateChange = useCallback(async (firebaseUser) => {
        // Prevent infinite loops with ref-based tracking
        const currentUserId = firebaseUser?.uid;
        
        if (processingUserRef.current === currentUserId) {
            console.log('User already being processed, skipping...');
            return;
        }

        // Prevent processing same user multiple times
        if (user?.uid === currentUserId && isD1Registered) {
            console.log('User already authenticated and registered, skipping...');
            return;
        }

        processingUserRef.current = currentUserId;
        setLoading(true);
        setError(null);

        try {
            if (firebaseUser && firebaseUser.emailVerified) {
                console.log('Firebase user authenticated:', firebaseUser.uid);
                
                // Check if user is registered in D1
                const isRegistered = await checkD1Registration(firebaseUser);
                
                if (!isRegistered) {
                    console.log('User not registered in D1, registering...');
                    const registrationSuccess = await registerInD1(firebaseUser);
                    
                    if (registrationSuccess) {
                        setIsD1Registered(true);
                        setUser(firebaseUser);
                        // Store user in localStorage for persistence
                        localStorage.setItem('user', JSON.stringify(firebaseUser));
                        localStorage.setItem('d1_registered', 'true');
                    } else {
                        setError('Kullanıcı kaydı oluşturulamadı. Lütfen tekrar deneyin.');
                        setUser(null);
                        setIsD1Registered(false);
                    }
                } else {
                    console.log('User already registered in D1');
                    setIsD1Registered(true);
                    setUser(firebaseUser);
                    localStorage.setItem('user', JSON.stringify(firebaseUser));
                    localStorage.setItem('d1_registered', 'true');
                }
            } else {
                console.log('No authenticated user or email not verified');
                setUser(null);
                setIsD1Registered(false);
                localStorage.removeItem('user');
                localStorage.removeItem('d1_registered');
            }
        } catch (error) {
            console.error('Auth state change error:', error);
            setError('Kimlik doğrulama hatası. Lütfen tekrar deneyin.');
            setUser(null);
            setIsD1Registered(false);
        } finally {
            setLoading(false);
            processingUserRef.current = null;
        }
    }, [checkD1Registration, registerInD1, user?.uid, isD1Registered]);

    // Initialize authentication
    useEffect(() => {
        let unsubscribe;

        const initializeAuth = async () => {
            try {
                // Check localStorage first for faster initial load
                const storedUser = localStorage.getItem('user');
                const isD1Registered = localStorage.getItem('d1_registered') === 'true';
                
                if (storedUser && isD1Registered) {
                    const user = JSON.parse(storedUser);
                    setUser(user);
                    setIsD1Registered(true);
                    setLoading(false);
                    isInitializedRef.current = true;
                }

                // Set up Firebase auth state listener
                unsubscribe = onAuthStateChange(handleAuthStateChange);
            } catch (error) {
                console.error('Auth initialization error:', error);
                setError('Kimlik doğrulama başlatılamadı.');
                setLoading(false);
            }
        };

        if (!isInitializedRef.current) {
            initializeAuth();
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [handleAuthStateChange]);

    // Manual refresh function
    const refreshAuth = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const currentUser = getCurrentUser();
            if (currentUser) {
                await handleAuthStateChange(currentUser);
            } else {
                setUser(null);
                setIsD1Registered(false);
                localStorage.removeItem('user');
                localStorage.removeItem('d1_registered');
            }
        } catch (error) {
            console.error('Auth refresh error:', error);
            setError('Kimlik doğrulama yenilenemedi.');
        } finally {
            setLoading(false);
        }
    }, [handleAuthStateChange]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            setUser(null);
            setIsD1Registered(false);
            localStorage.removeItem('user');
            localStorage.removeItem('d1_registered');
            
            // Firebase logout
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
            setError('Çıkış yapılırken hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        loading,
        error,
        isD1Registered,
        refreshAuth,
        logout,
        isAuthenticated: !!user && isD1Registered
    };
};
