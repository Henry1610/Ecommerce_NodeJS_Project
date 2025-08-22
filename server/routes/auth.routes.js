import express from 'express';
import { login, sendRegisterOTP, verifyOTPAndRegister, forgotPassword, resetPassword, refreshToken, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/send-otp', sendRegisterOTP);
router.post('/register', verifyOTPAndRegister);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
