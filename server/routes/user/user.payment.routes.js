import express from 'express';
import { createCheckoutSession } from '../../controllers/user/paymentController.js';
const router = express.Router();

router.post('/checkout-session', createCheckoutSession);

export default router;
