// Mohammed_Portfolio\frontend\src\pages\Certificates.jsx

import React, { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaPlay, FaHeart, FaComment, FaStar, FaAward } from 'react-icons/fa';
import { supabase } from '../supabase';
import './Certificates.css';

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentRating, setCommentRating] = useState({});
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || '';
  });
  const [loading, setLoading] = useState(true);

  // ====== Load certificates and interactions from Supabase ======
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load certificates
        const { data: certsData, error: certsError } = await supabase
          .from('certificates')
          .select('*')
          .order('id', { ascending: false });
        
        if (certsError) throw certsError;
        
        if (certsData && certsData.length > 0) {
          setCertificates(certsData);
        } else {
          // بيانات افتراضية
          const defaultCerts = [
            {
              id: 1,
              title: 'Full Stack Web Development',
              issuer: 'Coursera',
              description: 'Completed the Full Stack Web Development specialization covering React, Node.js, MongoDB, and Express.',
              image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
              link: 'https://coursera.org/verify/12345',
              date: '2024-01-15'
            },
            {
              id: 2,
              title: 'Machine Learning Specialization',
              issuer: 'Stanford University',
              description: 'Completed the Machine Learning course covering supervised learning, neural networks, and deep learning.',
              image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=600&h=400&fit=crop',
              link: 'https://coursera.org/verify/67890',
              date: '2023-11-20'
            },
            {
              id: 3,
              title: 'Python for Data Science',
              issuer: 'IBM',
              description: 'Completed Python for Data Science course covering pandas, numpy, matplotlib, and data analysis.',
              image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
              link: 'https://coursera.org/verify/54321',
              date: '2023-09-10'
            }
          ];
          setCertificates(defaultCerts);
          
          // Save default certificates to Supabase
          const { error: insertError } = await supabase
            .from('certificates')
            .insert(defaultCerts.map(c => ({
              title: c.title,
              issuer: c.issuer,
              description: c.description,
              image: c.image,
              link: c.link,
              date: c.date
            })));
          
          if (insertError) console.error('Error inserting default certs:', insertError);
        }

        // Load interactions
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('interactions')
          .select('*')
          .eq('type', 'certificate');
        
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
        console.error('Error loading certificates:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('certificates');
        if (saved) {
          try {
            setCertificates(JSON.parse(saved));
          } catch (e) {
            setCertificates([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ====== Handle Like ======
  const handleLike = async (certId) => {
    const newInteractions = { ...interactions };
    if (!newInteractions[certId]) {
      newInteractions[certId] = { likes: 0, liked: false, comments: [], rating: 0 };
    }
    
    if (newInteractions[certId].liked) {
      newInteractions[certId].likes = (newInteractions[certId].likes || 0) - 1;
      newInteractions[certId].liked = false;
    } else {
      newInteractions[certId].likes = (newInteractions[certId].likes || 0) + 1;
      newInteractions[certId].liked = true;
    }
    
    setInteractions(newInteractions);
    
    try {
      const { error } = await supabase
        .from('interactions')
        .update({ likes: newInteractions[certId].likes })
        .eq('item_id', certId)
        .eq('type', 'certificate');
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  // ====== Handle Add Comment ======
  const handleAddComment = async (certId) => {
    if (!currentUser.trim()) {
      alert('Please enter your name first!');
      return;
    }
    if (!newComment[certId] || newComment[certId].trim() === '') return;
    
    const newInteractions = { ...interactions };
    if (!newInteractions[certId]) {
      newInteractions[certId] = { likes: 0, liked: false, comments: [], rating: 0 };
    }
    if (!newInteractions[certId].comments) {
      newInteractions[certId].comments = [];
    }
    
    const comment = {
      id: Date.now(),
      username: currentUser,
      text: newComment[certId],
      rating: commentRating[certId] || 0,
      date: new Date().toLocaleDateString()
    };
    
    newInteractions[certId].comments.push(comment);
    
    setInteractions(newInteractions);
    setNewComment({ ...newComment, [certId]: '' });
    setCommentRating({ ...commentRating, [certId]: 0 });
    
    try {
      const { error } = await supabase
        .from('interactions')
        .update({ comments: newInteractions[certId].comments })
        .eq('item_id', certId)
        .eq('type', 'certificate');
      
      if (error) throw error;
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // ====== Handle Rating ======
  const handleRating = async (certId, rating) => {
    const newInteractions = { ...interactions };
    if (!newInteractions[certId]) {
      newInteractions[certId] = { likes: 0, liked: false, comments: [], rating: 0 };
    }
    newInteractions[certId].rating = rating;
    setInteractions(newInteractions);
    
    try {
      const { error } = await supabase
        .from('interactions')
        .update({ rating: rating })
        .eq('item_id', certId)
        .eq('type', 'certificate');
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const openModal = (cert) => {
    setSelectedCert(cert);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedCert(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <section id="certificates" className="certificates">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">My Certificates</h2>
          <p style={{ textAlign: 'center', padding: '50px', color: '#b0b0b0' }}>
            ⏳ Loading certificates...
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="certificates" className="certificates">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">My Certificates</h2>
          
          {certificates.length === 0 ? (
            <div className="no-certs">
              <p>🎓 No certificates added yet.</p>
              <p style={{ color: '#00d4ff', fontSize: '0.9rem', marginTop: '10px' }}>
                Add your certificates from the Dashboard!
              </p>
            </div>
          ) : (
            <div className="certificates-grid">
              {certificates.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="cert-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="cert-image">
                    <img src={cert.image || 'https://via.placeholder.com/600x400/1a1a2e/00d4ff?text=Certificate'} alt={cert.title} />
                    <div className="cert-overlay">
                      <button className="view-btn" onClick={() => openModal(cert)}>
                        <FaPlay /> View Details
                      </button>
                    </div>
                  </div>
                  <div className="cert-content">
                    <div className="cert-badge">
                      <FaAward />
                    </div>
                    <h3>{cert.title}</h3>
                    <p className="cert-issuer">{cert.issuer}</p>
                    <p className="cert-description">{cert.description}</p>
                    <div className="cert-date">
                      <span>📅 {cert.date}</span>
                    </div>
                    <div className="cert-links">
                      <a href={cert.link || '#'} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt /> Verify
                      </a>
                    </div>
                    <div className="cert-interactions">
                      <button 
                        className={`interaction-btn like-btn ${interactions[cert.id]?.liked ? 'liked' : ''}`}
                        onClick={() => handleLike(cert.id)}
                      >
                        <FaHeart /> <span className="count">{interactions[cert.id]?.likes || 0}</span>
                      </button>
                      
                      <button 
                        className="interaction-btn"
                        onClick={() => setShowComments({...showComments, [cert.id]: !showComments[cert.id]})}
                      >
                        <FaComment /> <span className="count">{interactions[cert.id]?.comments?.length || 0}</span>
                      </button>
                      
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar 
                            key={star}
                            className={star <= (interactions[cert.id]?.rating || 0) ? 'filled' : ''}
                            onClick={() => handleRating(cert.id, star)}
                          />
                        ))}
                      </div>
                    </div>

                    {showComments[cert.id] && (
                      <div className="comments-section">
                        <div className="comments-list">
                          {(interactions[cert.id]?.comments || []).map((comment) => (
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
                                className={star <= (commentRating[cert.id] || 0) ? 'filled' : ''}
                                onClick={() => setCommentRating({...commentRating, [cert.id]: star})}
                              />
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[cert.id] || ''}
                            onChange={(e) => setNewComment({...newComment, [cert.id]: e.target.value})}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(cert.id)}
                            className="comment-text-input"
                          />
                          <button onClick={() => handleAddComment(cert.id)}>Post</button>
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
      {selectedCert && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-video">
              <img src={selectedCert.image} alt={selectedCert.title} className="modal-image" />
            </div>
            <div className="modal-body">
              <div className="modal-cert-badge">
                <FaAward />
              </div>
              <h2>{selectedCert.title}</h2>
              <p className="modal-issuer">{selectedCert.issuer}</p>
              <p className="modal-description">{selectedCert.description}</p>
              <p className="modal-date">📅 {selectedCert.date}</p>
              <div className="modal-links">
                <a href={selectedCert.link || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <FaExternalLinkAlt /> Verify Certificate
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Certificates;
