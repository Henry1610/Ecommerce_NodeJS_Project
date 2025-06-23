import express from 'express';
import { createCheckoutSession,requestRefund } from '../../controllers/user/paymentController.js';
const router = express.Router();

router.post('/checkout-session', createCheckoutSession);
router.post('/refund/:orderNumber', requestRefund);

export default router;
