import express from 'express';
import {
  setCart,addToCart,getCart,removeDiscountFromCart,applyDiscountToCart
} from '../../controllers/user/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/set',setCart)
router.post('/remove-discount', removeDiscountFromCart);
router.post('/apply-discount', applyDiscountToCart);

export default router;
