import express from 'express';
import { createCheckoutSession,stripeWebhook } from '../../controllers/user/paymentController.js';
const router = express.Router();

// Route để tạo Payment Intent
router.post('/checkout-session', createCheckoutSession);
// router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);




export default router;
