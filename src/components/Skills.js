import React, { useState, useEffect } from 'react';
import './Skills.css';
import apiService from '../services/api';

const Skills = ({ competencies: propCompetencies, tools: propTools, languages: propLanguages }) => {
  const [competencies, setCompetencies] = useState([]);
  const [tools, setTools] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If skills data is passed as props (from subdomain), use them directly
    if (propCompetencies || propTools || propLanguages) {
      setCompetencies(propCompetencies || []);
      setTools(propTools || []);
      setLanguages(propLanguages || []);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API (for main site)
    const fetchSkillsData = async () => {
      try {
        setLoading(true);
        const [competenciesData, toolsData, languagesData] = await Promise.all([
          apiService.getCompetencies(),
          apiService.getTools(),
          apiService.getLanguages()
        ]);

        setCompetencies(competenciesData);
        setTools(toolsData);
        setLanguages(languagesData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching skills data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, [propCompetencies, propTools, propLanguages]);

  if (loading) {
    return (
      <section id="skills" className="skills">
        <div className="container">
          <div className="skills-content">
            <div className="loading-skeleton">
              <div className="skeleton-section">
                <div className="skeleton-title"></div>
                <div className="skeleton-grid"></div>
              </div>
              <div className="skeleton-section">
                <div className="skeleton-title"></div>
                <div className="skeleton-grid"></div>
              </div>
              <div className="skeleton-section">
                <div className="skeleton-title"></div>
                <div className="skeleton-grid"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="skills">
        <div className="container">
          <div className="skills-content">
            <p>Error loading skills data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="skills-content">
          <div className="skills-section">
            <h3 className="skills-section-title">COMPETENCIES</h3>
            <div className="competencies-grid">
              {competencies.map((competency, index) => (
                <div key={index} className="competency-card">
                  <div className="competency-content">
                    <div className="competency-icon">
                      <img src={competency.icon_url} alt={competency.name} className="competency-icon" />
                    </div>
                    <span className="competency-name">{competency.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-section-title">TOOLS & SOFTWARE</h3>
            <div className="tools-grid">
              {tools.map((tool, index) => (
                <div key={index} className="tool-card">
                  <div className="tool-icon">
                    <img src={tool.icon_url} alt={tool.name} className="tool-icon" />
                  </div>
                  <div className="tool-info">
                    <h4 className="tool-name">{tool.name}</h4>
                    <p className="tool-category">{tool.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-section-title">LANGUAGES</h3>
            <div className="languages-grid">
              {languages.map((language, index) => (
                <div key={index} className="language-card">
                  <div className="language-flag">{language.flag_emoji}</div>
                  <div className="language-info">
                    <div className="language-name">{language.name}</div>
                    <div className="language-level">{language.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;