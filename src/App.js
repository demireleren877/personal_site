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
  return (
    <Router>
      <Routes>
        {/* SAAS Routes */}
        <Route path="/dashboard" element={<SaasApp />} />
        <Route path="/auth" element={<SaasApp />} />
        <Route path="/auth/*" element={<SaasApp />} />
        <Route path="/dashboard/*" element={<SaasApp />} />

        {/* Main Site Route - but check for subdomain parameter first */}
        <Route path="/" element={<SaasApp />} />

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
