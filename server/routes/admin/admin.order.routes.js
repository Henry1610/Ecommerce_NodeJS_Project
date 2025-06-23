import express from 'express';
import {
  getOrders,
  getOrderByOrderNumber,
  updateOrderStatus,
  getRefundRequests
} from '../../controllers/admin/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/refund-requests', getRefundRequests);
router.get('/:orderNumber', getOrderByOrderNumber);
router.put('/:orderNumber', updateOrderStatus);

export default router;
