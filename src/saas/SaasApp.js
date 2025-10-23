import React, { useState, useEffect } from 'react';
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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

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
             !hostname.includes('erendemirel.com.tr') &&
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
    
    // If user is logged in and on dashboard path, show dashboard
    if (user && currentPath === '/dashboard') {
        return <Dashboard />;
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