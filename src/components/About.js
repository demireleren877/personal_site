import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">ABOUT</h2>
          <p className="section-subtitle">My professional background and approach</p>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              A fast-learning professional with strong team communication and problem-solving skills, 
              technically competent. I thrive in dynamic environments, 
              focusing on continuous improvement and innovation.
            </p>
            
            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">🎯</div>
                <div className="highlight-content">
                  <h3>Focused Approach</h3>
                  <p>I achieve the best results by paying attention to details in every project</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">🚀</div>
                <div className="highlight-content">
                  <h3>Continuous Development</h3>
                  <p>I am open to learning new technologies and improving myself</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">🤝</div>
                <div className="highlight-content">
                  <h3>Teamwork</h3>
                  <p>I ensure effective collaboration within the team with my strong communication skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
