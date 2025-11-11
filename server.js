import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

// Import routes
import contactRoutes from './routes/contactRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  credentials: false, // Must be false when origin is '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'YAT India Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Email configuration diagnostic route (for debugging)
app.get('/api/email/check', (req, res) => {
  const zeptoApiKey = process.env.ZEPTOMAIL_API_KEY;
  const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_BOUNCE_ADDRESS;
  const toEmail = process.env.ZEPTOMAIL_TO_EMAIL;
  const smtpPort = process.env.ZEPTOMAIL_SMTP_PORT || '587';
  
  const config = {
    zeptoApiKey: zeptoApiKey ? `${zeptoApiKey.substring(0, 8)}...` : '❌ NOT SET',
    fromEmail: fromEmail || '⚠️  NOT SET (will use default: no-reply@yatindia.com)',
    toEmail: toEmail || '⚠️  NOT SET (will use default: diya.p.shiju@gmail.com)',
    smtpPort: smtpPort,
    host: 'smtp.zeptomail.com',
    status: zeptoApiKey ? '✅ Configured' : '❌ Missing ZEPTOMAIL_API_KEY',
  };
  
  res.json({
    success: !!zeptoApiKey,
    message: zeptoApiKey 
      ? 'Email configuration looks good!' 
      : 'Email configuration is incomplete. ZEPTOMAIL_API_KEY is required.',
    config: config,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/career', careerRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 4173;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


