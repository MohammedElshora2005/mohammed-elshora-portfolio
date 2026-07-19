// Mohammed_Portfolio\frontend\src\pages\Reviews.jsx

import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      alert('Please fill all fields');
      return;
    }
    
    const newReview = {
      id: Date.now(),
      ...formData,
      rating: parseInt(formData.rating),
      date: new Date().toLocaleDateString(),
      approved: false
    };
    
    setReviews([newReview, ...reviews]);
    setFormData({ name: '', rating: 5, comment: '' });
    
    alert('Review submitted! Waiting for approval.');
  };

  const approvedReviews = reviews.filter(r => r.approved);

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
            />
            <div className="rating-select">
              <label>Rating:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
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
            />
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </form>
          <p className="review-note">
            Your review will be visible after admin approval.
          </p>
        </div>

        <div className="reviews-list">
          {approvedReviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            approvedReviews.map((review) => (
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