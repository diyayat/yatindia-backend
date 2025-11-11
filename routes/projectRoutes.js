import express from 'express';
import { createProject, getProjects, updateProject, sendProjectLeadEmail } from '../controllers/projectController.js';
import { captchaMiddleware } from '../middleware/captcha.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES (for website forms - no authentication required)
// POST /api/project - Public: Website project form submission
router.post('/', captchaMiddleware, createProject);

// PROTECTED ROUTES (for admin dashboard only - authentication required)
// GET /api/project - Protected: Admin dashboard - get all projects
router.get('/', protect, getProjects);
// PUT /api/project/:id - Protected: Admin dashboard - update project
router.put('/:id', protect, updateProject);
// POST /api/project/:id/send-email - Protected: Admin dashboard - send email about project
router.post('/:id/send-email', protect, sendProjectLeadEmail);

export default router;

