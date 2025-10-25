import React, { useState, useEffect } from 'react';
import './Skills.css';
import apiService from '../services/api';
import ReactCountryFlag from 'react-country-flag';

const Skills = ({ competencies: propCompetencies, tools: propTools, languages: propLanguages }) => {
  const [competencies, setCompetencies] = useState([]);
  const [tools, setTools] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Country codes for different languages
  const getCountryCode = (languageName) => {
    const countryMap = {
      'Turkish': 'TR',
      'English': 'GB',
      'Spanish': 'ES',
      'French': 'FR',
      'German': 'DE',
      'Italian': 'IT',
      'Portuguese': 'PT',
      'Russian': 'RU',
      'Chinese': 'CN',
      'Japanese': 'JP',
      'Korean': 'KR',
      'Arabic': 'SA',
      'Dutch': 'NL',
      'Swedish': 'SE',
      'Norwegian': 'NO',
      'Danish': 'DK',
      'Finnish': 'FI',
      'Polish': 'PL',
      'Czech': 'CZ',
      'Hungarian': 'HU'
    };
    return countryMap[languageName] || null;
  };

  // Get icon URL for tools and competencies
  const getIconUrl = (name, type) => {
    const iconMap = {
      // Tools & Software
      'Python': '/icons/tools/python-svgrepo-com.svg',
      'Excel': '/icons/tools/excel-svgrepo-com.svg',
      'Power BI': '/icons/tools/New_Power_BI_Logo.svg',
      'SAS': '/icons/tools/sas-logo-horiz.svg',
      'SAS EG': '/icons/tools/sas-logo-horiz.svg',
      'SQL': '/icons/tools/sql.svg',
      'Oracle SQL': '/icons/tools/oracle-sql.svg',
      'Flutter': '/icons/tools/flutter-svgrepo-com.svg',
      'JavaScript': '/icons/tools/javascript.png',
      'React': '/icons/tools/react.png',
      'Node.js': '/icons/tools/nodejs.png',
      'Tableau': '/icons/tools/tableau.svg',
      'R': '/icons/tools/r.png',
      'Java': '/icons/tools/java.svg',
      'C++': '/icons/tools/cpp.png',
      'Git': '/icons/tools/git.svg',
      'Docker': '/icons/tools/docker.svg',
      'AWS': '/icons/tools/aws.png',
      'Azure': '/icons/tools/azure.svg',
      'Google Cloud': '/icons/tools/google-cloud.png',
      'MongoDB': '/icons/tools/mongodb.svg',
      'PostgreSQL': '/icons/tools/postgresql.svg',
      'MySQL': '/icons/tools/mysql.svg',
      
      // Competencies
      'Business Development': '/icons/competencies/business-development.png',
      'Analytical Thinking': '/icons/competencies/analytical-thinking.png',
      'Problem Solving': '/icons/competencies/problem-solving.png',
      'Data Analysis': '/icons/competencies/data-analysis.png',
      'Project Management': '/icons/competencies/project-management.png',
      'Strategic Planning': '/icons/competencies/strategic-planning.png'
    };
    
    return iconMap[name] || null;
  };

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
              {competencies.map((competency, index) => {
                const iconUrl = getIconUrl(competency.name, 'competency');
                return (
                  <div key={index} className="competency-card">
                    <div className="competency-content">
                      {iconUrl && (
                        <div className="competency-icon">
                          <img src={iconUrl} alt={competency.name} className="competency-icon" />
                        </div>
                      )}
                      <span className="competency-name">
                        {competency.name === 'OTHER' && competency.customName ? competency.customName : competency.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-section-title">TOOLS & SOFTWARE</h3>
            <div className="tools-grid">
              {tools.map((tool, index) => {
                const iconUrl = getIconUrl(tool.name, 'tool');
                return (
                  <div key={index} className="tool-card">
                    {iconUrl && (
                      <div className="tool-icon">
                        <img src={iconUrl} alt={tool.name} className="tool-icon" />
                      </div>
                    )}
                    <div className="tool-info">
                      <h4 className="tool-name">
                        {tool.name === 'OTHER' && tool.customName ? tool.customName : tool.name}
                      </h4>
                      <p className="tool-category">{tool.usage_purpose || tool.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-section-title">LANGUAGES</h3>
            <div className="languages-grid">
              {languages.map((language, index) => {
                const countryCode = getCountryCode(language.name);
                return (
                  <div key={index} className="language-card">
                    <div className="language-flag">
                      {countryCode ? (
                        <ReactCountryFlag
                          countryCode={countryCode}
                          svg
                          style={{
                            width: '32px',
                            height: '24px',
                            borderRadius: '3px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            border: '1px solid rgba(0,0,0,0.15)'
                          }}
                        />
                      ) : (
                        <div className="flag-placeholder">
                          {language.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="language-info">
                      <div className="language-name">
                        {language.name === 'OTHER' && language.customName ? language.customName : language.name}
                      </div>
                      <div className="language-level">{language.level}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;