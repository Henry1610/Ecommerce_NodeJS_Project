import express from 'express';
const router = express.Router();

import cartRoutes from '../routes/user/user.cart.routes.js';
import orderRoutes from '../routes/user/user.order.routes.js'
import userRoutes from '../routes/user/user.user.routes.js';
import shippingAddressRoutes from './user/user.shippingAddress.routes.js';
import reviewRoutes from '../routes/user/user.review.routes.js';
import paymentRoutes from '../routes/user/user.payment.routes.js'
import wishlistRoutes from './user/user.wishlist.routes.js';
// Các route cho user
router.get('/', (req, res) => {
    res.json({ user: req.user });
});

router.use('/cart', cartRoutes);
router.use('/', userRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/shipping-addresses', shippingAddressRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;