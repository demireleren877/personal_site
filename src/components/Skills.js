import React from 'react';
import './Skills.css';

const Skills = () => {
  const competencies = [
    "Business Development",
    "Analytical Thinking", 
    "Problem Solving",
    "Data Analysis"
  ];

  const tools = [
    { 
      name: "Python", 
      category: "Process Automation & Data Analysis", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="tool-svg">
          <path d="M14.25 0h-8.5A2.25 2.25 0 0 0 3.5 2.25v19.5A2.25 2.25 0 0 0 5.75 24h8.5a2.25 2.25 0 0 0 2.25-2.25V2.25A2.25 2.25 0 0 0 14.25 0zM9.75 1.5h4.5a.75.75 0 0 1 .75.75v.75H9V2.25a.75.75 0 0 1 .75-.75zM8 3h8v1.5H8V3zm-1.5 1.5V21a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75V4.5H6.5zm1.5 1.5h8v12H8V6zm1.5 1.5v9h5V7.5h-5z"/>
        </svg>
      )
    },
    { 
      name: "Excel", 
      category: "Data Analysis & Reporting", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="tool-svg">
          <path d="M23 1.5q0.41 0 0.7 0.3t0.3 0.7v19q0 0.41-0.3 0.7t-0.7 0.3H7q-0.41 0-0.7-0.3T6 21.5v-19q0-0.41 0.3-0.7T7 1.5h16zM1 1.5q0.41 0 0.7 0.3T3 2.5v19q0 0.41-0.3 0.7T1 22.5H0.5q-0.41 0-0.7-0.3T-0.5 21.5v-19q0-0.41 0.3-0.7T0.5 1.5H1zM23 21h-1V2h1v19zM2 21H1V2h1v19zM9 5.5h6v1H9v-1zM9 7.5h4v1H9v-1zM9 9.5h6v1H9v-1zM9 11.5h4v1H9v-1zM9 13.5h6v1H9v-1zM9 15.5h4v1H9v-1zM9 17.5h6v1H9v-1z"/>
        </svg>
      )
    },
    { 
      name: "SAS EG", 
      category: "Data Processing", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="tool-svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    { 
      name: "SAS Solution for IFRS17", 
      category: "Financial Reporting", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="tool-svg">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    },
    { 
      name: "Oracle SQL", 
      category: "Database Management", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="tool-svg">
          <path d="M16.405 5.501c-.115 0-.219.04-.304.117l-5.433 5.433-5.433-5.433c-.197-.197-.51-.197-.707 0s-.197.51 0 .707l5.433 5.433-5.433 5.433c-.197.197-.197.51 0 .707.098.098.226.147.354.147s.256-.049.354-.147l5.433-5.433 5.433 5.433c.098.098.226.147.354.147s.256-.049.354-.147c.197-.197.197-.51 0-.707l-5.433-5.433 5.433-5.433c.197-.197.197-.51 0-.707-.197-.197-.51-.197-.707 0z"/>
        </svg>
      )
    },
    { 
      name: "Power BI", 
      category: "Data Visualization", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="tool-svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )
    },
    { 
      name: "Flutter", 
      category: "Mobile Development", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="tool-svg">
          <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37L14.314 0zm.014 11.072L7.811 17.683 14.314 24H21.7l-7.396-7.396a1.724 1.724 0 0 1 0-2.44l.014-.172z"/>
        </svg>
      )
    }
  ];

  const languages = [
    { name: "Turkish", level: "Native" },
    { name: "English", level: "Advanced" }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">SKILLS</h2>
          <p className="section-subtitle">My technical skills and competencies</p>
        </div>
        
        <div className="skills-content">
          <div className="skills-section">
            <h3 className="skills-section-title">COMPETENCIES</h3>
            <div className="competencies-grid">
              {competencies.map((competency, index) => (
                <div key={index} className="competency-card">
                  <div className="competency-content">
                    <span className="competency-name">{competency}</span>
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
                  <div className="language-name">{language.name}</div>
                  <div className="language-level">{language.level}</div>
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