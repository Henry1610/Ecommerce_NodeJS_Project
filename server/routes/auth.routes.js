import express from 'express';
import { login, sendRegisterOTP, verifyOTPAndRegister, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/send-otp', sendRegisterOTP);
router.post('/register', verifyOTPAndRegister);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
