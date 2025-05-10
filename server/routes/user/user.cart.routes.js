import express from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart
} from '../../controllers/user/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.put('/add', addToCart);
router.put('/update', updateQuantity);
router.delete('/remove/:productId', removeFromCart);

export default router;
