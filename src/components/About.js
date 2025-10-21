import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              I am a dedicated Business Development and Data Analysis professional with a strong passion for
              transforming complex data into actionable insights. With expertise in process automation,
              financial reporting, and strategic business development, I help organizations make data-driven
              decisions that drive growth and efficiency.
            </p>

            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">🎯</div>
                <div className="highlight-content">
                  <h3>Strategic Thinking</h3>
                  <p>Developing comprehensive business strategies that align with organizational goals and market opportunities.</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">📊</div>
                <div className="highlight-content">
                  <h3>Data Analysis</h3>
                  <p>Transforming raw data into meaningful insights using advanced analytical tools and methodologies.</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">⚡</div>
                <div className="highlight-content">
                  <h3>Process Automation</h3>
                  <p>Streamlining business processes through innovative automation solutions and technology integration.</p>
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