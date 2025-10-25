import React, { useState, useEffect } from 'react';
import { logoutUser, getCurrentUser } from '../firebase/authService';
import SiteBuilder from './SiteBuilder';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('user');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Yine de localStorage'ı temizle
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    };

    useEffect(() => {
        fetchUserData();
        
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);

            // Firebase'den mevcut kullanıcıyı al
            const firebaseUser = getCurrentUser();
            
            if (!firebaseUser) {
                // Kullanıcı giriş yapmamış, auth'a yönlendir
                window.location.href = '/auth';
                return;
            }

            // Kullanıcı bilgilerini ayarla
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                emailVerified: firebaseUser.emailVerified
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };


    const saveSiteData = async (data) => {
        try {
            const firebaseUser = getCurrentUser();

            if (!firebaseUser) {
                alert('Lütfen önce giriş yapın!');
                return;
            }

            const subdomain = firebaseUser.displayName?.toLowerCase().replace(/\s+/g, '-') || 'user';

            console.log('Saving data for user:', firebaseUser.uid, 'subdomain:', subdomain);

            // Save to API
            const response = await fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseUser.uid}` // Use Firebase UID as token
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Site verileri başarıyla kaydedildi!');
                console.log('Saved data:', result);
            } else {
                const error = await response.json();
                alert(`Hata: ${error.error || 'Veri kaydedilemedi'}`);
                console.error('API Error:', error);
            }
        } catch (error) {
            console.error('Error saving site data:', error);
            alert('Veri kaydedilirken hata oluştu!');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="simple-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="user-info">
                    <span>Hoş geldin, {user?.displayName || user?.email}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Çıkış Yap
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="content-section">
                    <div className="site-builder-section">
                        <SiteBuilder
                            siteId="default"
                            onSave={saveSiteData}
                        />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;