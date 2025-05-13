import express from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  // initCart
} from '../../controllers/user/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateQuantity);
router.delete('/remove/:productId', removeFromCart);
// router.post('/init', initCart);

export default router;
