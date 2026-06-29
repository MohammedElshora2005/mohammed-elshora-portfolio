import React from 'react';
import { FaWhatsapp, FaTelegram, FaFacebook, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './SocialSidebar.css';

const SocialSidebar = () => {
  return (
    <div className="social-sidebar">
      <div className="social-sidebar-inner">
        <a 
          href="https://wa.me/201020063819" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon whatsapp"
          title="WhatsApp"
        >
          <FaWhatsapp />
        </a>
        <a 
          href="https://t.me/Muhamedhosny" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon telegram"
          title="Telegram"
        >
          <FaTelegram />
        </a>
        <a 
          href="https://www.facebook.com/moohamed.elshora" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon facebook"
          title="Facebook"
        >
          <FaFacebook />
        </a>
        <a 
          href="https://github.com/MohammedElshora2005" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon github"
          title="GitHub"
        >
          <FaGithub />
        </a>
        <a 
          href="https://www.linkedin.com/in/mohammed-elshora-45162933a" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon linkedin"
          title="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a 
          href="mailto:muhammedhosni70@gmail.com"
          className="social-icon email"
          title="Email"
        >
          <FaEnvelope />
        </a>
      </div>
    </div>
  );
};

export default SocialSidebar;