// Mohammed_Portfolio\frontend\src\pages\Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../supabase';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaCheck, 
  FaTimesCircle,
  FaStar,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaDatabase,
  FaGitAlt,
  FaVuejs,
  FaAngular,
  FaPhp,
  FaJava,
  FaDocker,
  FaAws,
  FaAward,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiMongodb,
  SiTailwindcss,
  SiDjango,
  SiFlask,
  SiNextdotjs,
  SiGraphql,
  SiPostgresql,
  SiRedis,
  SiKubernetes,
  SiTerraform,
} from 'react-icons/si';
import './Dashboard.css';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [aboutText, setAboutText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [profileImage, setProfileImage] = useState('/src/assets/hero.png');
  const [profileInfo, setProfileInfo] = useState({
    email: '',
    phone: '',
    location: '',
    experience: ''
  });
  const [projectInteractions, setProjectInteractions] = useState({});
  const [certInteractions, setCertInteractions] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [homeContent, setHomeContent] = useState({
    subtitle: 'Full Stack Developer',
    description: "I build exceptional digital experiences with React, Node.js, and modern web technologies. Passionate about creating clean, performant, and user-friendly applications."
  });

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'mohammed';
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'elshora2026';

  // ====== Load all data from Supabase ======
  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load projects
      const { data: projectsData } = await supabase.from('projects').select('*').order('id', { ascending: false });
      if (projectsData) setProjects(projectsData);

      // Load skills
      const { data: skillsData } = await supabase.from('skills').select('*');
      if (skillsData) setSkills(skillsData);

      // Load certificates
      const { data: certsData } = await supabase.from('certificates').select('*').order('id', { ascending: false });
      if (certsData) setCertificates(certsData);

      // Load reviews
      const { data: reviewsData } = await supabase.from('reviews').select('*').order('id', { ascending: false });
      if (reviewsData) setReviews(reviewsData);

      // Load profile info
      const { data: profileData } = await supabase.from('profile_info').select('*').limit(1);
      if (profileData && profileData.length > 0) {
        setProfileInfo(profileData[0]);
      }

      // Load interactions
      const { data: interactionsData } = await supabase.from('interactions').select('*');
      if (interactionsData) {
        const projectInter = {};
        const certInter = {};
        interactionsData.forEach(item => {
          if (item.type === 'project') {
            projectInter[item.item_id] = {
              likes: item.likes || 0,
              liked: false,
              comments: item.comments || [],
              rating: item.rating || 0
            };
          } else if (item.type === 'certificate') {
            certInter[item.item_id] = {
              likes: item.likes || 0,
              liked: false,
              comments: item.comments || [],
              rating: item.rating || 0
            };
          }
        });
        setProjectInteractions(projectInter);
        setCertInteractions(certInter);
      }

      // Load about text
      const { data: aboutData } = await supabase.from('profile_info').select('about_text').limit(1);
      if (aboutData && aboutData.length > 0 && aboutData[0].about_text) {
        setAboutText(aboutData[0].about_text);
      } else {
        setAboutText("I'm Mohammed Elshora, a passionate Full Stack Developer with a strong foundation in modern web technologies. With over 3 years of experience, I specialize in building responsive, performant, and scalable web applications.");
      }

      // Load profile image from localStorage (keep as is for now)
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ====== Save functions with Supabase ======
  const saveProjects = async (newProjects) => {
    // Delete all existing projects
    await supabase.from('projects').delete().neq('id', 0);
    // Insert new projects
    if (newProjects.length > 0) {
      const { error } = await supabase.from('projects').insert(
        newProjects.map(p => ({
          title: p.title,
          description: p.description,
          long_description: p.longDescription,
          tech: p.tech,
          github: p.github,
          live: p.live,
          video: p.video,
          image: p.image
        }))
      );
      if (error) console.error('Error saving projects:', error);
    }
    setProjects(newProjects);
  };

  const saveSkills = async (newSkills) => {
    await supabase.from('skills').delete().neq('id', 0);
    if (newSkills.length > 0) {
      const { error } = await supabase.from('skills').insert(
        newSkills.map(s => ({
          name: s.name,
          icon: s.icon,
          color: s.color,
          level: s.level
        }))
      );
      if (error) console.error('Error saving skills:', error);
    }
    setSkills(newSkills);
  };

  const saveCertificates = async (newCerts) => {
    await supabase.from('certificates').delete().neq('id', 0);
    if (newCerts.length > 0) {
      const { error } = await supabase.from('certificates').insert(
        newCerts.map(c => ({
          title: c.title,
          issuer: c.issuer,
          description: c.description,
          image: c.image,
          link: c.link,
          date: c.date
        }))
      );
      if (error) console.error('Error saving certificates:', error);
    }
    setCertificates(newCerts);
  };

  const saveReviews = async (newReviews) => {
    await supabase.from('reviews').delete().neq('id', 0);
    if (newReviews.length > 0) {
      const { error } = await supabase.from('reviews').insert(
        newReviews.map(r => ({
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          date: r.date,
          approved: r.approved
        }))
      );
      if (error) console.error('Error saving reviews:', error);
    }
    setReviews(newReviews);
  };

  const saveProfileInfo = async (e) => {
    e.preventDefault();
    try {
      await supabase.from('profile_info').delete().neq('id', 0);
      const { error } = await supabase.from('profile_info').insert([{
        email: profileInfo.email,
        phone: profileInfo.phone,
        location: profileInfo.location,
        experience: profileInfo.experience,
        about_text: aboutText
      }]);
      if (error) throw error;
      alert('✅ Profile information saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Failed to save profile');
    }
  };

  const saveHomeContent = async (e) => {
    e.preventDefault();
    try {
      // Store home content in localStorage for now (since no specific table)
      localStorage.setItem('homeContent', JSON.stringify(homeContent));
      alert('✅ Home page content saved successfully!');
    } catch (error) {
      console.error('Error saving home content:', error);
      alert('❌ Failed to save home content');
    }
  };

  // ====== Load data on mount ======
  useEffect(() => {
    const auth = localStorage.getItem('dashboardAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
      localStorage.setItem('dashboardAuth', 'true');
      loadAllData();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // ====== Projects CRUD ======
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: 'New Project',
      description: 'Project description',
      longDescription: '',
      tech: ['React', 'Node.js'],
      github: '',
      live: '',
      video: '',
      image: ''
    };
    const newProjects = [newProject, ...projects];
    saveProjects(newProjects);
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      const newProjects = projects.filter(p => p.id !== id);
      await saveProjects(newProjects);
    }
  };

  // ====== Skills CRUD ======
  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: 'New Skill',
      icon: 'FaReact',
      color: '#61DAFB',
      level: 50
    };
    const newSkills = [newSkill, ...skills];
    saveSkills(newSkills);
  };

  const deleteSkill = async (id) => {
    if (window.confirm('Delete this skill?')) {
      const newSkills = skills.filter(s => s.id !== id);
      await saveSkills(newSkills);
    }
  };

  // ====== Certificates CRUD ======
  const addCertificate = () => {
    const newCert = {
      id: Date.now(),
      title: 'New Certificate',
      issuer: 'Issuer Name',
      description: 'Certificate description',
      image: '',
      link: '',
      date: new Date().toISOString().split('T')[0]
    };
    const newCerts = [newCert, ...certificates];
    saveCertificates(newCerts);
  };

  const deleteCertificate = async (id) => {
    if (window.confirm('Delete this certificate?')) {
      const newCerts = certificates.filter(c => c.id !== id);
      await saveCertificates(newCerts);
    }
  };

  // ====== Reviews CRUD ======
  const approveReview = async (id) => {
    const newReviews = reviews.map(r => 
      r.id === id ? { ...r, approved: true } : r
    );
    await saveReviews(newReviews);
  };

  const deleteReview = async (id) => {
    if (window.confirm('Delete this review permanently?')) {
      const newReviews = reviews.filter(r => r.id !== id);
      await saveReviews(newReviews);
    }
  };

  // ====== Profile Image ======
  const changeProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        localStorage.setItem('profileImage', imageData);
        setProfileImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // ====== Manage Comments ======
  const deleteComment = async (projectId, commentId) => {
    if (window.confirm('Delete this comment?')) {
      const newInteractions = { ...projectInteractions };
      if (newInteractions[projectId] && newInteractions[projectId].comments) {
        newInteractions[projectId].comments = newInteractions[projectId].comments.filter(
          c => c.id !== commentId
        );
        setProjectInteractions(newInteractions);
        // Update in Supabase
        await supabase.from('interactions')
          .update({ comments: newInteractions[projectId].comments })
          .eq('item_id', projectId)
          .eq('type', 'project');
      }
    }
  };

  const clearAllComments = async (projectId) => {
    if (window.confirm('Delete all comments from this project?')) {
      const newInteractions = { ...projectInteractions };
      if (newInteractions[projectId]) {
        newInteractions[projectId].comments = [];
        setProjectInteractions(newInteractions);
        await supabase.from('interactions')
          .update({ comments: [] })
          .eq('item_id', projectId)
          .eq('type', 'project');
      }
    }
  };

  const deleteCertComment = async (certId, commentId) => {
    if (window.confirm('Delete this comment?')) {
      const newInteractions = { ...certInteractions };
      if (newInteractions[certId] && newInteractions[certId].comments) {
        newInteractions[certId].comments = newInteractions[certId].comments.filter(
          c => c.id !== commentId
        );
        setCertInteractions(newInteractions);
        await supabase.from('interactions')
          .update({ comments: newInteractions[certId].comments })
          .eq('item_id', certId)
          .eq('type', 'certificate');
      }
    }
  };

  const clearAllCertComments = async (certId) => {
    if (window.confirm('Delete all comments from this certificate?')) {
      const newInteractions = { ...certInteractions };
      if (newInteractions[certId]) {
        newInteractions[certId].comments = [];
        setCertInteractions(newInteractions);
        await supabase.from('interactions')
          .update({ comments: [] })
          .eq('item_id', certId)
          .eq('type', 'certificate');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="dashboard-login">
        <div className="container">
          <div className="login-box">
            <h2>Dashboard Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loginError && <p className="login-error">{loginError}</p>}
              <button type="submit" className="btn-primary">
                Login
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="dashboard">
        <div className="container">
          <h2 className="section-title">Dashboard</h2>
          <p style={{ textAlign: 'center', padding: '50px', color: '#b0b0b0' }}>
            ⏳ Loading data from Supabase...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="container">
        <h2 className="section-title">Dashboard</h2>
        <p className="dashboard-welcome">Welcome to Dashboard</p>

        <div className="dashboard-sections-grid">
          {/* ====== Profile Information ====== */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h3>Edit Profile Information</h3>
            </div>
            <div className="dashboard-card">
              <form onSubmit={saveProfileInfo} className="profile-info-form">
                <input
                  type="text"
                  value={profileInfo.email || ''}
                  onChange={(e) => setProfileInfo({...profileInfo, email: e.target.value})}
                  placeholder="Email"
                  className="full-width"
                />
                <input
                  type="text"
                  value={profileInfo.phone || ''}
                  onChange={(e) => setProfileInfo({...profileInfo, phone: e.target.value})}
                  placeholder="Phone"
                />
                <input
                  type="text"
                  value={profileInfo.location || ''}
                  onChange={(e) => setProfileInfo({...profileInfo, location: e.target.value})}
                  placeholder="Location"
                />
                <input
                  type="text"
                  value={profileInfo.experience || ''}
                  onChange={(e) => setProfileInfo({...profileInfo, experience: e.target.value})}
                  placeholder="Experience (e.g., 3+ Years)"
                />
                <button type="submit" className="btn-primary">
                  <FaSave /> Save Profile Info
                </button>
              </form>
            </div>
          </div>

          {/* ====== Edit About Me ====== */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h3>Edit About Me</h3>
            </div>
            <div className="dashboard-card">
              {editing?.type === 'about' ? (
                <div className="edit-form">
                  <textarea
                    value={editForm.text || ''}
                    onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                    rows="6"
                    placeholder="About Me Text"
                  />
                  <div className="edit-actions">
                    <button onClick={async () => {
                      setAboutText(editForm.text);
                      await saveProfileInfo({ preventDefault: () => {} });
                      setEditing(null);
                    }} className="btn-primary">
                      <FaSave />
                    </button>
                    <button onClick={() => setEditing(null)} className="btn-secondary">
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{aboutText || 'No about text set.'}</p>
                  <div className="card-actions">
                    <button onClick={() => {
                      setEditing({ type: 'about', id: 'about' });
                      setEditForm({ text: aboutText });
                    }}>
                      <FaEdit />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ====== Edit Home Page Content ====== */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h3>Edit Home Page Content</h3>
            </div>
            <div className="dashboard-card">
              <form onSubmit={saveHomeContent} className="edit-form">
                <input
                  type="text"
                  value={homeContent.subtitle}
                  onChange={(e) => setHomeContent({...homeContent, subtitle: e.target.value})}
                  placeholder="Subtitle (e.g., Full Stack Developer)"
                />
                <textarea
                  value={homeContent.description}
                  onChange={(e) => setHomeContent({...homeContent, description: e.target.value})}
                  placeholder="Description"
                  rows="4"
                />
                <button type="submit" className="btn-primary">
                  <FaSave /> Save Home Content
                </button>
              </form>
            </div>
          </div>

          {/* ====== Change Profile Image ====== */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Change Profile Image</h3>
            </div>
            <div className="dashboard-card">
              <div className="profile-image-upload">
                <img src={profileImage} alt="Profile" className="profile-preview" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={changeProfileImage}
                  id="profileImageUpload"
                />
                <label htmlFor="profileImageUpload" className="btn-primary">
                  Upload New Image
                </label>
              </div>
            </div>
          </div>

          {/* ====== Manage Projects ====== */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Manage Projects</h3>
              <button onClick={addProject} className="btn-primary">
                <FaPlus /> Add Project
              </button>
            </div>
            <div className="dashboard-grid">
              {projects.length === 0 ? (
                <p style={{ color: '#6a6a6a', textAlign: 'center', padding: '20px' }}>
                  No projects yet. Add one!
                </p>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="dashboard-card">
                    {editing?.type === 'project' && editing.id === project.id ? (
                      <div className="edit-form">
                        <input
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          placeholder="Title"
                        />
                        <input
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          placeholder="Description"
                        />
                        <input
                          value={editForm.longDescription || ''}
                          onChange={(e) => setEditForm({...editForm, longDescription: e.target.value})}
                          placeholder="Long Description"
                        />
                        <input
                          value={editForm.github || ''}
                          onChange={(e) => setEditForm({...editForm, github: e.target.value})}
                          placeholder="GitHub URL"
                        />
                        <input
                          value={editForm.live || ''}
                          onChange={(e) => setEditForm({...editForm, live: e.target.value})}
                          placeholder="Live Demo URL"
                        />
                        <input
                          value={editForm.video || ''}
                          onChange={(e) => setEditForm({...editForm, video: e.target.value})}
                          placeholder="Video URL"
                        />
                        <input
                          value={editForm.image || ''}
                          onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                          placeholder="Image URL"
                        />
                        <input
                          value={editForm.tech ? editForm.tech.join(', ') : ''}
                          onChange={(e) => setEditForm({...editForm, tech: e.target.value.split(',').map(t => t.trim())})}
                          placeholder="Technologies (comma separated)"
                        />
                        <div className="edit-actions">
                          <button onClick={async () => {
                            const newProjects = projects.map(p => 
                              p.id === editing.id ? editForm : p
                            );
                            await saveProjects(newProjects);
                            setEditing(null);
                          }} className="btn-primary">
                            <FaSave />
                          </button>
                          <button onClick={() => setEditing(null)} className="btn-secondary">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                        <div className="card-actions">
                          <button onClick={() => {
                            setEditing({ type: 'project', id: project.id });
                            setEditForm(project);
                          }}>
                            <FaEdit />
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => deleteProject(project.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ====== Manage Skills ====== */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Manage Skills</h3>
              <button onClick={addSkill} className="btn-primary">
                <FaPlus /> Add Skill
              </button>
            </div>
            <div className="dashboard-grid skills-grid-dash">
              {skills.length === 0 ? (
                <p style={{ color: '#6a6a6a', textAlign: 'center', padding: '20px' }}>
                  No skills yet. Add one!
                </p>
              ) : (
                skills.map((skill, index) => (
                  <div key={skill.id || index} className="dashboard-card skill-card-dash">
                    {editing?.type === 'skill' && editing.index === index ? (
                      <div className="edit-form">
                        <input
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="Skill Name"
                        />
                        <select
                          value={editForm.icon || 'FaReact'}
                          onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                          className="icon-select"
                        >
                          <optgroup label="Frontend">
                            <option value="FaHtml5">HTML5</option>
                            <option value="FaCss3Alt">CSS3</option>
                            <option value="FaJs">JavaScript</option>
                            <option value="SiTypescript">TypeScript</option>
                            <option value="FaReact">React</option>
                            <option value="SiNextdotjs">Next.js</option>
                            <option value="FaVuejs">Vue.js</option>
                            <option value="FaAngular">Angular</option>
                          </optgroup>
                          <optgroup label="Backend">
                            <option value="FaNodeJs">Node.js</option>
                            <option value="FaPython">Python</option>
                            <option value="SiDjango">Django</option>
                            <option value="SiFlask">Flask</option>
                            <option value="FaPhp">PHP</option>
                            <option value="FaJava">Java</option>
                          </optgroup>
                          <optgroup label="Database">
                            <option value="SiMongodb">MongoDB</option>
                            <option value="SiPostgresql">PostgreSQL</option>
                            <option value="FaDatabase">SQL</option>
                            <option value="SiRedis">Redis</option>
                          </optgroup>
                          <optgroup label="DevOps & Cloud">
                            <option value="FaDocker">Docker</option>
                            <option value="SiKubernetes">Kubernetes</option>
                            <option value="FaAws">AWS</option>
                            <option value="SiTerraform">Terraform</option>
                          </optgroup>
                          <optgroup label="Other">
                            <option value="SiTailwindcss">Tailwind</option>
                            <option value="SiGraphql">GraphQL</option>
                            <option value="FaGitAlt">Git</option>
                          </optgroup>
                        </select>
                        <input
                          value={editForm.icon || ''}
                          onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                          placeholder="Or type icon name manually"
                          className="icon-manual-input"
                        />
                        <input
                          type="color"
                          value={editForm.color || '#00d4ff'}
                          onChange={(e) => setEditForm({...editForm, color: e.target.value})}
                          className="color-picker"
                        />
                        <input
                          value={editForm.level || 0}
                          type="number"
                          min="0"
                          max="100"
                          onChange={(e) => setEditForm({...editForm, level: parseInt(e.target.value) || 0})}
                          placeholder="Level (0-100)"
                        />
                        <div className="edit-actions">
                          <button onClick={async () => {
                            const newSkills = [...skills];
                            newSkills[index] = editForm;
                            await saveSkills(newSkills);
                            setEditing(null);
                          }} className="btn-primary">
                            <FaSave />
                          </button>
                          <button onClick={() => setEditing(null)} className="btn-secondary">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4>{skill.name}</h4>
                        <p>{skill.level}%</p>
                        <div className="card-actions">
                          <button onClick={() => {
                            setEditing({ type: 'skill', index: index });
                            setEditForm(skill);
                          }}>
                            <FaEdit />
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => deleteSkill(skill.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ====== Manage Certificates ====== */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Manage Certificates</h3>
              <button onClick={addCertificate} className="btn-primary">
                <FaPlus /> <FaAward /> Add Certificate
              </button>
            </div>
            <div className="dashboard-grid">
              {certificates.length === 0 ? (
                <p style={{ color: '#6a6a6a', textAlign: 'center', padding: '20px' }}>
                  No certificates yet. Add one!
                </p>
              ) : (
                certificates.map(cert => (
                  <div key={cert.id} className="dashboard-card">
                    {editing?.type === 'certificate' && editing.id === cert.id ? (
                      <div className="edit-form">
                        <input
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          placeholder="Certificate Title"
                        />
                        <input
                          value={editForm.issuer || ''}
                          onChange={(e) => setEditForm({...editForm, issuer: e.target.value})}
                          placeholder="Issuer"
                        />
                        <textarea
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          placeholder="Description"
                          rows="3"
                        />
                        <input
                          value={editForm.image || ''}
                          onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                          placeholder="Image URL"
                        />
                        <input
                          value={editForm.link || ''}
                          onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                          placeholder="Verification Link"
                        />
                        <input
                          type="date"
                          value={editForm.date || ''}
                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                        />
                        <div className="edit-actions">
                          <button onClick={async () => {
                            const newCerts = certificates.map(c => 
                              c.id === editing.id ? editForm : c
                            );
                            await saveCertificates(newCerts);
                            setEditing(null);
                          }} className="btn-primary">
                            <FaSave />
                          </button>
                          <button onClick={() => setEditing(null)} className="btn-secondary">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4>{cert.title}</h4>
                        <p>{cert.issuer}</p>
                        <small>{cert.date}</small>
                        <div className="card-actions">
                          <button onClick={() => {
                            setEditing({ type: 'certificate', id: cert.id });
                            setEditForm(cert);
                          }}>
                            <FaEdit />
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => deleteCertificate(cert.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ====== Manage Reviews ====== */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h3>Manage Reviews</h3>
            </div>
            {reviews.length === 0 ? (
              <p style={{ color: '#6a6a6a', textAlign: 'center', padding: '30px' }}>
                No reviews yet.
              </p>
            ) : (
              <div className="dashboard-grid">
                {reviews.map(review => (
                  <div key={review.id} className={`dashboard-card review-card-dash ${review.approved ? 'approved' : 'pending'}`}>
                    <h4>{review.name}</h4>
                    <div className="review-rating-dash">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className={star <= review.rating ? 'filled' : ''} />
                      ))}
                    </div>
                    <p className="review-comment-dash">{review.comment}</p>
                    <small className="review-date-dash">{review.date}</small>
                    <div className="review-status">
                      {review.approved ? (
                        <span className="status-approved">✅ Approved</span>
                      ) : (
                        <span className="status-pending">⏳ Pending</span>
                      )}
                    </div>
                    <div className="card-actions">
                      {!review.approved && (
                        <button className="approve-btn" onClick={() => approveReview(review.id)}>
                          <FaCheck /> Approve
                        </button>
                      )}
                      <button 
                        className="delete-btn reject-btn" 
                        onClick={() => deleteReview(review.id)}
                      >
                        <FaTimesCircle /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ====== Manage Project Comments ====== */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h3>Manage Project Comments</h3>
            </div>
            {projects.length === 0 ? (
              <p style={{ color: '#6a6a6a', textAlign: 'center', padding: '30px' }}>
                No projects to manage comments.
              </p>
            ) : (
              <div className="dashboard-grid">
                {projects.map(project => {
                  const comments = projectInteractions[project.id]?.comments || [];
                  if (comments.length === 0) return null;
                  
                  return (
                    <div key={project.id} className="dashboard-card comment-manage-card">
                      <h4>{project.title}</h4>
                      <p className="comment-count">{comments.length} comments</p>
                      <div className="comment-list-manage">
                        {comments.map(comment => (
                          <div key={comment.id} className="comment-item-manage">
                            <div className="comment-info">
                              <strong>{comment.username || 'Anonymous'}</strong>
                              <p>{comment.text}</p>
                              <small>{comment.date} ⭐ {comment.rating || 0}/5</small>
                            </div>
                            <button 
                              className="delete-btn delete-comment-btn"
                              onClick={() => deleteComment(project.id, comment.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        className="delete-btn clear-comments-btn"
                        onClick={() => clearAllComments(project.id)}
                      >
                        <FaTrash /> Clear All Comments
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ====== Manage Certificate Comments ====== */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h3>Manage Certificate Comments</h3>
            </div>
            {certificates.length === 0 ? (
              <p style={{ color: '#6a6a6a', textAlign: 'center', padding: '30px' }}>
                No certificates to manage comments.
              </p>
            ) : (
              <div className="dashboard-grid">
                {certificates.map(cert => {
                  const comments = certInteractions[cert.id]?.comments || [];
                  if (comments.length === 0) return null;
                  
                  return (
                    <div key={cert.id} className="dashboard-card comment-manage-card">
                      <h4>{cert.title}</h4>
                      <p className="comment-count">{comments.length} comments</p>
                      <div className="comment-list-manage">
                        {comments.map(comment => (
                          <div key={comment.id} className="comment-item-manage">
                            <div className="comment-info">
                              <strong>{comment.username || 'Anonymous'}</strong>
                              <p>{comment.text}</p>
                              <small>{comment.date} ⭐ {comment.rating || 0}/5</small>
                            </div>
                            <button 
                              className="delete-btn delete-comment-btn"
                              onClick={() => deleteCertComment(cert.id, comment.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        className="delete-btn clear-comments-btn"
                        onClick={() => clearAllCertComments(cert.id)}
                      >
                        <FaTrash /> Clear All Comments
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
