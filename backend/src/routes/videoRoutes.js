import express from 'express';
import {
  uploadVideo,
  getFeed,
  getVideo,
  toggleLike,
  getUserVideos,
  deleteVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/feed', getFeed);
router.get('/:id', getVideo);
router.get('/user/:userId', getUserVideos);

// Protected routes
router.post('/upload', protect, upload.single('video'), uploadVideo);
router.post('/:id/like', protect, toggleLike);
router.delete('/:id', protect, deleteVideo);

export default router;
