import React from 'react';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      title: "Actuarial Analyst",
      company: "Eureko Sigorta",
      period: "June 2022 - Present",
      location: "Istanbul, Turkey",
      responsibilities: [
        "Extracting and transforming datasets for International Financial Reporting System (IFRS), performing data cleaning, structuring and validation operations using SAS Enterprise Guide (SAS EG) and SQL",
        "Automating manual tasks in Microsoft Excel to reduce human error, increase efficiency and ensure consistency, saving an average of 2 working days per project per month",
        "Preparing interpretable data for actuarial processes and financial reporting, developing end-to-end workflows and creating clear documentation",
        "Developing a tool to extract discounted cash flows according to IFRS 17 standards, initially with Python, then rewriting with Oracle SQL and Power BI for advanced performance, scalability and integration",
        "Automating the monthly closing process, developing a Python-based bot to send individual emails to various departments, facilitating communication and saving time"
      ]
    }
  ];

  return (
    <section id="experience" className="experience">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">EXPERIENCE</h2>
          <p className="section-subtitle">Important experiences in my professional career</p>
        </div>
        
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot"></div>
                <div className="marker-line"></div>
              </div>
              
              <div className="timeline-content">
                <div className="experience-header">
                  <h3 className="experience-title">{exp.title}</h3>
                  <div className="experience-company">{exp.company}</div>
                  <div className="experience-meta">
                    <span className="experience-period">{exp.period}</span>
                    <span className="experience-location">{exp.location}</span>
                  </div>
                </div>
                
                <div className="experience-description">
                  <ul className="responsibilities-list">
                    {exp.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="responsibility-item">
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="achievement-highlight">
          <div className="achievement-content">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-text">
              <h3>Data Academy Program</h3>
              <p>I successfully completed the Data Academy program organized by Eureko Sigorta, completing a comprehensive training process including project preparation and presentation phases.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
