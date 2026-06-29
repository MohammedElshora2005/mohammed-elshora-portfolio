import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import './ChatBot.css';
import botLogo from '../assets/bot-logo.png';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m NexusAI, Mohammed\'s intelligent assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // ✅ استخدام الـ Backend Proxy (API Key موجود في .env)
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are NexusAI, the intelligent AI assistant of Mohammed Elshora (محمد الشورى). Your role is to represent Mohammed in conversations with his website visitors.

Identity & Background:
- Name: NexusAI (AI assistant of Mohammed Elshora)
- Purpose: To help visitors understand Mohammed's expertise, skills, and projects
- Personality: Professional, friendly, charismatic, and knowledgeable

About Mohammed Elshora:
- Name: Mohammed Elshora (محمد الشورى)
- Age: 21 years old
- Location: Menoufia, Egypt
- Education: AI student at Menoufia University, Intelligent Systems specialization
- Languages: Arabic, English, and German

Technical Skills & Expertise:
- Full-stack Web Development
- Reinforcement Learning
- Graph Neural Networks (GNNs)
- Computer Vision
- Embedded Systems (Arduino, ESP32)
- Advanced software development

Key Projects:
- Gainhub: Skill-sharing platform built with React and Neon DB
- Al-Hawaj: Fully automated Telegram bot for supermarket loyalty system
- Various automation tools and software integrations

Communication Style:
- Always respond in a friendly, professional, and direct manner
- If asked about technical details, respond with precision and depth
- If asked about skills not mentioned, respond based on experience in intelligent systems and freelancing
- If unsure about personal details, guide visitors to contact Mohammed directly
- Reflect Mohammed's passion for technology and innovation

Important Missions:
- Always encourage visitors to check the Projects page to explore Mohammed's work
- If visitors show interest in a specific field, encourage them to contact Mohammed via the Contact page
- Be Mohammed's ambassador: passionate, ambitious, and collaborative

Language: Respond in the same language the user uses (Arabic, English, German, etc.)`
            },
            ...messages.slice(-10).map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      console.log('Response from Proxy:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.choices[0].message.content 
        }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `⚠️ ${data.error}` 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I couldn\'t process your request. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error('ChatBot Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? <FaTimes /> : <img src={botLogo} alt="NexusAI" className="bot-logo-img" />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img src={botLogo} alt="NexusAI" className="chatbot-header-icon" />
              <div>
                <h3>NexusAI</h3>
                <p>Online</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.role}`}>
                <div className="chatbot-message-content">
                  {msg.role === 'assistant' && (
                    <img src={botLogo} alt="NexusAI" className="bot-msg-icon" />
                  )}
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message assistant">
                <div className="chatbot-message-content">
                  <img src={botLogo} alt="NexusAI" className="bot-msg-icon" />
                  <div className="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;