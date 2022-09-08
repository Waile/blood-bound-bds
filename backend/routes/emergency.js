import express from 'express';
import { getEmergencyPosts, createEmergencyPost, updateEmergencyPost } from '../controllers/emergency.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth)

router.get('/', getEmergencyPosts);
router.post('/', createEmergencyPost);
router.patch('/:id', updateEmergencyPost);

export default router;