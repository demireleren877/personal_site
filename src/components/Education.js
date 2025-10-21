import React from 'react';
import './Education.css';

const Education = () => {
  const education = {
    degree: "Mathematical Engineering",
    university: "Yildiz Technical University",
    period: "September 2019 - May 2024",
    location: "Istanbul, Turkey",
    description: "I successfully completed the Mathematical Engineering undergraduate program. Throughout the program, I gained in-depth knowledge in analytical thinking, problem solving and data analysis."
  };

  return (
    <section id="education" className="education">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">EDUCATION</h2>
          <p className="section-subtitle">My academic background and achievements</p>
        </div>
        
        <div className="education-content">
          <div className="education-card">
            <div className="education-header">
              <div className="education-icon">
                <div className="icon-background">🎓</div>
              </div>
              <div className="education-info">
                <h3 className="education-degree">{education.degree}</h3>
                <div className="education-university">{education.university}</div>
                <div className="education-meta">
                  <span className="education-period">{education.period}</span>
                  <span className="education-location">{education.location}</span>
                </div>
              </div>
            </div>
            
            <div className="education-description">
              <p>{education.description}</p>
            </div>
            
            <div className="education-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">📊</div>
                <div className="highlight-text">
                  <h4>Analytical Thinking</h4>
                  <p>Analyzing complex problems and generating solutions</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">🔢</div>
                <div className="highlight-text">
                  <h4>Mathematical Modeling</h4>
                  <p>Solving real-world problems with mathematical models</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">💻</div>
                <div className="highlight-text">
                  <h4>Programming</h4>
                  <p>Algorithm design and programming languages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
