import express from 'express';
import {getMyOrders,getOrderByOrderNumber  } from '../../controllers/user/orderController.js';
const router = express.Router();

router.get('/', getMyOrders);
router.get('/:orderNumber',getOrderByOrderNumber);

export default router;
