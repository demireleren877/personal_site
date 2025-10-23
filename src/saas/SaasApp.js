import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';
import SubdomainSite from './SubdomainSite';
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

    return (
        <div className="saas-app">
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                    user ? <Dashboard /> : <Auth />
                } />
                <Route path="*" element={
                    user ? <Dashboard /> : <Auth />
                } />
            </Routes>
        </div>
    );
};

export default SaasApp;