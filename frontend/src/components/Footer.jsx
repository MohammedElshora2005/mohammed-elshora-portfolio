// Mohammed_Portfolio\frontend\src\components\Footer.jsx

import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; 2026 Mohammed Elshora. All rights reserved.</p>
          <div className="footer-social">
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
      </div>
    </footer>
  );
};

export default Footer;