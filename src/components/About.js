import React, { useState, useEffect } from 'react';
import './About.css';
import apiService from '../services/api';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAboutData();
        setAboutData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <div className="loading-skeleton">
                <div className="skeleton-description"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-highlights">
                  <div className="skeleton-highlight"></div>
                  <div className="skeleton-highlight"></div>
                  <div className="skeleton-highlight"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="about-description">Error loading about data. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return null;
  }

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{aboutData.title}</h2>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              {aboutData.description}
            </p>

            <div className="about-highlights">
              {aboutData.highlights && aboutData.highlights.map((highlight, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">{highlight.icon}</div>
                  <div className="highlight-content">
                    <h3>{highlight.title}</h3>
                    <p>{highlight.description}</p>
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

export default About;