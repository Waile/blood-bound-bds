import express from 'express';
import { getNearbyDonors, getNearbyRequests } from '../controllers/maps.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.post('/donors', getNearbyDonors);
router.post('/requests', getNearbyRequests);

export default router;