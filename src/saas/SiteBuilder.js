import React, { useState, useEffect } from 'react';
import './SiteBuilder.css';

const SiteBuilder = ({ siteId, onSave }) => {
    const [siteData, setSiteData] = useState({
        hero: {
            name: '',
            title: '',
            description: '',
            birth_year: '',
            location: '',
            current_job: '',
            github_url: '',
            linkedin_url: '',
            cv_url: ''
        },
        experiences: [],
        experienceAchievements: [],
        education: [],
        educationAchievements: [],
        competencies: [],
        tools: [],
        languages: []
    });
    const [activeSection, setActiveSection] = useState('hero');
    const [loading, setLoading] = useState(false);
    const [expandedExperiences, setExpandedExperiences] = useState({});
    const [expandedEducation, setExpandedEducation] = useState({});
    const [expandedSkills, setExpandedSkills] = useState({
        competencies: true,
        tools: true,
        languages: true
    });
        const [sites, setSites] = useState([]);
        const [showDomainModal, setShowDomainModal] = useState(false);
        const [selectedSite, setSelectedSite] = useState(null);
        const [customDomain, setCustomDomain] = useState('');
        const [domainLoading, setDomainLoading] = useState(false);

    useEffect(() => {
        loadSiteData();
        fetchUserSites();
    }, [siteId]);

    const loadSiteData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (!token || !userData) {
                setLoading(false);
                return;
            }

            const user = JSON.parse(userData);
            const subdomain = user.name?.toLowerCase().replace(/\s+/g, '-') || 'user';

            // Load existing site data from API
            const [heroRes, experiencesRes, educationRes, competenciesRes, toolsRes, languagesRes] = await Promise.all([
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/hero`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/experiences`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/education`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/competencies`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/tools`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/languages`)
            ]);

            const heroData = heroRes.ok ? await heroRes.json() : null;
            const experiences = experiencesRes.ok ? await experiencesRes.json() : [];
            const educationRaw = educationRes.ok ? await educationRes.json() : [];
            console.log('Education API response:', educationRaw);
            // Map API fields to form model for education
            const education = (educationRaw || []).map((e) => ({
                ...e,
                institution: e.institution !== undefined ? e.institution : (e.school || ''),
                field: e.field !== undefined ? e.field : (e.field_of_study || ''),
            }));
            console.log('Mapped education data:', education);
            const competencies = competenciesRes.ok ? await competenciesRes.json() : [];
            const tools = toolsRes.ok ? await toolsRes.json() : [];
            const languages = languagesRes.ok ? await languagesRes.json() : [];

            console.log('Loaded experiences from API:', experiences);

            setSiteData({
                hero: heroData || {
                    name: '',
                    title: '',
                    description: '',
                    birth_year: '',
                    location: '',
                    current_job: '',
                    github_url: '',
                    linkedin_url: '',
                    cv_url: ''
                },
                experiences: experiences || [],
                experienceAchievements: [],
                education: education || [],
                educationAchievements: [],
                competencies: competencies || [],
                tools: tools || [],
                languages: languages || []
            });
        } catch (error) {
            console.error('Error loading site data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserSites = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const user = JSON.parse(userData);
            const response = await fetch('https://personal-site-saas-api.l5819033.workers.dev/api/user/sites', {
                headers: {
                    'Authorization': `Bearer ${user.uid}`
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
            // Eğer domain varsa, sadece subdomain kısmını göster
            if (site.domain) {
                const subdomain = site.domain.replace('.erendemirel.com.tr', '');
                setCustomDomain(subdomain);
            } else {
                setCustomDomain('');
            }
            setShowDomainModal(true);
        };

        const handleSaveCustomDomain = async () => {
            // Spam koruması - loading durumunda işlem yapma
            if (domainLoading) {
                return;
            }

            try {
                setDomainLoading(true);
                
                const userData = localStorage.getItem('user');
                if (!userData || !selectedSite) {
                    alert('Lütfen önce giriş yapın!');
                    setDomainLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                const fullDomain = `${customDomain}.erendemirel.com.tr`;
                
                // Aynı domain zaten eklenmiş mi kontrol et
                if (selectedSite.domain === fullDomain) {
                    alert('Bu domain zaten eklenmiş!');
                    setDomainLoading(false);
                    return;
                }

                const response = await fetch('https://personal-site-saas-api.l5819033.workers.dev/api/user/domain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.uid}`
                    },
                    body: JSON.stringify({
                        site_id: selectedSite.id,
                        custom_domain: fullDomain
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.message === 'Domain already exists') {
                        alert('Bu domain zaten kullanımda! Lütfen farklı bir domain seçin.');
                    } else if (result.message === 'Domain updated successfully') {
                        alert('Domain başarıyla güncellendi! Eski domain kaldırıldı ve yeni domain eklendi.');
                        setShowDomainModal(false);
                        fetchUserSites(); // Refresh sites list
                    } else {
                        alert('Custom domain başarıyla eklendi!');
                        setShowDomainModal(false);
                        fetchUserSites(); // Refresh sites list
                    }
                } else {
                    const error = await response.json();
                    
                    if (error.error && error.error.includes('already exists')) {
                        alert('Bu domain zaten kullanımda! Lütfen farklı bir domain seçin.');
                    } else if (error.error && error.error.includes('invalid TLD')) {
                        alert('Geçersiz domain formatı! Lütfen sadece subdomain kısmını girin (örn: ornek).');
                    } else {
                        alert(`Hata: ${error.error || 'Domain eklenemedi'}`);
                    }
                }
            } catch (error) {
                console.error('Error adding custom domain:', error);
                alert('Domain eklenirken hata oluştu!');
            } finally {
                setDomainLoading(false);
            }
        };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Experience tarih kontrolü
            for (let i = 0; i < siteData.experiences.length; i++) {
                const exp = siteData.experiences[i];
                if (exp.start_date && exp.end_date && exp.end_date !== '') {
                    if (new Date(exp.end_date) < new Date(exp.start_date)) {
                        alert(`Experience ${i + 1}: End date cannot be earlier than start date. Please fix the dates.`);
                        setLoading(false);
                        return;
                    }
                }
            }

            // Education tarih kontrolü
            for (let i = 0; i < siteData.education.length; i++) {
                const edu = siteData.education[i];
                if (edu.start_date && edu.end_date && edu.end_date !== '') {
                    if (new Date(edu.end_date) < new Date(edu.start_date)) {
                        alert(`Education ${i + 1}: End date cannot be earlier than start date. Please fix the dates.`);
                        setLoading(false);
                        return;
                    }
                }
            }

            // Undefined değerleri temizle
            const cleanData = JSON.parse(JSON.stringify(siteData, (key, value) => {
                if (value === undefined) return null;
                if (value === '') return null;
                return value;
            }));
            
            console.log('Saving site data:', cleanData);
            console.log('Experiences:', cleanData.experiences);
            await onSave(cleanData);
            // Kaydetten sonra sunucudaki güncel veriyi yeniden yükle
            await loadSiteData();
        } catch (error) {
            console.error('Error saving site:', error);
        } finally {
            setLoading(false);
        }
    };

    const addExperience = () => {
        setSiteData(prev => ({
            ...prev,
            experiences: [...prev.experiences, {
                company: '',
                position: '',
                start_date: '',
                end_date: '',
                description: '',
                achievements: []
            }]
        }));
    };

    const updateExperience = (index, field, value) => {
        console.log('updateExperience:', { index, field, value });
        setSiteData(prev => ({
            ...prev,
            experiences: prev.experiences.map((exp, i) => {
                if (i === index) {
                    const updatedExp = { ...exp, [field]: value };
                    return updatedExp;
                }
                return exp;
            })
        }));
    };

    const addEducation = () => {
        setSiteData(prev => ({
            ...prev,
            education: [...prev.education, {
                institution: '',
                degree: '',
                field: '',
                start_date: '',
                end_date: '',
                achievements: []
            }]
        }));
    };

    const updateEducation = (index, field, value) => {
        setSiteData(prev => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const addCompetency = () => {
        setSiteData(prev => ({
            ...prev,
            competencies: [...prev.competencies, { name: '', level: 5 }]
        }));
    };

    const updateCompetency = (index, field, value) => {
        setSiteData(prev => ({
            ...prev,
            competencies: prev.competencies.map((comp, i) =>
                i === index ? { ...comp, [field]: value } : comp
            )
        }));
    };

    const addTool = () => {
        setSiteData(prev => ({
            ...prev,
            tools: [...prev.tools, { name: '', level: 5 }]
        }));
    };

    const updateTool = (index, field, value) => {
        setSiteData(prev => ({
            ...prev,
            tools: prev.tools.map((tool, i) =>
                i === index ? { ...tool, [field]: value } : tool
            )
        }));
    };

    const addLanguage = () => {
        setSiteData(prev => ({
            ...prev,
            languages: [...prev.languages, { name: '', level: 5 }]
        }));
    };

    const updateLanguage = (index, field, value) => {
        setSiteData(prev => ({
            ...prev,
            languages: prev.languages.map((lang, i) =>
                i === index ? { ...lang, [field]: value } : lang
            )
        }));
    };

    const toggleExperience = (index) => {
        setExpandedExperiences(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleEducation = (index) => {
        setExpandedEducation(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleSkills = (section) => {
        setExpandedSkills(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const removeCompetency = (index) => {
        setSiteData(prev => ({
            ...prev,
            competencies: prev.competencies.filter((_, i) => i !== index)
        }));
    };

    const removeTool = (index) => {
        setSiteData(prev => ({
            ...prev,
            tools: prev.tools.filter((_, i) => i !== index)
        }));
    };

    const removeLanguage = (index) => {
        setSiteData(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    // Removed unused highlight functions

    if (loading) {
        return (
            <div className="site-builder-loading">
                <div className="loading-spinner"></div>
                <p>Loading site builder...</p>
            </div>
        );
    }

    return (
        <div className="site-builder">
            <div className="builder-header">
                <h2>Site Builder</h2>
                <div className="builder-actions">
                    <button className="preview-btn">Preview</button>
                    <button className="save-btn" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="builder-content">
                <div className="builder-sidebar">
                    <nav className="section-nav">
                        <button
                            className={activeSection === 'hero' ? 'active' : ''}
                            onClick={() => setActiveSection('hero')}
                        >
                            Hero Section
                        </button>
                        <button
                            className={activeSection === 'experience' ? 'active' : ''}
                            onClick={() => setActiveSection('experience')}
                        >
                            Experience
                        </button>
                        <button
                            className={activeSection === 'education' ? 'active' : ''}
                            onClick={() => setActiveSection('education')}
                        >
                            Education
                        </button>
                        <button
                            className={activeSection === 'skills' ? 'active' : ''}
                            onClick={() => setActiveSection('skills')}
                        >
                            Skills
                        </button>
                        <button
                            className={activeSection === 'contact' ? 'active' : ''}
                            onClick={() => setActiveSection('contact')}
                        >
                            Contact
                        </button>
                        <button
                            className={activeSection === 'domains' ? 'active' : ''}
                            onClick={() => setActiveSection('domains')}
                        >
                            Domainleriniz
                        </button>
                    </nav>
                </div>

                <div className="builder-main">
                    {activeSection === 'hero' && (
                        <div className="section-editor">
                            <h3>Hero Section</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={siteData.hero.name}
                                        onChange={(e) => setSiteData(prev => ({
                                            ...prev,
                                            hero: { ...prev.hero, name: e.target.value }
                                        }))}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={siteData.hero.title}
                                        onChange={(e) => setSiteData(prev => ({
                                            ...prev,
                                            hero: { ...prev.hero, title: e.target.value }
                                        }))}
                                        placeholder="Your job title"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={siteData.hero.description}
                                    onChange={(e) => setSiteData(prev => ({
                                        ...prev,
                                        hero: { ...prev.hero, description: e.target.value }
                                    }))}
                                    placeholder="Tell people about yourself"
                                    rows="4"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Birth Date</label>
                                    <input
                                        type="date"
                                        value={siteData.hero.birth_year}
                                        onChange={(e) => setSiteData(prev => ({
                                            ...prev,
                                            hero: { ...prev.hero, birth_year: e.target.value }
                                        }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={siteData.hero.location}
                                        onChange={(e) => setSiteData(prev => ({
                                            ...prev,
                                            hero: { ...prev.hero, location: e.target.value }
                                        }))}
                                        placeholder="Istanbul, Turkey"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Current Job</label>
                                <input
                                    type="text"
                                    value={siteData.hero.current_job}
                                    onChange={(e) => setSiteData(prev => ({
                                        ...prev,
                                        hero: { ...prev.hero, current_job: e.target.value }
                                    }))}
                                    placeholder="Senior Developer at Tech Corp"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>GitHub URL</label>
                                    <input
                                        type="url"
                                        value={siteData.hero.github_url}
                                        onChange={(e) => setSiteData(prev => ({
                                            ...prev,
                                            hero: { ...prev.hero, github_url: e.target.value }
                                        }))}
                                        placeholder="https://github.com/username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>LinkedIn URL</label>
                                    <input
                                        type="url"
                                        value={siteData.hero.linkedin_url}
                                        onChange={(e) => setSiteData(prev => ({
                                            ...prev,
                                            hero: { ...prev.hero, linkedin_url: e.target.value }
                                        }))}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>CV URL</label>
                                <input
                                    type="url"
                                    value={siteData.hero.cv_url}
                                    onChange={(e) => setSiteData(prev => ({
                                        ...prev,
                                        hero: { ...prev.hero, cv_url: e.target.value }
                                    }))}
                                    placeholder="/cv.pdf or https://example.com/cv.pdf"
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'experience' && (
                        <div className="section-editor">
                            <div className="section-header">
                                <h3>Experience Section</h3>
                                <button className="add-btn" onClick={addExperience}>
                                    + Add Experience
                                </button>
                            </div>

                            {siteData.experiences.map((exp, index) => (
                                <div key={index} className="experience-card">
                                    <div className="card-header" onClick={() => toggleExperience(index)}>
                                        <h4>{exp.company || 'New Experience'}</h4>
                                        <span className="toggle-icon">
                                            {expandedExperiences[index] ? '−' : '+'}
                                        </span>
                                    </div>
                                    {expandedExperiences[index] && (
                                        <div className="card-content">
                                            <div className="form-group">
                                                <label>Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                    placeholder="Company Name"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Position</label>
                                                <input
                                                    type="text"
                                                    value={exp.title || exp.position || ''}
                                                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                                    placeholder="Job Title"
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={exp.start_date}
                                                        onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>End Date</label>
                                                    <input
                                                        type="date"
                                                        value={exp.end_date || ''}
                                                        onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                                        disabled={!exp.end_date || exp.end_date === ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="present-option">
                                                <span className="present-label">Present</span>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={!exp.end_date || exp.end_date === ''}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                updateExperience(index, 'end_date', '');
                                                            } else {
                                                                // Toggle kapatıldığında end_date'i bugünün tarihi yap
                                                                const today = new Date().toISOString().split('T')[0];
                                                                updateExperience(index, 'end_date', today);
                                                            }
                                                        }}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                                    placeholder="Describe your role and responsibilities"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Key Achievements</label>
                                                <div className="achievements-list">
                                                    {exp.achievements && exp.achievements.map((achievement, achIndex) => (
                                                        <div key={achIndex} className="achievement-item">
                                                            <input
                                                                type="text"
                                                                value={achievement.achievement}
                                                                onChange={(e) => {
                                                                    const newAchievements = [...exp.achievements];
                                                                    newAchievements[achIndex] = { achievement: e.target.value };
                                                                    updateExperience(index, 'achievements', newAchievements);
                                                                }}
                                                                placeholder={`Achievement ${achIndex + 1}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newAchievements = exp.achievements.filter((_, i) => i !== achIndex);
                                                                    updateExperience(index, 'achievements', newAchievements);
                                                                }}
                                                                className="remove-achievement-btn"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newAchievements = [...(exp.achievements || []), { achievement: '' }];
                                                            updateExperience(index, 'achievements', newAchievements);
                                                        }}
                                                        className="add-achievement-btn"
                                                    >
                                                        + Add Achievement
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}


                    {activeSection === 'education' && (
                        <div className="section-editor">
                            <h3>Education Section</h3>
                            <div className="section-header">
                                <h4>Education & Certifications</h4>
                                <button className="add-btn" onClick={addEducation}>
                                    + Add Education
                                </button>
                            </div>

                            {siteData.education.map((edu, index) => (
                                <div key={index} className="education-card">
                                    <div className="card-header" onClick={() => toggleEducation(index)}>
                                        <h4>{edu.institution || 'New Education'}</h4>
                                        <span className="toggle-icon">
                                            {expandedEducation[index] ? '−' : '+'}
                                        </span>
                                    </div>
                                    {expandedEducation[index] && (
                                        <div className="card-content">
                                            <div className="form-group">
                                            <label>School</label>
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                    placeholder="University Name"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Degree</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                    placeholder="Bachelor's Degree"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Field of Study</label>
                                                <input
                                                    type="text"
                                                    value={edu.field}
                                                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                                    placeholder="Computer Science"
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={edu.start_date}
                                                        onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>End Date</label>
                                                    <input
                                                        type="date"
                                                        value={edu.end_date || ''}
                                                        onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                                                        disabled={!edu.end_date || edu.end_date === ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="present-option">
                                                <span className="present-label">Present</span>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={!edu.end_date || edu.end_date === ''}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                updateEducation(index, 'end_date', '');
                                                            } else {
                                                                const today = new Date().toISOString().split('T')[0];
                                                                updateEducation(index, 'end_date', today);
                                                            }
                                                        }}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Key Achievements</label>
                                                <div className="achievements-list">
                                                    {edu.achievements && edu.achievements.map((achievement, achIndex) => (
                                                        <div key={achIndex} className="achievement-item">
                                                            <input
                                                                type="text"
                                                                value={achievement.achievement}
                                                                onChange={(e) => {
                                                                    const newAchievements = [...edu.achievements];
                                                                    newAchievements[achIndex] = { achievement: e.target.value };
                                                                    updateEducation(index, 'achievements', newAchievements);
                                                                }}
                                                                placeholder={`Achievement ${achIndex + 1}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newAchievements = edu.achievements.filter((_, i) => i !== achIndex);
                                                                    updateEducation(index, 'achievements', newAchievements);
                                                                }}
                                                                className="remove-achievement-btn"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newAchievements = [...(edu.achievements || []), { achievement: '' }];
                                                            updateEducation(index, 'achievements', newAchievements);
                                                        }}
                                                        className="add-achievement-btn"
                                                    >
                                                        + Add Achievement
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'skills' && (
                        <div className="section-editor">
                            <h3>Skills Section</h3>

                            <div className="skills-categories">
                                <div className="skill-category-card">
                                    <div className="skill-category-header" onClick={() => toggleSkills('competencies')}>
                                        <h4>Competencies</h4>
                                        <div className="skill-header-right">
                                            <button className="add-btn" onClick={(e) => { e.stopPropagation(); addCompetency(); }}>
                                                + Add Competency
                                            </button>
                                            <span className={`expand-icon ${expandedSkills.competencies ? 'expanded' : ''}`}>
                                                ▼
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSkills.competencies && (
                                        <div className="skill-items">
                                        {siteData.competencies.map((comp, index) => (
                                            <div key={index} className="skill-item">
                                                <div className="skill-inputs">
                                                    <select
                                                        value={comp.name}
                                                        onChange={(e) => updateCompetency(index, 'name', e.target.value)}
                                                        className="skill-select"
                                                    >
                                                        <option value="">Select Competency</option>
                                                        <option value="Business Development">Business Development</option>
                                                        <option value="Strategic Planning">Strategic Planning</option>
                                                        <option value="Project Management">Project Management</option>
                                                        <option value="Data Analysis">Data Analysis</option>
                                                        <option value="Problem Solving">Problem Solving</option>
                                                        <option value="Leadership">Leadership</option>
                                                        <option value="Communication">Communication</option>
                                                        <option value="Team Management">Team Management</option>
                                                        <option value="Financial Analysis">Financial Analysis</option>
                                                        <option value="Process Improvement">Process Improvement</option>
                                                        <option value="Risk Management">Risk Management</option>
                                                        <option value="Customer Relations">Customer Relations</option>
                                                        <option value="Sales & Marketing">Sales & Marketing</option>
                                                        <option value="Operations Management">Operations Management</option>
                                                        <option value="Quality Assurance">Quality Assurance</option>
                                                        <option value="OTHER">Other (Custom)</option>
                                                    </select>
                                                    {comp.name === 'OTHER' && (
                                                        <input
                                                            type="text"
                                                            value={comp.customName || ''}
                                                            onChange={(e) => updateCompetency(index, 'customName', e.target.value)}
                                                            placeholder="Enter custom competency"
                                                            className="custom-skill-input"
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCompetency(index)}
                                                    className="remove-skill-btn"
                                                    title="Remove competency"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                </div>

                                <div className="skill-category-card">
                                    <div className="skill-category-header" onClick={() => toggleSkills('tools')}>
                                        <h4>Tools & Software</h4>
                                        <div className="skill-header-right">
                                            <button className="add-btn" onClick={(e) => { e.stopPropagation(); addTool(); }}>
                                                + Add Tool
                                            </button>
                                            <span className={`expand-icon ${expandedSkills.tools ? 'expanded' : ''}`}>
                                                ▼
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSkills.tools && (
                                        <div className="skill-items">
                                        {siteData.tools.map((tool, index) => (
                                            <div key={index} className="skill-item">
                                                <div className="skill-inputs">
                                                    <select
                                                        value={tool.name}
                                                        onChange={(e) => updateTool(index, 'name', e.target.value)}
                                                        className="skill-select"
                                                    >
                                                        <option value="">Select Tool</option>
                                                        <option value="Python">Python</option>
                                                        <option value="JavaScript">JavaScript</option>
                                                        <option value="React">React</option>
                                                        <option value="Node.js">Node.js</option>
                                                        <option value="SQL">SQL</option>
                                                        <option value="Oracle SQL">Oracle SQL</option>
                                                        <option value="Excel">Excel</option>
                                                        <option value="Power BI">Power BI</option>
                                                        <option value="Tableau">Tableau</option>
                                                        <option value="SAS">SAS</option>
                                                        <option value="SAS EG">SAS EG</option>
                                                        <option value="R">R</option>
                                                        <option value="Java">Java</option>
                                                        <option value="C++">C++</option>
                                                        <option value="Git">Git</option>
                                                        <option value="Docker">Docker</option>
                                                        <option value="AWS">AWS</option>
                                                        <option value="Azure">Azure</option>
                                                        <option value="Google Cloud">Google Cloud</option>
                                                        <option value="MongoDB">MongoDB</option>
                                                        <option value="PostgreSQL">PostgreSQL</option>
                                                        <option value="MySQL">MySQL</option>
                                                        <option value="OTHER">Other (Custom)</option>
                                                    </select>
                                                    {tool.name === 'OTHER' && (
                                                        <input
                                                            type="text"
                                                            value={tool.customName || ''}
                                                            onChange={(e) => updateTool(index, 'customName', e.target.value)}
                                                            placeholder="Enter custom tool"
                                                            className="custom-skill-input"
                                                        />
                                                    )}
                                                    {tool.name && tool.name !== '' && (
                                                        <input
                                                            type="text"
                                                            value={tool.usage_purpose || ''}
                                                            onChange={(e) => updateTool(index, 'usage_purpose', e.target.value)}
                                                            placeholder="Usage purpose (e.g., Data Analysis, Web Development)"
                                                            className="custom-skill-input"
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTool(index)}
                                                    className="remove-skill-btn"
                                                    title="Remove tool"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                </div>

                                <div className="skill-category-card">
                                    <div className="skill-category-header" onClick={() => toggleSkills('languages')}>
                                        <h4>Languages</h4>
                                        <div className="skill-header-right">
                                            <button className="add-btn" onClick={(e) => { e.stopPropagation(); addLanguage(); }}>
                                                + Add Language
                                            </button>
                                            <span className={`expand-icon ${expandedSkills.languages ? 'expanded' : ''}`}>
                                                ▼
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSkills.languages && (
                                        <div className="skill-items">
                                        {siteData.languages.map((lang, index) => (
                                            <div key={index} className="skill-item">
                                                <div className="skill-inputs">
                                                    <select
                                                        value={lang.name}
                                                        onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                                        className="skill-select"
                                                    >
                                                        <option value="">Select Language</option>
                                                        <option value="Turkish">Turkish</option>
                                                        <option value="English">English</option>
                                                        <option value="Spanish">Spanish</option>
                                                        <option value="French">French</option>
                                                        <option value="German">German</option>
                                                        <option value="Italian">Italian</option>
                                                        <option value="Portuguese">Portuguese</option>
                                                        <option value="Russian">Russian</option>
                                                        <option value="Chinese">Chinese</option>
                                                        <option value="Japanese">Japanese</option>
                                                        <option value="Korean">Korean</option>
                                                        <option value="Arabic">Arabic</option>
                                                        <option value="Dutch">Dutch</option>
                                                        <option value="Swedish">Swedish</option>
                                                        <option value="Norwegian">Norwegian</option>
                                                        <option value="Danish">Danish</option>
                                                        <option value="Finnish">Finnish</option>
                                                        <option value="Polish">Polish</option>
                                                        <option value="Czech">Czech</option>
                                                        <option value="Hungarian">Hungarian</option>
                                                        <option value="OTHER">Other (Custom)</option>
                                                    </select>
                                                    {lang.name === 'OTHER' && (
                                                        <input
                                                            type="text"
                                                            value={lang.customName || ''}
                                                            onChange={(e) => updateLanguage(index, 'customName', e.target.value)}
                                                            placeholder="Enter custom language"
                                                            className="custom-skill-input"
                                                        />
                                                    )}
                                                    {lang.name && lang.name !== '' && (
                                                        <select
                                                            value={lang.level || ''}
                                                            onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                                                            className="level-select"
                                                        >
                                                            <option value="">Select Level</option>
                                                            <option value="Native">Native</option>
                                                            <option value="Fluent">Fluent</option>
                                                            <option value="Advanced">Advanced</option>
                                                            <option value="Intermediate">Intermediate</option>
                                                            <option value="Beginner">Beginner</option>
                                                        </select>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLanguage(index)}
                                                    className="remove-skill-btn"
                                                    title="Remove language"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'contact' && (
                        <div className="section-editor">
                            <h3>Contact Section</h3>
                            <p>Contact form is automatically included. Visitors can send you messages directly.</p>
                            <div className="contact-preview">
                                <div className="contact-form-preview">
                                    <h4>Contact Form Preview</h4>
                                    <div className="form-preview">
                                        <input placeholder="Name" disabled />
                                        <input placeholder="Email" disabled />
                                        <input placeholder="Subject" disabled />
                                        <textarea placeholder="Message" disabled />
                                        <button disabled>Send Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'domains' && (
                        <div className="section-editor">
                            <h3>Domainleriniz</h3>
                            <p>Burada sitelerinizi ve domain ayarlarınızı yönetebilirsiniz.</p>
                            <div className="domains-info">
                                <div className="sites-list">
                                    {sites.map((site) => (
                                        <div key={site.id} className="site-card">
                                            <div className="site-info">
                                                <h4>{site.site_name}</h4>
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
                                                    href={site.domain ? `https://${site.domain}` : `https://${site.subdomain}.yourdomain.com`}
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
                    )}
                </div>
            </div>

            {/* Domain Modal */}
            {showDomainModal && (
                <div className="modal-overlay" onClick={domainLoading ? undefined : () => setShowDomainModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedSite?.domain ? 'Domain Değiştir' : 'Custom Domain Ekle'}</h3>
                            {!domainLoading && (
                                <button 
                                    className="modal-close-btn"
                                    onClick={() => setShowDomainModal(false)}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <p>Site: {selectedSite?.site_name}</p>
                        {selectedSite?.domain && (
                            <p className="current-domain">Mevcut Domain: <strong>{selectedSite.domain}</strong></p>
                        )}
                        
                        <div className="domain-info">
                            <h4>Domain Bilgileri</h4>
                            <p>Kendi domain'inizi ekleyerek sitenizi daha profesyonel hale getirin.</p>
                            <ul>
                                <li>Domain'iniz Cloudflare'de yönetilir</li>
                                <li>SSL sertifikası otomatik olarak eklenir</li>
                                <li>DNS ayarları otomatik yapılandırılır</li>
                                {selectedSite?.domain && (
                                    <li><strong>Not:</strong> Eski domain otomatik olarak kaldırılacak</li>
                                )}
                            </ul>
                        </div>

                        <div className="form-group">
                            <label htmlFor="customDomain">Domain Adı:</label>
                            <div className="domain-input-container">
                                <input
                                    type="text"
                                    id="customDomain"
                                    value={customDomain}
                                    onChange={(e) => setCustomDomain(e.target.value)}
                                    placeholder="ornek"
                                    className="domain-input"
                                    disabled={domainLoading}
                                />
                                <span className="domain-suffix">.erendemirel.com.tr</span>
                            </div>
                            <p className="domain-preview">
                                Tam domain: <strong>{customDomain || 'ornek'}.erendemirel.com.tr</strong>
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowDomainModal(false)}
                                disabled={domainLoading}
                            >
                                İptal
                            </button>
                            <button
                                className="save-btn"
                                onClick={handleSaveCustomDomain}
                                disabled={!customDomain.trim() || domainLoading}
                            >
                                {domainLoading ? (
                                    <>
                                        <div className="loading-spinner-small"></div>
                                        {selectedSite?.domain ? 'Güncelleniyor...' : 'Ekleniyor...'}
                                    </>
                                ) : (
                                    selectedSite?.domain ? 'Domain Güncelle' : 'Domain Ekle'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteBuilder;
