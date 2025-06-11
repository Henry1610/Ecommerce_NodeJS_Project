import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/authenticate.js';

// const paymentRoutes = require('../routes/user/user.payment.routes')
import cartRoutes from '../routes/user/user.cart.routes.js';
// import discountRoutes from '../routes/user/user.discount.routes.js';
// const orderRoutes = require('../routes/user/user.order.routes')
import userRoutes from '../routes/user/user.user.routes.js';
import shippingAddressRoutes from './user/user.shippingAddress.routes.js';
import reviewRoutes from '../routes/user/user.review.routes.js';
import paymentRoutes from '../routes/user/user.payment.routes.js'
// Các route cho user
router.get('/', (req, res) => {
    res.json({ user: req.user });
});

router.use('/cart', authenticate, cartRoutes);
router.use('/users', authenticate, userRoutes);
// router.use('/orders', authenticate, orderRoutes);
router.use('/payments', authenticate, paymentRoutes);
router.use('/shipping-addresses', authenticate, shippingAddressRoutes);
router.use('/reviews', reviewRoutes);

export default router;