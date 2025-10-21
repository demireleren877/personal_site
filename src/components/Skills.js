import React from 'react';
import './Skills.css';
// SVG dosyalarını import etmeye gerek yok, public klasöründen doğrudan kullanacağız

const Skills = () => {
  const competencies = [
    {
      name: "Business Development",
      icon: <img src="/icons/business-development.png" alt="Business Development" className="competency-icon" />
    },
    {
      name: "Analytical Thinking",
      icon: <img src="/icons/analytical-thinking.png" alt="Analytical Thinking" className="competency-icon" />
    },
    {
      name: "Problem Solving",
      icon: <img src="/icons/problem-solving.png" alt="Problem Solving" className="competency-icon" />
    },
    {
      name: "Data Analysis",
      icon: <img src="/icons/data-analysis.png" alt="Data Analysis" className="competency-icon" />
    },
    {
      name: "Project Management",
      icon: <img src="/icons/project-management.png" alt="Project Management" className="competency-icon" />
    },
    {
      name: "Strategic Planning",
      icon: <img src="/icons/strategic-planning.png" alt="Strategic Planning" className="competency-icon" />
    }
  ];

  const tools = [
    {
      name: "Python",
      category: "Process Automation & Data Analysis",
      icon: <img src="/icons/python-svgrepo-com.svg" alt="Python" className="tool-icon" />
    },
    {
      name: "Excel",
      category: "Data Analysis & Reporting",
      icon: <img src="/icons/excel-svgrepo-com.svg" alt="Excel" className="tool-icon" />
    },
    {
      name: "SAS EG",
      category: "Data Processing",
      icon: <img src="/icons/sas-logo-horiz.svg" alt="SAS EG" className="tool-icon" />
    },
    {
      name: "Oracle SQL",
      category: "Database Management",
      icon: <img src="/icons/sql-svgrepo-com.svg" alt="Oracle SQL" className="tool-icon" />
    },
    {
      name: "Power BI",
      category: "Data Visualization",
      icon: <img src="/icons/New_Power_BI_Logo.svg" alt="Power BI" className="tool-icon" />
    },
    {
      name: "Flutter",
      category: "Mobile Development",
      icon: <img src="/icons/flutter-svgrepo-com.svg" alt="Flutter" className="tool-icon" />
    }
  ];

  const languages = [
    {
      name: "Turkish",
      level: "Native",
      flag: "🇹🇷"
    },
    {
      name: "English",
      level: "Advanced",
      flag: "🇬🇧"
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">

        <div className="skills-content">
          <div className="skills-section">
            <h3 className="skills-section-title">COMPETENCIES</h3>
            <div className="competencies-grid">
              {competencies.map((competency, index) => (
                <div key={index} className="competency-card">
                  <div className="competency-content">
                    <div className="competency-icon">{competency.icon}</div>
                    <span className="competency-name">{competency.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-section-title">TOOLS & SOFTWARE</h3>
            <div className="tools-grid">
              {tools.map((tool, index) => (
                <div key={index} className="tool-card">
                  <div className="tool-icon">{tool.icon}</div>
                  <div className="tool-info">
                    <h4 className="tool-name">{tool.name}</h4>
                    <p className="tool-category">{tool.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-section-title">LANGUAGES</h3>
            <div className="languages-grid">
              {languages.map((language, index) => (
                <div key={index} className="language-card">
                  <div className="language-flag">{language.flag}</div>
                  <div className="language-info">
                    <div className="language-name">{language.name}</div>
                    <div className="language-level">{language.level}</div>
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

export default Skills;