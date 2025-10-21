import React from 'react';
import './Education.css';

const Education = () => {
  const education = [
    {
      degree: "Mathematical Engineering",
      school: "Yıldız Technical University",
      period: "September 2019 - May 2024",
      description: "Bachelor's degree in Mathematical Engineering with focus on mathematical modeling, data analysis, and engineering principles.",
      achievements: [
        "Comprehensive training in mathematical modeling and analysis",
        "Strong foundation in engineering mathematics and statistics",
        "Applied mathematical concepts to real-world engineering problems",
        "Developed analytical thinking and problem-solving skills"
      ]
    },
    {
      degree: "Data Academy Certification",
      school: "Eureko Sigorta",
      period: "2022",
      description: "Successfully completed the Data Academy program organized by Eureko Sigorta, culminating in a project preparation and presentation.",
      achievements: [
        "Completed comprehensive data analysis training program",
        "Developed and presented a final project",
        "Gained advanced skills in data analysis methodologies",
        "Applied business intelligence and reporting techniques",
        "Enhanced data visualization and dashboard development capabilities"
      ]
    }
  ];

  return (
    <section id="education" className="education">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Education & Certifications</h2>
          <p className="section-subtitle">My academic background and professional development</p>
        </div>

        <div className="education-timeline">
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-marker">
                <div className="marker-dot"></div>
                {index < education.length - 1 && <div className="marker-line"></div>}
              </div>

              <div className="education-content">
                <div className="education-card">
                  <div className="education-header">
                    <h3 className="education-degree">{edu.degree}</h3>
                    <div className="education-school">{edu.school}</div>
                    <div className="education-period">{edu.period}</div>
                  </div>

                  <p className="education-description">{edu.description}</p>

                  <div className="education-achievements">
                    <h4 className="achievements-title">Key Highlights:</h4>
                    <ul className="achievements-list">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={idx} className="achievement-item">
                          <span className="achievement-icon">🎓</span>
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

export default Education;