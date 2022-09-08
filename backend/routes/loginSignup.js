import express from 'express';
import { login, signUp, assistiveSignUp, forgot } from '../controllers/loginSignup.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login); //does not use the auth middleware
router.post('/signUp', signUp);
router.post('/forgot', forgot);

router.use(auth);

router.post('/assistiveSignUp', assistiveSignUp);

export default router;