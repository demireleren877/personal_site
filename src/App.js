import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  // Check if we're on a subdomain
  const hostname = window.location.hostname;
  const isSubdomain = hostname.includes('.') &&
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('erendemirel.com.tr') && // Main domain
    hostname.split('.').length > 2; // Real subdomain

  // If on subdomain, render SaasApp (which will handle SubdomainSite)
  if (isSubdomain) {
    return <SaasApp />;
  }

  return (
    <Router>
      <Routes>
        {/* SAAS Routes */}
        <Route path="/dashboard" element={<SaasApp />} />
        <Route path="/auth" element={<SaasApp />} />
        <Route path="/auth/*" element={<SaasApp />} />
        <Route path="/dashboard/*" element={<SaasApp />} />

        {/* Main Site Route */}
        <Route path="/" element={
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
        } />

        {/* Catch all route for main site */}
        <Route path="*" element={
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
        } />
      </Routes>
    </Router>
  );
}

export default App;
