import express from 'express';
import { createCareer, getCareers, updateCareer, sendCareerLeadEmail } from '../controllers/careerController.js';
import upload from '../middleware/upload.js';
import { captchaMiddleware } from '../middleware/captcha.js';
import { protect } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// PUBLIC ROUTES (for website forms - no authentication required)
// POST /api/career - Public: Website career form submission
router.post('/', upload.single('resume'), captchaMiddleware, createCareer);

// PROTECTED ROUTES (for admin dashboard only - authentication required)
// GET /api/career - Protected: Admin dashboard - get all careers
router.get('/', protect, getCareers);
// GET /api/career/resume/:filename - Protected: Admin dashboard - serve resume files (must come before /:id)
router.get('/resume/:filename', protect, (req, res) => {
  try {
    const { filename } = req.params;
    const resumePath = path.join(__dirname, '..', 'resumes', filename);
    
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found',
      });
    }
    
    res.sendFile(resumePath);
  } catch (error) {
    console.error('Error serving resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving resume file',
    });
  }
});
// PUT /api/career/:id - Protected: Admin dashboard - update career
router.put('/:id', protect, updateCareer);
// POST /api/career/:id/send-email - Protected: Admin dashboard - send email about career
router.post('/:id/send-email', protect, sendCareerLeadEmail);

export default router;

