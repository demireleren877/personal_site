import React, { useState, useEffect } from 'react';
import './Education.css';
import apiService from '../services/api';

const Education = ({ education: propEducation }) => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If education is passed as prop (from subdomain), use it directly
    if (propEducation) {
      const sortedEducation = [...propEducation].sort((a, b) => {
        // Sort by start_date in descending order (newest first)
        return new Date(b.start_date) - new Date(a.start_date);
      });
      setEducation(sortedEducation);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API (for main site)
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const data = await apiService.getEducation();
        // Sort by start_date in descending order (newest first)
        const sortedData = [...data].sort((a, b) => {
          return new Date(b.start_date) - new Date(a.start_date);
        });
        setEducation(sortedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching education:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [propEducation]);

  if (loading) {
    return (
      <section id="education" className="education">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Education & Certifications</h2>
          </div>
          <div className="education-timeline">
            <div className="loading-skeleton">
              <div className="skeleton-education"></div>
              <div className="skeleton-education"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="education" className="education">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Education & Certifications</h2>
          </div>
          <div className="education-timeline">
            <p>Error loading education data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="education">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Education</h2>
        </div>

        <div className="education-timeline">
          {education.map((edu, index) => {
            const period = edu.is_current
              ? `${edu.start_date} - Present`
              : `${edu.start_date} - ${edu.end_date}`;

            return (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  {index < education.length - 1 && <div className="marker-line"></div>}
                </div>

                <div className="timeline-content">
                  <div className="education-card">
                    <div className="education-header">
                      <h3 className="education-degree">{edu.degree}</h3>
                      <div className="education-school">{edu.school}</div>
                      <div className="education-period">{period}</div>
                    </div>

                    <p className="education-description">{edu.description}</p>

                    <div className="education-achievements">
                      <h4 className="achievements-title">Key Highlights:</h4>
                      <ul className="achievements-list">
                        {edu.achievements && edu.achievements.map((achievement, idx) => (
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

export default Education;