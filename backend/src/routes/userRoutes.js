import express from 'express';
import { getUserProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:id', getUserProfile);

// Protected routes
router.put('/profile', protect, updateProfile);

export default router;
