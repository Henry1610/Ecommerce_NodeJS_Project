import express from 'express';
import {
  setCart,addToCart,getCart
} from '../../controllers/user/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/set',setCart)

export default router;
