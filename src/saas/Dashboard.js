import React, { useState, useEffect } from 'react';
import SiteBuilder from './SiteBuilder';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sites, setSites] = useState([]);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const [customDomain, setCustomDomain] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    useEffect(() => {
        fetchUserData();
        fetchUserSites();
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

    const fetchUserSites = async () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (!token || !userData) {
                return;
            }

            const user = JSON.parse(userData);
            const response = await fetch('https://personal-site-saas-api.l5819033.workers.dev/api/user/sites', {
                headers: {
                    'Authorization': `Bearer ${user.id}`
                }
            });

            if (response.ok) {
                const sitesData = await response.json();
                setSites(sitesData);
            }
        } catch (error) {
            console.error('Error fetching user sites:', error);
        }
    };

    const handleAddCustomDomain = (site) => {
        setSelectedSite(site);
        setCustomDomain('');
        setShowDomainModal(true);
    };

    const handleSaveCustomDomain = async () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (!token || !userData || !selectedSite) {
                alert('Lütfen önce giriş yapın!');
                return;
            }

            const user = JSON.parse(userData);
            const response = await fetch('https://personal-site-saas-api.l5819033.workers.dev/api/user/domain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.id}`
                },
                body: JSON.stringify({
                    site_id: selectedSite.id,
                    custom_domain: customDomain
                })
            });

            if (response.ok) {
                alert('Custom domain başarıyla eklendi!');
                setShowDomainModal(false);
                fetchUserSites(); // Refresh sites list
            } else {
                const error = await response.json();
                alert(`Hata: ${error.error || 'Domain eklenemedi'}`);
            }
        } catch (error) {
            console.error('Error adding custom domain:', error);
            alert('Domain eklenirken hata oluştu!');
        }
    };

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
                    <span>Hoş geldin, {user?.name}</span>
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

                <div className="content-section">
                    <h2>Siteleriniz</h2>
                    <div className="sites-list">
                        {sites.map((site) => (
                            <div key={site.id} className="site-card">
                                <div className="site-info">
                                    <h3>{site.site_name}</h3>
                                    <p>Subdomain: {site.subdomain}.yourdomain.com</p>
                                    {site.domain && (
                                        <p>Custom Domain: {site.domain}</p>
                                    )}
                                    <p>Status: {site.is_published ? 'Yayında' : 'Taslak'}</p>
                                </div>
                                <div className="site-actions">
                                    <button
                                        className="domain-btn"
                                        onClick={() => handleAddCustomDomain(site)}
                                    >
                                        {site.domain ? 'Domain Değiştir' : 'Custom Domain Ekle'}
                                    </button>
                                    <a
                                        href={`https://${site.subdomain}.yourdomain.com`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="view-site-btn"
                                    >
                                        Siteyi Görüntüle
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Domain Modal */}
            {showDomainModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Custom Domain Ekle</h3>
                        <p>Site: {selectedSite?.site_name}</p>
                        <div className="form-group">
                            <label htmlFor="customDomain">Domain Adı:</label>
                            <input
                                type="text"
                                id="customDomain"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                placeholder="ornek.com"
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowDomainModal(false)}
                            >
                                İptal
                            </button>
                            <button
                                className="save-btn"
                                onClick={handleSaveCustomDomain}
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;