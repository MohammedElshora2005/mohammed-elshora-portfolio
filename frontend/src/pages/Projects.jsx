// Mohammed_Portfolio\frontend\src\pages\Projects.jsx

import React, { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaPlay, FaHeart, FaComment, FaStar } from 'react-icons/fa';
import { supabase } from '../supabase';
import './Projects.css';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentRating, setCommentRating] = useState({});
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || '';
  });

  // ====== Load projects and interactions from Supabase ======
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });
        
        if (projectsError) throw projectsError;
        if (projectsData) {
          setProjects(projectsData);
        }

        // Load interactions
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('interactions')
          .select('*')
          .eq('type', 'project');
        
        if (interactionsError) throw interactionsError;
        
        if (interactionsData) {
          const inter = {};
          interactionsData.forEach(item => {
            inter[item.item_id] = {
              likes: item.likes || 0,
              liked: false,
              comments: item.comments || [],
              rating: item.rating || 0
            };
          });
          setInteractions(inter);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadData();
  }, []);

  // ====== Handle Like ======
  const handleLike = async (projectId) => {
    const newInteractions = { ...interactions };
    if (!newInteractions[projectId]) {
      newInteractions[projectId] = { likes: 0, liked: false, comments: [], rating: 0 };
    }
    
    if (newInteractions[projectId].liked) {
      newInteractions[projectId].likes = (newInteractions[projectId].likes || 0) - 1;
      newInteractions[projectId].liked = false;
    } else {
      newInteractions[projectId].likes = (newInteractions[projectId].likes || 0) + 1;
      newInteractions[projectId].liked = true;
    }
    
    setInteractions(newInteractions);
    
    // Update Supabase
    try {
      const { error } = await supabase
        .from('interactions')
        .update({ 
          likes: newInteractions[projectId].likes
        })
        .eq('item_id', projectId)
        .eq('type', 'project');
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  // ====== Handle Add Comment ======
  const handleAddComment = async (projectId) => {
    if (!currentUser.trim()) {
      alert('Please enter your name first!');
      return;
    }
    if (!newComment[projectId] || newComment[projectId].trim() === '') return;
    
    const newInteractions = { ...interactions };
    if (!newInteractions[projectId]) {
      newInteractions[projectId] = { likes: 0, liked: false, comments: [], rating: 0 };
    }
    if (!newInteractions[projectId].comments) {
      newInteractions[projectId].comments = [];
    }
    
    const comment = {
      id: Date.now(),
      username: currentUser,
      text: newComment[projectId],
      rating: commentRating[projectId] || 0,
      date: new Date().toLocaleDateString()
    };
    
    newInteractions[projectId].comments.push(comment);
    
    setInteractions(newInteractions);
    setNewComment({ ...newComment, [projectId]: '' });
    setCommentRating({ ...commentRating, [projectId]: 0 });
    
    // Update Supabase
    try {
      const { error } = await supabase
        .from('interactions')
        .update({ 
          comments: newInteractions[projectId].comments
        })
        .eq('item_id', projectId)
        .eq('type', 'project');
      
      if (error) throw error;
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // ====== Handle Rating ======
  const handleRating = async (projectId, rating) => {
    const newInteractions = { ...interactions };
    if (!newInteractions[projectId]) {
      newInteractions[projectId] = { likes: 0, liked: false, comments: [], rating: 0 };
    }
    newInteractions[projectId].rating = rating;
    setInteractions(newInteractions);
    
    // Update Supabase
    try {
      const { error } = await supabase
        .from('interactions')
        .update({ rating: rating })
        .eq('item_id', projectId)
        .eq('type', 'project');
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">My Projects</h2>
          
          {projects.length === 0 ? (
            <div className="no-projects">
              <p>🚀 No projects added yet.</p>
              <p style={{ color: '#00d4ff', fontSize: '0.9rem', marginTop: '10px' }}>
                Add your projects from the Dashboard!
              </p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div
                  key={project.id || index}
                  className="project-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="project-image">
                    <img src={project.image || 'https://via.placeholder.com/600x400/1a1a2e/00d4ff?text=Project'} alt={project.title} />
                    <div className="project-overlay">
                      <button className="view-btn" onClick={() => openModal(project)}>
                        <FaPlay /> View Details
                      </button>
                    </div>
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tech-stack">
                      {project.tech && project.tech.slice(0, 4).map((tech, i) => (
                        <span key={i}>{tech}</span>
                      ))}
                      {project.tech && project.tech.length > 4 && <span>+{project.tech.length - 4}</span>}
                    </div>
                    <div className="project-links">
                      <a href={project.github || '#'} target="_blank" rel="noopener noreferrer">
                        <FaGithub /> Code
                      </a>
                      <a href={project.live || '#'} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    </div>
                    <div className="project-interactions">
                      <button 
                        className={`interaction-btn like-btn ${interactions[project.id]?.liked ? 'liked' : ''}`}
                        onClick={() => handleLike(project.id)}
                      >
                        <FaHeart /> <span className="count">{interactions[project.id]?.likes || 0}</span>
                      </button>
                      
                      <button 
                        className="interaction-btn"
                        onClick={() => setShowComments({...showComments, [project.id]: !showComments[project.id]})}
                      >
                        <FaComment /> <span className="count">{interactions[project.id]?.comments?.length || 0}</span>
                      </button>
                      
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar 
                            key={star}
                            className={star <= (interactions[project.id]?.rating || 0) ? 'filled' : ''}
                            onClick={() => handleRating(project.id, star)}
                          />
                        ))}
                      </div>
                    </div>

                    {showComments[project.id] && (
                      <div className="comments-section">
                        <div className="comments-list">
                          {(interactions[project.id]?.comments || []).map((comment) => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-header">
                                <strong>{comment.username || 'Anonymous'}</strong>
                                <span className="comment-rating-display">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar key={star} className={star <= (comment.rating || 0) ? 'filled' : ''} />
                                  ))}
                                </span>
                                <small>{comment.date}</small>
                              </div>
                              <p>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="add-comment">
                          <input
                            type="text"
                            placeholder="Your name..."
                            value={currentUser}
                            onChange={(e) => {
                              setCurrentUser(e.target.value);
                              localStorage.setItem('currentUser', e.target.value);
                            }}
                            className="comment-name-input"
                          />
                          <div className="comment-rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= (commentRating[project.id] || 0) ? 'filled' : ''}
                                onClick={() => setCommentRating({...commentRating, [project.id]: star})}
                              />
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[project.id] || ''}
                            onChange={(e) => setNewComment({...newComment, [project.id]: e.target.value})}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(project.id)}
                            className="comment-text-input"
                          />
                          <button onClick={() => handleAddComment(project.id)}>Post</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== Modal ====== */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-video">
              {selectedProject.video ? (
                <iframe
                  src={selectedProject.video}
                  title={selectedProject.title}
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="no-video">
                  <p>No video available for this project</p>
                </div>
              )}
            </div>
            <div className="modal-body">
              <h2>{selectedProject.title}</h2>
              <p className="modal-description">{selectedProject.long_description || selectedProject.description}</p>
              <div className="modal-tech">
                <h4>Technologies Used:</h4>
                <div className="tech-stack">
                  {selectedProject.tech && selectedProject.tech.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>
              </div>
              <div className="modal-links">
                <a href={selectedProject.github || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <FaGithub /> View Code
                </a>
                <a href={selectedProject.live || '#'} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <FaExternalLinkAlt /> Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
