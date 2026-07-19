// Mohammed_Portfolio\frontend\src\pages\About.jsx

import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [aboutText, setAboutText] = useState('');
  const [profileInfo, setProfileInfo] = useState({
    email: 'muhammedhosni70@gmail.com',
    phone: '01020063819',
    location: 'Egypt',
    experience: '3+ Years'
  });

  useEffect(() => {
    const savedAbout = localStorage.getItem('aboutText');
    if (savedAbout) {
      setAboutText(savedAbout);
    } else {
      setAboutText("I'm Mohammed Elshora, a passionate Full Stack Developer with a strong foundation in modern web technologies. With over 3 years of experience, I specialize in building responsive, performant, and scalable web applications.");
    }
    
    const savedInfo = localStorage.getItem('profileInfo');
    if (savedInfo) {
      setProfileInfo(JSON.parse(savedInfo));
    }
  }, []);

  // الاستماع للتغييرات في localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedInfo = localStorage.getItem('profileInfo');
      if (savedInfo) {
        setProfileInfo(JSON.parse(savedInfo));
      }
      const savedAbout = localStorage.getItem('aboutText');
      if (savedAbout) {
        setAboutText(savedAbout);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">About Me</h2>
        <div className="about-content" data-aos="fade-up" data-aos-delay="100">
          <div className="about-text">
            <p>{aboutText}</p>
            <div className="about-info">
              <div>
                <h4>Email</h4>
                <p>{profileInfo.email}</p>
              </div>
              <div>
                <h4>Location</h4>
                <p>{profileInfo.location}</p>
              </div>
              <div>
                <h4>Experience</h4>
                <p>{profileInfo.experience}</p>
              </div>
              <div>
                <h4>Phone</h4>
                <p>{profileInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;