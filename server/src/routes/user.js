import express from 'express';
import { getUserStatus, upsertUser, saveFormData } from '../controllers/userController.js';

const router = express.Router();

// Temporarily disable auth for speed
router.get('/:userId/status', getUserStatus);
router.post('/upsert', upsertUser);
router.post('/submit', saveFormData);

export default router;
