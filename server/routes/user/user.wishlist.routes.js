import express from 'express';
const router = express.Router();

import {getWishlist,addToWishlist,removeFromWishlist} from '../../controllers/user/wishlistController.js';


// Get user's wishlist
router.get('/', getWishlist);

// Add product to wishlist
router.post('/', addToWishlist);

// Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

export default router; 