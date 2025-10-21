import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {currentYear} Eren Demirel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
