import React, { useState, useEffect } from 'react';
import { onAuthStateChange } from '../firebase/authService';
import Auth from './Auth';
import Dashboard from './Dashboard';
import SubdomainSite from './SubdomainSite';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import './SaasApp.css';

const SaasApp = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Firebase auth state değişikliklerini dinle
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified
                });
                // localStorage'a kaydet
                localStorage.setItem('user', JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified
                }));

                // Firebase kullanıcısını API'ye kaydet (sadece ilk kez)
                const registrationKey = `firebase_registered_${firebaseUser.uid}`;
                if (!localStorage.getItem(registrationKey)) {
                    try {
                        const response = await fetch('https://personal-site-saas-api.l5819033.workers.dev/api/auth/firebase-register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                firebaseUid: firebaseUser.uid,
                                email: firebaseUser.email,
                                name: firebaseUser.displayName || firebaseUser.email,
                                displayName: firebaseUser.displayName
                            })
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            console.log('Firebase user registration:', result.message || 'Success');
                            localStorage.setItem(registrationKey, 'true');
                            // Registration tamamlandı event'i dispatch et
                            window.dispatchEvent(new CustomEvent('firebaseRegistrationComplete', {
                                detail: { uid: firebaseUser.uid }
                            }));
                        }
                    } catch (error) {
                        console.log('Firebase user registration error:', error);
                    }
                }
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="saas-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Check if we're on a subdomain or testing with URL parameter
    const hostname = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    const testSubdomain = urlParams.get('subdomain');

    console.log('SaasApp - hostname:', hostname);
    console.log('SaasApp - testSubdomain:', testSubdomain);
    console.log('SaasApp - window.location.search:', window.location.search);
    console.log('SaasApp - window.location.href:', window.location.href);
    console.log('SaasApp - urlParams.toString():', urlParams.toString());

    // Simple subdomain check
    let subdomain = null;

    // Check for test subdomain parameter (localhost testing)
    if (testSubdomain) {
        subdomain = testSubdomain;
        console.log('SaasApp - Using test subdomain:', subdomain);
    }
    // Check for real subdomain (not localhost)
    else if (hostname.includes('.') &&
        !hostname.includes('localhost') &&
        !hostname.includes('127.0.0.1') &&
        hostname.split('.').length > 2) {
        subdomain = hostname.split('.')[0];
        console.log('SaasApp - Using real subdomain:', subdomain);
    }

    if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'erendemirel') {
        console.log('SaasApp - rendering SubdomainSite for:', subdomain);
        return <SubdomainSite subdomain={subdomain} />;
    }

    // Check current path
    const currentPath = window.location.pathname;

    // If on dashboard path, check authentication
    if (currentPath === '/dashboard') {
        if (user && user.emailVerified) {
            return <Dashboard />;
        } else {
            // Kullanıcı giriş yapmamış veya email doğrulanmamış
            return <Auth />;
        }
    }

    // If on auth path, show auth
    if (currentPath === '/auth') {
        return <Auth />;
    }

    // Otherwise show main site
    return (
        <div className="App">
            <Header />
            <main>
                <Hero />
                <Experience />
                <Education />
                <Skills />
                <Contact />
            </main>
        </div>
    );
};

export default SaasApp;