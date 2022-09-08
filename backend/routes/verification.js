import express from 'express';
import { verifyCode, resendCode } from '../controllers/verification.js';

const router = express.Router();

router.post('/verifyCode/:id', verifyCode);
router.post('/resendCode/:id', resendCode);

export default router;