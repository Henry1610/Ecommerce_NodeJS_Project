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

const router = express.Router();

// Các route cho admin
router.get('/dashboard', authenticate, authorize(['admin']), (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
});
router.use('/brands', authenticate, authorize(['admin']), brandRoutes);
router.use('/shippingzones', authenticate, authorize(['admin']), ShippingZoneRoutes);

router.use('/categories', authenticate, authorize(['admin']), categoryRoutes);
router.use('/discounts', authenticate, authorize(['admin']), discountRoutes);
router.use('/orders', authenticate, authorize(['admin']), orderRoutes);
// router.use('/payments', authenticate, authorize(['admin']), paymentRoutes);
router.use('/products', authenticate, authorize(['admin']), productRoutes);
router.use('/users', authenticate, authorize(['admin']), userRoutes);

export default router;



