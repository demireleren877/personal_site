import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import SubdomainSite from './SubdomainSite';
import './SaasApp.css';

const SaasApp = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
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

    // Only treat as subdomain if it's a real subdomain (not the main domain)
    const isSubdomain = hostname.includes('.') && 
                       !hostname.includes('localhost') && 
                       !hostname.includes('127.0.0.1') &&
                       !hostname.includes('erendemirel.com.tr') && // Main domain
                       hostname.split('.').length > 2; // Real subdomain

    if (isSubdomain || testSubdomain) {
        const subdomain = testSubdomain || hostname.split('.')[0];
        if (subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'erendemirel') {
            return <SubdomainSite subdomain={subdomain} />;
        }
    }

    return (
        <div className="saas-app">
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Auth />} />
                <Route path="*" element={<Auth />} />
            </Routes>
        </div>
    );
};

export default SaasApp;