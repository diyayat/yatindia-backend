import express from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import { captchaMiddleware } from '../middleware/captcha.js';

const router = express.Router();

router.route('/').post(captchaMiddleware, createProject).get(getProjects);

export default router;

