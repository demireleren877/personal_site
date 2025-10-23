import React, { useState, useEffect } from 'react';
import SiteBuilder from './SiteBuilder';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);

            // Get user data from localStorage
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userData || !token) {
                // No user data, redirect to auth
                window.location.href = '/auth';
                return;
            }

            try {
                const user = JSON.parse(userData);
                setUser(user);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/auth';
                return;
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    // Removed unused functions

    const saveSiteData = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (!token || !userData) {
                alert('Lütfen önce giriş yapın!');
                return;
            }

            const user = JSON.parse(userData);
            const subdomain = user.name?.toLowerCase().replace(/\s+/g, '-') || 'user';

            console.log('Saving data for user:', user.id, 'subdomain:', subdomain);

            // Save to API
            const response = await fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.id}` // Use user ID as token
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

    console.log('Dashboard render - loading:', loading, 'user:', user);

    if (loading) {
        console.log('Dashboard showing loading state');
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    console.log('Dashboard rendering main content');
    return (
        <div style={{ padding: '20px', background: 'lightblue', minHeight: '100vh' }}>
            <h1>DASHBOARD ÇALIŞIYOR!</h1>
            <p>User: {user?.name}</p>
            <p>Email: {user?.email}</p>
        </div>
        <div className="simple-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="user-info">
                    <span>Hoş geldin, {user?.name}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Çıkış Yap
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="content-section">
                    <h2>Portfolyo Sitenizi Düzenleyin</h2>
                    <p>Kendi portfolyo sitenizi oluşturun ve düzenleyin.</p>

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