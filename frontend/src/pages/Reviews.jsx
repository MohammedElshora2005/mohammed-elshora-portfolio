// Mohammed_Portfolio\frontend\src\pages\Reviews.jsx

import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../supabase';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ====== Load reviews from Supabase ======
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('approved', true)
          .order('id', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setReviews(data);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('reviews');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setReviews(parsed.filter(r => r.approved));
          } catch (e) {
            setReviews([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // ====== Handle Submit Review ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      alert('Please fill all fields');
      return;
    }
    
    setSubmitLoading(true);
    setSuccessMessage('');
    
    try {
      const newReview = {
        name: formData.name,
        rating: parseInt(formData.rating),
        comment: formData.comment,
        date: new Date().toLocaleDateString(),
        approved: false
      };
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview])
        .select();
      
      if (error) throw error;
      
      // Update local state
      if (data) {
        setReviews(prev => [...prev, ...data]);
      }
      
      setFormData({ name: '', rating: 5, comment: '' });
      setSuccessMessage('✅ Review submitted! Waiting for approval.');
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('❌ Failed to submit review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <section id="reviews" className="reviews">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Reviews</h2>
          <p style={{ textAlign: 'center', padding: '50px', color: '#b0b0b0' }}>
            ⏳ Loading reviews...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Reviews</h2>
        
        <div className="review-form" data-aos="fade-up">
          <h3>Leave a Review</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={submitLoading}
            />
            <div className="rating-select">
              <label>Rating:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  disabled={submitLoading}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            <textarea
              name="comment"
              placeholder="Your Comment"
              value={formData.comment}
              onChange={handleChange}
              rows="4"
              required
              disabled={submitLoading}
            />
            <button type="submit" className="btn-primary" disabled={submitLoading}>
              {submitLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <p className="review-note">
            Your review will be visible after admin approval.
          </p>
        </div>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card" data-aos="fade-up">
                <div className="review-header">
                  <h3>{review.name}</h3>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className={star <= review.rating ? 'filled' : ''} />
                    ))}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
