import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

// import paymentRoutes from './admin/admin.payment.routes.js';
import categoryRoutes from './admin/admin.category.routes.js';
import brandRoutes from './admin/admin.brand.routes.js';
import productRoutes from './admin/admin.product.routes.js';
import orderRoutes from './admin/admin.order.routes.js';
import userRoutes from './admin/admin.user.routes.js';
import discountRoutes from './admin/admin.discount.routes.js';
import ShippingZoneRoutes from './admin/admin.shippingZone.routes.js';
import paymentRoutes from './admin/admin.payment.routes.js';
import adminRoutes from './admin/admin.admin.routes.js'
import reviewRoutes from './admin/admin.review.routes.js';
const router = express.Router();

// Các route cho admin
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
});

router.use('/brands', brandRoutes);
router.use('/shipping-zones', ShippingZoneRoutes);
router.use('/categories', categoryRoutes);
router.use('/discounts', discountRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/', adminRoutes);

export default router;



