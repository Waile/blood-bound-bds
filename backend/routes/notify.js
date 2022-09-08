import express from 'express';
import { getNotificationsById, markAsRead, notify } from '../controllers/notify.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.post('/notify', notify);
router.post('/markAsRead', markAsRead);
router.post('/notifsById', getNotificationsById);

export default router;