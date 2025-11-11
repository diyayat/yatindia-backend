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
app.get('/api/email/check', async (req, res) => {
  const zeptoApiKey = process.env.ZEPTOMAIL_API_KEY;
  const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_BOUNCE_ADDRESS;
  const toEmail = process.env.ZEPTOMAIL_TO_EMAIL;
  
  const config = {
    zeptoApiKey: zeptoApiKey ? `${zeptoApiKey.substring(0, 8)}...` : '❌ NOT SET',
    fromEmail: fromEmail || '⚠️  NOT SET (will use default: no-reply@yatindia.com)',
    toEmail: toEmail || '⚠️  NOT SET (will use default: diya.p.shiju@gmail.com)',
    apiUrl: 'https://api.zeptomail.com/v1.1/email',
    method: 'REST API',
    status: zeptoApiKey ? '✅ Configured' : '❌ Missing ZEPTOMAIL_API_KEY',
  };

  // Test REST API connection if API key is set
  let connectionTest = null;
  if (zeptoApiKey) {
    try {
      const axios = (await import('axios')).default;
      const testResponse = await axios.post(
        'https://api.zeptomail.com/v1.1/email',
        {
          bounce_address: fromEmail || 'no-reply@yatindia.com',
          from: {
            address: fromEmail || 'no-reply@yatindia.com',
            name: 'YAT India Test',
          },
          to: [
            {
              email_address: {
                address: toEmail || 'diya.p.shiju@gmail.com',
              },
            },
          ],
          subject: 'Test Email - Configuration Check',
          htmlbody: '<p>This is a test email to verify ZeptoMail REST API configuration.</p>',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Zoho-enczapikey ${zeptoApiKey}`,
          },
        }
      );

      connectionTest = {
        success: true,
        message: '✅ ZeptoMail REST API connection successful',
      };
    } catch (error) {
      if (error.response) {
        connectionTest = {
          success: false,
          message: `❌ ZeptoMail API error: ${error.response.status} ${error.response.statusText}`,
          errorDetails: error.response.data,
          suggestion: 'Check your API key and verify it in ZeptoMail dashboard',
        };
      } else {
        connectionTest = {
          success: false,
          message: `❌ Connection test failed: ${error.message}`,
          errorCode: error.code,
          suggestion: 'Check your network connection and API endpoint accessibility',
        };
      }
    }
  }
  
  res.json({
    success: !!zeptoApiKey && (!connectionTest || connectionTest.success),
    message: zeptoApiKey 
      ? (connectionTest?.success ? 'Email configuration looks good!' : connectionTest?.message)
      : 'Email configuration is incomplete. ZEPTOMAIL_API_KEY is required.',
    config: config,
    connectionTest: connectionTest,
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


