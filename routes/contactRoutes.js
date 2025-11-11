import express from 'express';
import { createContact, getContacts, updateContact, sendContactLeadEmail } from '../controllers/contactController.js';
import { captchaMiddleware } from '../middleware/captcha.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES (for website forms - no authentication required)
// POST /api/contact - Public: Website contact form submission
router.post('/', captchaMiddleware, createContact);

// PROTECTED ROUTES (for admin dashboard only - authentication required)
// GET /api/contact - Protected: Admin dashboard - get all contacts
router.get('/', protect, getContacts);
// PUT /api/contact/:id - Protected: Admin dashboard - update contact
router.put('/:id', protect, updateContact);
// POST /api/contact/:id/send-email - Protected: Admin dashboard - send email about contact
router.post('/:id/send-email', protect, sendContactLeadEmail);

export default router;

