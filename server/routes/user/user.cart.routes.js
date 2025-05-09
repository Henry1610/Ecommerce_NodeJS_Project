const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/user/cartController');

router.get('/', cartController.getCart);
router.put('/add',cartController.addToCart);
router.put('/update',cartController.updateQuantity);
router.delete('/remove/:productId',cartController.removeFromCart);

module.exports = router;
