// ohammed_Portfolio\frontend\src\pages\Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaTelegram, FaProjectDiagram, FaFacebook } from 'react-icons/fa';
import defaultHero from '../assets/hero.png';
import './Home.css';

const Home = () => {
  const [profileImage, setProfileImage] = useState(defaultHero);
  const [homeContent, setHomeContent] = useState({
    subtitle: 'Full Stack Developer',
    description: "I build exceptional digital experiences with React, Node.js, and modern web technologies. Passionate about creating clean, performant, and user-friendly applications."
  });

  useEffect(() => {
    const saved = localStorage.getItem('profileImage');
    if (saved) {
      setProfileImage(saved);
    }
    const savedContent = localStorage.getItem('homeContent');
    if (savedContent) {
      setHomeContent(JSON.parse(savedContent));
    }
  }, []);

  return (
    <section id="home" className="home">
      <div className="home-background"></div>
      
      <div className="container home-container">
        <div className="home-content" data-aos="fade-right">
          <h1 className="home-title">
            Hi, I'm <span className="highlight">Mohammed Elshora</span>
          </h1>
          <h2 className="home-subtitle">{homeContent.subtitle}</h2>
          <p className="home-description">{homeContent.description}</p>
          <div className="home-buttons">
            <Link to="/contact" className="btn-primary">
              Hire Me
            </Link>
            <Link to="/projects" className="btn-secondary">
              <FaProjectDiagram /> View Projects
            </Link>
          </div>
          <div className="social-icons">
            <a href="https://github.com/MohammedElshora2005" target="_blank" rel="noopener noreferrer" title="GitHub">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/mohammed-elshora-45162933a" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://www.facebook.com/moohamed.elshora" target="_blank" rel="noopener noreferrer" title="Facebook">
              <FaFacebook />
            </a>
            <a href="mailto:muhammedhosni70@gmail.com" title="Email">
              <FaEnvelope />
            </a>
            <a href="https://wa.me/201020063819" target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="https://t.me/Muhamedhosny" target="_blank" rel="noopener noreferrer" title="Telegram">
              <FaTelegram />
            </a>
          </div>
        </div>

        <div className="home-image" data-aos="fade-left">
          <img src={profileImage} alt="Mohammed Elshora" />
          <div className="floating-shapes">
            <div className="shape shape1"></div>
            <div className="shape shape2"></div>
            <div className="shape shape3"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;