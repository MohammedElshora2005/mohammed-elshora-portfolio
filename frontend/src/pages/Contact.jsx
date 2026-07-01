import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    
    try {
      // ✅ التعديل هنا: استخدم `/api/contact` بدل `http://localhost:5000/api/contact`
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(true);
        setTimeout(() => setError(false), 5000);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(true);
      setTimeout(() => setError(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-info" data-aos="fade-right">
            <h3>Let's Talk</h3>
            <p>
              Have a project in mind or want to collaborate? Feel free to reach out!
            </p>
            <div className="info-item">
              <FaEnvelope />
              <span>muhammedhosni70@gmail.com</span>
            </div>
            <div className="info-item">
              <FaPhone />
              <span>01020063819</span>
            </div>
            <div className="info-item">
              <FaWhatsapp />
              <a href="https://wa.me/201020063819" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
            <div className="info-item">
              <FaTelegram />
              <a href="https://t.me/Muhamedhosny" target="_blank" rel="noopener noreferrer">
                @Muhamedhosny
              </a>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt />
              <span>Egypt</span>
            </div>
            <div className="social-links">
              <a href="https://github.com/MohammedElshora2005" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/mohammed-elshora-45162933a" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="mailto:muhammedhosni70@gmail.com">
                <FaEnvelope />
              </a>
            </div>
          </div>

          <form className="contact-form" data-aos="fade-left" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {success && <p className="success-message">Thank you for your message! I will get back to you soon.</p>}
            {error && <p className="error-message">Failed to send. Please try again or email me directly.</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;