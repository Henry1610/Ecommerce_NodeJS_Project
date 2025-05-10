import express from 'express';
import { checkDiscountCode } from '../../controllers/user/discountController.js';

const router = express.Router();

router.get('/check', checkDiscountCode);

export default router;
