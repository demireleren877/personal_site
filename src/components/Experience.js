import React, { useState, useEffect } from 'react';
import './Experience.css';
import apiService from '../services/api';

const Experience = ({ experiences: propExperiences }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If experiences are passed as prop (from subdomain), use them directly
    if (propExperiences) {
      const sortedExperiences = [...propExperiences].sort((a, b) => {
        // Sort by start_date in descending order (newest first)
        return new Date(b.start_date) - new Date(a.start_date);
      });
      setExperiences(sortedExperiences);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API (for main site)
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await apiService.getExperiences();
        // Sort by start_date in descending order (newest first)
        const sortedData = [...data].sort((a, b) => {
          return new Date(b.start_date) - new Date(a.start_date);
        });
        setExperiences(sortedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [propExperiences]);

  if (loading) {
    return (
      <section id="experience" className="experience">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Professional Experience</h2>
          </div>
          <div className="experience-timeline">
            <div className="loading-skeleton">
              <div className="skeleton-experience"></div>
              <div className="skeleton-experience"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="experience">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Professional Experience</h2>
          </div>
          <div className="experience-timeline">
            <p>Error loading experience data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="experience">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Professional Experience</h2>
        </div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => {
            const period = exp.is_current
              ? `${exp.start_date} - Present`
              : `${exp.start_date} - ${exp.end_date}`;

            return (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  {index < experiences.length - 1 && <div className="marker-line"></div>}
                </div>

                <div className="timeline-content">
                  <div className="experience-card">
                    <div className="experience-header">
                      <h3 className="experience-title">{exp.title}</h3>
                      <div className="experience-company">{exp.company}</div>
                      <div className="experience-period">{period}</div>
                    </div>

                    <p className="experience-description">{exp.description}</p>

                    <div className="experience-achievements">
                      <h4 className="achievements-title">Key Achievements:</h4>
                      <ul className="achievements-list">
                        {exp.achievements && exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="achievement-item">
                            <span className="achievement-icon">✓</span>
                            {achievement.achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;