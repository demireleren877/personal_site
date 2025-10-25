import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { handleError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import './SubdomainSite.css';

const SubdomainSite = ({ subdomain }) => {
    const [siteData, setSiteData] = useState({
        hero: { name: '', title: '', description: '', github_url: '', linkedin_url: '' },
        experiences: [],
        education: [],
        competencies: [],
        tools: [],
        languages: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSiteData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Load all site data using apiClient
            const [heroRes, experiencesRes, educationRes, competenciesRes, toolsRes, languagesRes] = await Promise.all([
                apiClient.get(`/api/site/${subdomain}/hero`),
                apiClient.get(`/api/site/${subdomain}/experiences`),
                apiClient.get(`/api/site/${subdomain}/education`),
                apiClient.get(`/api/site/${subdomain}/competencies`),
                apiClient.get(`/api/site/${subdomain}/tools`),
                apiClient.get(`/api/site/${subdomain}/languages`)
            ]);

            const hero = heroRes.ok ? await heroRes.json() : { name: '', title: '', description: '', github_url: '', linkedin_url: '' };
            const experiences = experiencesRes.ok ? await experiencesRes.json() : [];
            const education = educationRes.ok ? await educationRes.json() : [];
            const competencies = competenciesRes.ok ? await competenciesRes.json() : [];
            const tools = toolsRes.ok ? await toolsRes.json() : [];
            const languages = languagesRes.ok ? await languagesRes.json() : [];

            setSiteData({
                hero,
                experiences,
                education,
                competencies,
                tools,
                languages
            });

        } catch (error) {
            const errorInfo = handleError(error, 'Subdomain site load');
            console.error('Error loading site data:', errorInfo);
            setError(errorInfo.message);
        } finally {
            setLoading(false);
        }
    }, [subdomain]);

    useEffect(() => {
        loadSiteData();
    }, [loadSiteData]);

    if (loading) {
        return <LoadingSpinner fullscreen text="Site yükleniyor..." />;
    }

    if (error) {
        return (
            <div className="subdomain-error">
                <h2>Site Bulunamadı</h2>
                <p>Bu site mevcut değil veya yayınlanmamış.</p>
                <a href="/" className="home-link">Ana Sayfaya Dön</a>
            </div>
        );
    }

    return (
        <div className="App">
            <Header />
            <main>
                <Hero heroData={siteData.hero} />
                <Experience experiences={siteData.experiences} />
                <Education education={siteData.education} />
                <Skills
                    competencies={siteData.competencies}
                    tools={siteData.tools}
                    languages={siteData.languages}
                />
                <Contact />
            </main>
        </div>
    );
};

export default SubdomainSite;
