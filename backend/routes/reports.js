import express from 'express';
import { getReports, createReport, updateReport } from '../controllers/reports.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth)

router.get('/', getReports);
router.post('/', createReport);
router.patch('/:id', updateReport);

export default router;