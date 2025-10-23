import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Contact from './components/Contact';
import SaasApp from './saas/SaasApp';
import './App.css';
import './components/LoadingSkeleton.css';

function App() {
  const [isSaasMode, setIsSaasMode] = useState(false);
  // const [currentSite, setCurrentSite] = useState(null);

  useEffect(() => {
    // Check if we're in SAAS mode (dashboard or subdomain)
    const path = window.location.pathname;
    const hostname = window.location.hostname;

    // If accessing dashboard or auth, switch to SAAS mode
    if (path.includes('/dashboard') || path.includes('/auth')) {
      setIsSaasMode(true);
    }
    // If subdomain (not localhost), show user's site
    else if (hostname.includes('.') && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
      const subdomain = hostname.split('.')[0];
      if (subdomain !== 'www' && subdomain !== 'app') {
        setIsSaasMode(true);
        // loadSiteData(subdomain);
      }
    }
  }, []);

  // const loadSiteData = async (subdomain) => {
  //   try {
  //     const response = await fetch(`https://personal-site-saas-api.l5819033.workers.dev/api/site/${subdomain}/hero`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setCurrentSite({ subdomain, data });
  //     }
  //   } catch (error) {
  //     console.error('Error loading site data:', error);
  //   }
  // };

  if (isSaasMode) {
    return <SaasApp />;
  }

  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Experience />
        <Education />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
