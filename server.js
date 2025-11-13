import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';


// Import routes
import contactRoutes from './routes/contactRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import {SendMailClient} from 'zeptomail';

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
  const zeptoMailClient = new SendMailClient({
  url: "api.zeptomail.com/",
  token: process.env.ZEPTOMAIL_API_KEY,
});
  
  // Test REST API connection if API key is set
  
  
     try {
    const success = await zeptoMailClient.sendMail({
      from: {
        address: "noreply@yatindia.com",
        name: "Yat India",
      },
      to: [
        {
          email_address: {
            address: "info@yatindia.com",
          },
        },
      ],
      subject: "Verify Your Account",
      htmlbody: "<p> This is successful </p>",
    });
    console.log("success value is ", success)
    console.log("Acknowledgment email sent successfully");
  } catch (error) {
    console.error("Error sending acknowledgment email via ZeptoMail:", error);
    throw new Error("Failed to send email");
  }

  

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


