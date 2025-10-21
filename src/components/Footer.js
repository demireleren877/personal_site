import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-name">Eren Demirel</h3>
            <p className="footer-description">
              Business Development & Data Analysis Professional
            </p>
            <div className="footer-contact">
              <p>📧 demireleren877@gmail.com</p>
              <p>📱 +90 537 287 28 26</p>
              <p>📍 Istanbul, Turkey</p>
            </div>
          </div>

          <div className="footer-links">
            <h4 className="footer-links-title">Quick Links</h4>
            <ul className="footer-nav">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4 className="footer-social-title">Connect With Me</h4>
            <div className="social-links">
              <a href="mailto:demireleren877@gmail.com" className="social-link">
                📧 Email
              </a>
              <a href="tel:+905372872826" className="social-link">
                📱 Call
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Eren Demirel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;