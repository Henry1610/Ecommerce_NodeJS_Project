import express from 'express';
import { createPaymentIntent,confirmPayment,getPublicKey } from '../../controllers/user/paymentController.js';
const router = express.Router();

// Route để tạo Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

// Route để xác nhận thanh toán
router.post('/confirm-payment', confirmPayment);

// Route để lấy Stripe public key
router.get('/public-key', getPublicKey);


export default router;
