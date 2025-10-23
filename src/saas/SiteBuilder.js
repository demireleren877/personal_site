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
        about: {
            title: '',
            description: ''
        },
        aboutHighlights: [],
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

    useEffect(() => {
        loadSiteData();
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
            const [heroRes, aboutRes, experiencesRes, educationRes, competenciesRes, toolsRes, languagesRes] = await Promise.all([
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/hero`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/about`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/experiences`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/education`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/competencies`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/tools`),
                fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/languages`)
            ]);

            const heroData = heroRes.ok ? await heroRes.json() : null;
            const aboutData = aboutRes.ok ? await aboutRes.json() : null;
            const experiences = experiencesRes.ok ? await experiencesRes.json() : [];
            const education = educationRes.ok ? await educationRes.json() : [];
            const competencies = competenciesRes.ok ? await competenciesRes.json() : [];
            const tools = toolsRes.ok ? await toolsRes.json() : [];
            const languages = languagesRes.ok ? await languagesRes.json() : [];

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
                about: aboutData || { title: '', description: '' },
                aboutHighlights: [],
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

    const handleSave = async () => {
        try {
            setLoading(true);
            await onSave(siteData);
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
        setSiteData(prev => ({
            ...prev,
            experiences: prev.experiences.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            )
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
                            className={activeSection === 'about' ? 'active' : ''}
                            onClick={() => setActiveSection('about')}
                        >
                            About Section
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
                                    <label>Birth Year</label>
                                    <input
                                        type="number"
                                        value={siteData.hero.birth_year}
                                        onChange={(e) => setSiteData(prev => ({
                                            ...prev,
                                            hero: { ...prev.hero, birth_year: e.target.value }
                                        }))}
                                        placeholder="1990"
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
                            <h3>Experience Section</h3>
                            <div className="section-header">
                                <h4>Work Experience</h4>
                                <button className="add-btn" onClick={addExperience}>
                                    + Add Experience
                                </button>
                            </div>

                            {siteData.experiences.map((exp, index) => (
                                <div key={index} className="experience-editor">
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
                                                type="text"
                                                value={exp.start_date}
                                                onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                                placeholder="2020"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <input
                                                type="text"
                                                value={exp.end_date}
                                                onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                                placeholder="2023 or Present"
                                            />
                                        </div>
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
                            ))}
                        </div>
                    )}

                    {activeSection === 'about' && (
                        <div className="section-editor">
                            <h3>About Section</h3>
                            <div className="form-group">
                                <label>About Title</label>
                                <input
                                    type="text"
                                    value={siteData.about.title}
                                    onChange={(e) => setSiteData(prev => ({
                                        ...prev,
                                        about: { ...prev.about, title: e.target.value }
                                    }))}
                                    placeholder="About Me"
                                />
                            </div>
                            <div className="form-group">
                                <label>About Description</label>
                                <textarea
                                    value={siteData.about.description}
                                    onChange={(e) => setSiteData(prev => ({
                                        ...prev,
                                        about: { ...prev.about, description: e.target.value }
                                    }))}
                                    placeholder="Tell people more about yourself, your background, interests, and what drives you..."
                                    rows="6"
                                />
                            </div>
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
                                <div key={index} className="education-editor">
                                    <div className="form-group">
                                        <label>Institution</label>
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
                                                type="text"
                                                value={edu.start_date}
                                                onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                                                placeholder="2018"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <input
                                                type="text"
                                                value={edu.end_date}
                                                onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                                                placeholder="2022"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'skills' && (
                        <div className="section-editor">
                            <h3>Skills Section</h3>

                            <div className="skills-categories">
                                <div className="skill-category">
                                    <div className="section-header">
                                        <h4>Competencies</h4>
                                        <button className="add-btn" onClick={addCompetency}>
                                            + Add Competency
                                        </button>
                                    </div>

                                    {siteData.competencies.map((comp, index) => (
                                        <div key={index} className="skill-editor">
                                            <div className="form-group">
                                                <label>Competency</label>
                                                <input
                                                    type="text"
                                                    value={comp.name}
                                                    onChange={(e) => updateCompetency(index, 'name', e.target.value)}
                                                    placeholder="Business Development"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Level (1-10)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={comp.level}
                                                    onChange={(e) => updateCompetency(index, 'level', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="skill-category">
                                    <div className="section-header">
                                        <h4>Tools & Software</h4>
                                        <button className="add-btn" onClick={addTool}>
                                            + Add Tool
                                        </button>
                                    </div>

                                    {siteData.tools.map((tool, index) => (
                                        <div key={index} className="skill-editor">
                                            <div className="form-group">
                                                <label>Tool</label>
                                                <input
                                                    type="text"
                                                    value={tool.name}
                                                    onChange={(e) => updateTool(index, 'name', e.target.value)}
                                                    placeholder="Python"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Level (1-10)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={tool.level}
                                                    onChange={(e) => updateTool(index, 'level', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="skill-category">
                                    <div className="section-header">
                                        <h4>Languages</h4>
                                        <button className="add-btn" onClick={addLanguage}>
                                            + Add Language
                                        </button>
                                    </div>

                                    {siteData.languages.map((lang, index) => (
                                        <div key={index} className="skill-editor">
                                            <div className="form-group">
                                                <label>Language</label>
                                                <input
                                                    type="text"
                                                    value={lang.name}
                                                    onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                                    placeholder="English"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Level (1-10)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={lang.level}
                                                    onChange={(e) => updateLanguage(index, 'level', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    ))}
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
                </div>
            </div>
        </div>
    );
};

export default SiteBuilder;
