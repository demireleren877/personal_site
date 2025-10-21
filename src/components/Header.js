import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav">
        <div className="nav-brand">
        </div>
        <ul className="nav-links">
          <li><button onClick={() => scrollToSection('about')} className="nav-link">ABOUT</button></li>
          <li><button onClick={() => scrollToSection('experience')} className="nav-link">EXPERIENCE</button></li>
          <li><button onClick={() => scrollToSection('education')} className="nav-link">EDUCATION</button></li>
          <li><button onClick={() => scrollToSection('skills')} className="nav-link">SKILLS</button></li>
          <li><button onClick={() => scrollToSection('contact')} className="nav-link">CONTACT</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
