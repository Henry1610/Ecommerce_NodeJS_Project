import express from 'express';
import {
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../../controllers/admin/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrderStatus);

export default router;
