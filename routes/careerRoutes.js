import express from 'express';
import { createCareer, getCareers } from '../controllers/careerController.js';
import upload from '../middleware/upload.js';
import { captchaMiddleware } from '../middleware/captcha.js';

const router = express.Router();

router.route('/')
  .post(upload.single('resume'), captchaMiddleware, createCareer)
  .get(getCareers);

export default router;

