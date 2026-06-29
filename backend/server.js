import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ التحقق من المتغيرات
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
console.log('🤖 GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');

// ✅ إعداد Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ التحقق من الاتصال
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail Connection Error:', error);
  } else {
    console.log('✅ Gmail Connected Successfully!');
  }
});

// ✅ API Route لإرسال الإيميل
app.post('/api/contact', async (req, res) => {
  console.log('📨 Received request:', req.body);
  
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    console.log('❌ Missing fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">📧 New Message from Portfolio</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>📝 Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
              <p><strong>💬 Message:</strong></p>
              <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('❌ Email Error:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

// ✅ ====== Proxy Route for Groq ChatBot API ======
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  console.log('🤖 Chat request received:', messages);

  // ✅ خد الـ API Key من الـ environment variables
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is missing in .env file');
    return res.status(500).json({ error: 'API Key configuration error' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    console.log('🤖 Groq Response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({ error: 'Failed to connect to Groq API' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});