// Mohammed_Portfolio\frontend\server.js

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Load Environment Variables ======
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====== Middleware ======
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Serve static files from dist (لـ Vercel) ======
app.use(express.static(path.join(__dirname, 'dist')));

// ====== Groq API (ChatBot) ======
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('📩 Received chat request');
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      console.log('❌ Invalid messages format');
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log('🤖 Sending to Groq API...');
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',  // ✅ النموذج الجديد الشغال
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });
    
    console.log('✅ Groq response received');
    res.json(completion);
  } catch (error) {
    console.error('❌ Chat Error Details:', error);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    res.status(500).json({ 
      error: error.message || 'Failed to process chat request' 
    });
  }
});

// ====== Email (Contact Form) ======
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    console.log('📩 Received email request');
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      console.log('❌ Missing fields');
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    console.log(`📧 Sending email from ${name} (${email})`);

    // Email options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4ff, #7b2ffc); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; border: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">📝 Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">${message}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Contact Form Submission
        --------------------------
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });
  } catch (error) {
    console.error('❌ Email Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to send email' 
    });
  }
});

// ====== Health Check ======
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ====== Serve React App (لـ Vercel) ======
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ====== Error Handling Middleware ======
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// ====== Start Server ======
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER}`);
  console.log(`🤖 Groq API: ${process.env.GROQ_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`🔐 Dashboard: ${process.env.VITE_ADMIN_USER ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`🧠 Model: llama-3.3-70b-versatile ✅`);
});