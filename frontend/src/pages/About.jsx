// Mohammed_Portfolio\frontend\src\pages\About.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './About.css';

const About = () => {
  const [aboutText, setAboutText] = useState('');
  const [profileInfo, setProfileInfo] = useState({
    email: '',
    phone: '',
    location: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);

  // ====== Load profile info and about text from Supabase ======
  const loadProfile = async () => {
    try {
      // Load profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profile_info')
        .select('*')
        .limit(1);
      
      if (profileError) throw profileError;
      
      if (profileData && profileData.length > 0) {
        const info = profileData[0];
        setProfileInfo({
          email: info.email || 'muhammedhosni70@gmail.com',
          phone: info.phone || '01020063819',
          location: info.location || 'Egypt',
          experience: info.experience || '3+ Years'
        });
        setAboutText(info.about_text || "I'm Mohammed Elshora, a passionate Full Stack Developer with a strong foundation in modern web technologies. With over 3 years of experience, I specialize in building responsive, performant, and scalable web applications.");
      } else {
        // بيانات افتراضية
        setProfileInfo({
          email: 'muhammedhosni70@gmail.com',
          phone: '01020063819',
          location: 'Egypt',
          experience: '3+ Years'
        });
        setAboutText("I'm Mohammed Elshora, a passionate Full Stack Developer with a strong foundation in modern web technologies. With over 3 years of experience, I specialize in building responsive, performant, and scalable web applications.");
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to localStorage
      const savedAbout = localStorage.getItem('aboutText');
      if (savedAbout) {
        setAboutText(savedAbout);
      }
      const savedInfo = localStorage.getItem('profileInfo');
      if (savedInfo) {
        try {
          setProfileInfo(JSON.parse(savedInfo));
        } catch (e) {
          // keep defaults
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // ====== Load data on mount ======
  useEffect(() => {
    loadProfile();
  }, []);

  // ====== Listen for real-time changes from Supabase ======
  useEffect(() => {
    // Subscribe to changes on profile_info table
    const subscription = supabase
      .channel('profile_info_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profile_info'
        },
        () => {
          console.log('🔄 Profile info changed, reloading...');
          loadProfile(); // Reload data when any change occurs
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  // ====== Also listen for localStorage changes (for backward compatibility) ======
  useEffect(() => {
    const handleStorageChange = () => {
      const savedInfo = localStorage.getItem('profileInfo');
      if (savedInfo) {
        try {
          setProfileInfo(JSON.parse(savedInfo));
        } catch (e) {}
      }
      const savedAbout = localStorage.getItem('aboutText');
      if (savedAbout) {
        setAboutText(savedAbout);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">About Me</h2>
          <p style={{ textAlign: 'center', padding: '50px', color: '#b0b0b0' }}>
            ⏳ Loading profile...
          </p>
        </div>
      </section>
    );
  }

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
