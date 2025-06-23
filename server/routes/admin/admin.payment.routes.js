import express from 'express';
import {
  approveRefund,
  rejectRefund
} from '../../controllers/admin/paymentController.js';

const router = express.Router();
router.patch('/approve-refund/:id', approveRefund);
router.patch('/reject-refund/:id', rejectRefund);

export default router;
