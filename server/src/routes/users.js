import express from 'express';
import { saveFormData } from '../controllers/userController.js';

const router = express.Router();

router.post('/submit', saveFormData);

export default router;

