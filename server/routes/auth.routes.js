import express from 'express';
import { login, sendRegisterOTP, verifyOTPAndRegister, forgotPassword, resetPassword, refreshToken, logout,facebookCallback,getSessionAuth } from '../controllers/authController.js';
import passport from "passport";

const router = express.Router();

router.get("/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
router.get("/facebook/callback", facebookCallback);
router.get("/session-auth", getSessionAuth);
router.post('/login', login);
router.post('/send-otp', sendRegisterOTP);
router.post('/register', verifyOTPAndRegister);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
