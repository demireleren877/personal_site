import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../utils/apiClient';
import { handleError, handleApiResponse } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';
import SiteBuilder from './SiteBuilder';
import './Dashboard.css';

const Dashboard = () => {
    const { user, loading, error, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/';
        }
    };

    // User data is now managed by useAuth hook
    // No need for separate fetchUserData function


    const saveSiteData = async (data) => {
        try {
            if (!user) {
                alert('Lütfen önce giriş yapın!');
                return;
            }

            const subdomain = user.displayName?.toLowerCase().replace(/\s+/g, '-') || 'user';

            console.log('Saving data for user:', user.uid, 'subdomain:', subdomain);

            // Save to API using apiClient
            const response = await apiClient.put(`/api/site/${subdomain}`, data, {
                headers: {
                    'Authorization': `Bearer ${user.uid}`
                }
            });

            const result = await handleApiResponse(response, 'Site data save');
            alert(result.message);
            console.log('Saved data:', result);
        } catch (error) {
            const errorInfo = handleError(error, 'Site data save');
            alert(`Hata: ${errorInfo.message}`);
        }
    };

    if (loading) {
        return <LoadingSpinner fullscreen text="Dashboard yükleniyor..." />;
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <p>Hata: {error}</p>
                <button onClick={logout}>Çıkış Yap</button>
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