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
            console.log('Dashboard: fetchUserData called');

            // Firebase'den mevcut kullanıcıyı al
            const firebaseUser = getCurrentUser();
            console.log('Dashboard: Firebase user:', firebaseUser);
            
            if (!firebaseUser) {
                console.error('Dashboard: No Firebase user found');
                // Kullanıcı giriş yapmamış, auth'a yönlendir
                window.location.href = '/auth';
                return;
            }

            console.log('Dashboard: User UID:', firebaseUser.uid);
            console.log('Dashboard: User email:', firebaseUser.email);
            console.log('Dashboard: User displayName:', firebaseUser.displayName);
            console.log('Dashboard: User emailVerified:', firebaseUser.emailVerified);

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
            console.log('Dashboard: saveSiteData called with data:', data);
            
            const firebaseUser = getCurrentUser();
            console.log('Dashboard: Firebase user in saveSiteData:', firebaseUser);

            if (!firebaseUser) {
                console.error('Dashboard: No Firebase user in saveSiteData');
                alert('Lütfen önce giriş yapın!');
                return;
            }

            // Get user's sites to find the correct subdomain
            console.log('Fetching user sites for UID:', firebaseUser.uid);
            const sitesResponse = await fetch('https://personal-site-saas-api.l5819033.workers.dev/api/user/sites', {
                headers: {
                    'Authorization': `Bearer ${firebaseUser.uid}`
                }
            });
            
            console.log('Sites response status:', sitesResponse.status);
            
            if (!sitesResponse.ok) {
                console.error('Failed to fetch user sites:', sitesResponse.status, sitesResponse.statusText);
                alert('Kullanıcı siteleri alınamadı!');
                return;
            }
            
            const sites = await sitesResponse.json();
            console.log('User sites:', sites);
            
            if (!sites || sites.length === 0) {
                console.error('No sites found for user');
                alert('Kullanıcının sitesi bulunamadı!');
                return;
            }
            
            const subdomain = sites[0].subdomain;
            console.log('Using subdomain:', subdomain);
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