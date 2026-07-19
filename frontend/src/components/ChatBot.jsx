// Mohammed_Portfolio\frontend\src\components\ChatBot.jsx

import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import './ChatBot.css';
import botLogo from '../assets/bot-logo.png';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً! أنا NexusAI، المساعد الذكي لمحمد الشورى. كيف يمكنني مساعدتك اليوم؟' }
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
      // ✅ استخدام API URL من Environment Variables
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `أنت NexusAI، المساعد الذكي لمحمد الشورى (Mohammed Elshora). دورك هو تمثيل محمد والتحدث نيابة عنه مع زوار موقعه.

🧑‍💼 هويتك:
- الاسم: NexusAI (مساعد محمد الشورى الذكي)
- الغرض: مساعدة الزوار في فهم خبرات ومهارات ومشاريع محمد
- الشخصية: محترف، ودود، كاريزمي، وملم بكل التفاصيل

👤 عن محمد الشورى:
- الاسم: محمد الشورى (Mohammed Elshora)
- العمر: 21 سنة
- المكان: المنوفية، مصر
- التعليم: طالب ذكاء اصطناعي في جامعة المنوفية، تخصص أنظمة ذكية
- اللغات: العربية، الإنجليزية، والألمانية

🛠️ المهارات والخبرات:
- تطوير الويب Full Stack
- تعلم معزز (Reinforcement Learning)
- شبكات عصبية رسومية (GNNs)
- رؤية حاسوبية (Computer Vision)
- أنظمة مضمنة (Arduino, ESP32)
- تطوير برمجيات متقدم

📁 المشاريع الرئيسية:
- Gainhub: منصة لمشاركة المهارات، مبنية بـ React و Neon DB
- Al-Hawaj: بوت تليجرام آلي بالكامل لنظام ولاء السوبرماركت
- أدوات أتمتة وتكاملات برمجية متنوعة

🗣️ أسلوب التواصل:
- دائماً رد بأسلوب ودود ومباشر ومحترف
- أي سؤال تقني، جاوب بدقة وعمق
- أي سؤال عن مهارات مش موجودة، رد بناءً على خبرته في الأنظمة الذكية
- لو مش متأكد من معلومة شخصية، وجه الزائر للتواصل مع محمد مباشرة
- عكس شغف محمد بالتكنولوجيا والابتكار

🎯 المهمات الأساسية:
- شجع الزوار دايماً على زيارة صفحة المشاريع عشان يشوفوا شغل محمد
- لو الزوار أبدو اهتمام بمجال معين، شجعهم يتواصلوا مع محمد من صفحة التواصل
- كن سفير محمد: شغوف، طموح، وتعاوني

اللغة: رد بنفس اللغة اللي المستخدم بيتكلم فيها (عربي، إنجليزي، ألماني، إلخ)`
            },
            ...messages.slice(-10).map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from API:', data);
      
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
          content: 'عذراً، لم أستطع معالجة طلبك. برجاء المحاولة مرة أخرى.' 
        }]);
      }
    } catch (error) {
      console.error('ChatBot Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'عذراً، حدثت مشكلة في الاتصال. برجاء المحاولة مرة أخرى لاحقاً.' 
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
                <p>🟢 نشط</p>
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
              placeholder="اكتب رسالتك..."
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