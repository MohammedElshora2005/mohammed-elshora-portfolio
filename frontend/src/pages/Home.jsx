// Mohammed_Portfolio\frontend\src\pages\Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaTelegram, FaProjectDiagram, FaFacebook } from 'react-icons/fa';
import { supabase } from '../supabase';
import './Home.css';

// ✅ استخدم الصورة من مجلد assets
import defaultHero from '../assets/hero.png';

const Home = () => {
  const [profileImage, setProfileImage] = useState(defaultHero);
  const [loading, setLoading] = useState(true);
  const [homeContent, setHomeContent] = useState({
    subtitle: 'Full Stack Developer',
    description: "I build exceptional digital experiences with React, Node.js, and modern web technologies. Passionate about creating clean, performant, and user-friendly applications."
  });

  // ====== Load home content and profile image from Supabase ======
  const loadHomeData = async () => {
    try {
      console.log('🔄 Loading home data from Supabase...');
      
      // ✅ Load home content from Supabase
      const { data: homeData, error: homeError } = await supabase
        .from('home_content')
        .select('*')
        .limit(1);
      
      if (homeError) {
        console.error('❌ Home content error:', homeError);
      } else if (homeData && homeData.length > 0) {
        console.log('📦 Home data received:', homeData);
        setHomeContent({
          subtitle: homeData[0].subtitle || 'Full Stack Developer',
          description: homeData[0].description || "I build exceptional digital experiences with React, Node.js, and modern web technologies."
        });
      } else {
        console.log('⚠️ No home content found, using defaults');
      }

      // Load profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profile_info')
        .select('*')
        .limit(1);
      
      if (profileError) {
        console.error('❌ Profile error:', profileError);
      } else if (profileData && profileData.length > 0) {
        console.log('📦 Profile data loaded:', profileData[0]);
      }

      // Load profile image from localStorage (base64)
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage && savedImage.startsWith('data:image')) {
        setProfileImage(savedImage);
      } else {
        setProfileImage(defaultHero);
      }

    } catch (error) {
      console.error('❌ Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ====== Load data on mount ======
  useEffect(() => {
    loadHomeData();
  }, []);

  // ====== Listen for real-time changes from Supabase ======
  useEffect(() => {
    const subscription = supabase
      .channel('home_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'home_content'
        },
        (payload) => {
          console.log('🔄 Home content changed in Supabase:', payload);
          loadHomeData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_info'
        },
        () => {
          console.log('🔄 Profile info changed, reloading home...');
          loadHomeData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ====== Listen for changes in localStorage ======
  useEffect(() => {
    const handleStorageChange = () => {
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage && savedImage.startsWith('data:image')) {
        setProfileImage(savedImage);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <section id="home" className="home">
        <div className="home-background"></div>
        <div className="container home-container">
          <p style={{ textAlign: 'center', color: '#b0b0b0' }}>Loading...</p>
        </div>
      </section>
    );
  }

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
