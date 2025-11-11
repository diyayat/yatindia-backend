import express from 'express';
import { createContact, getContacts } from '../controllers/contactController.js';
import { captchaMiddleware } from '../middleware/captcha.js';

const router = express.Router();

router.route('/').post(captchaMiddleware, createContact).get(getContacts);

export default router;

