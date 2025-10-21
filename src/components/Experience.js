import React from 'react';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      title: "Actuarial Analyst",
      company: "Eureko Sigorta",
      period: "June 2022 - Present",
      description: "Working as an Actuarial Analyst at Eureko Sigorta, focusing on IFRS data extraction, transformation, and automation of manual processes using SAS Enterprise Guide and SQL.",
      achievements: [
        "Extract and transform data sets required by International Financial Reporting System (IFRS) from raw data into desired formats using SAS Enterprise Guide and SQL",
        "Automate manual Excel tasks, saving an average of 2 workdays per month per project while reducing human error and increasing efficiency",
        "Prepare interpretable data for actuarial processes and financial reporting, creating comprehensive documentation for all processes",
        "Developed a tool that extracts discounted cash flows according to IFRS 17 standards and demonstrates the impact of discount curves, initially in Python then optimized with Oracle SQL and Power BI for better performance with large datasets",
        "Automated monthly closing preparation process by developing a Python-based bot for sending individual emails to various departments, streamlining communication and saving valuable time"
      ]
    },
    {
      title: ".NET Web Developer",
      company: "Uyumsoft AŞ",
      period: "June 2022 - July 2022",
      description: "Short-term web development project using .NET framework for creating web applications and solutions.",
      achievements: [
        "Developed web applications using .NET framework",
        "Gained hands-on experience in web development technologies",
        "Contributed to software development projects",
        "Applied programming skills in a professional environment"
      ]
    }
  ];

  return (
    <section id="experience" className="experience">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Professional Experience</h2>
        </div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
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
                    <div className="experience-period">{exp.period}</div>
                  </div>

                  <p className="experience-description">{exp.description}</p>

                  <div className="experience-achievements">
                    <h4 className="achievements-title">Key Achievements:</h4>
                    <ul className="achievements-list">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="achievement-item">
                          <span className="achievement-icon">✓</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;