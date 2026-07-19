// Mohammed_Portfolio\frontend\src\pages\Skills.jsx

import React, { useState, useEffect } from 'react';
import * as Icons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('skills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // بيانات افتراضية
    return [
      { id: 1, name: 'HTML5', icon: 'FaHtml5', color: '#E44D26', level: 95 },
      { id: 2, name: 'CSS3', icon: 'FaCss3Alt', color: '#1572B6', level: 90 },
      { id: 3, name: 'JavaScript', icon: 'FaJs', color: '#F7DF1E', level: 85 },
      { id: 4, name: 'React', icon: 'FaReact', color: '#61DAFB', level: 85 },
      { id: 5, name: 'Node.js', icon: 'FaNodeJs', color: '#339933', level: 80 },
      { id: 6, name: 'Python', icon: 'FaPython', color: '#3776AB', level: 70 },
    ];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('skills');
      if (saved) {
        try {
          setSkills(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing skills:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // دالة لجلب الأيقونة من أي مكتبة
  const getIcon = (iconName) => {
    if (!iconName) return <Icons.FaReact />;
    
    // حاول تجيب من react-icons/fa
    try {
      const Icon = Icons[iconName];
      if (Icon) return <Icon />;
    } catch (e) {}
    
    // حاول تجيب من react-icons/si
    try {
      const Icon = SiIcons[iconName];
      if (Icon) return <Icon />;
    } catch (e) {}
    
    // لو مفيش، استخدم أيقونة افتراضية
    return <Icons.FaReact />;
  };

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">My Skills</h2>
        
        {skills.length === 0 ? (
          <div className="no-skills">
            <p>🚀 No skills added yet.</p>
            <p style={{ color: '#00d4ff', fontSize: '0.9rem', marginTop: '10px' }}>
              Add your skills from the Dashboard!
            </p>
          </div>
        ) : (
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div
                key={skill.id || index}
                className="skill-card"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className="skill-icon" style={{ color: skill.color || '#00d4ff' }}>
                  {getIcon(skill.icon)}
                </div>
                <h3>{skill.name}</h3>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ 
                      width: `${skill.level || 50}%`,
                      background: `linear-gradient(90deg, ${skill.color || '#00d4ff'}, #00d4ff)`
                    }}
                  >
                    <span>{skill.level || 50}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;