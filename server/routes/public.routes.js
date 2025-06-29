import express from 'express';
const router = express.Router();
import ShippingZoneRoutes from './public/public.shippingZone.routes.js';
import ProductRoutes from './public/public.product.routes.js';
import DiscountRoutes from './public/public.discount.routes.js';
import BrandRoutes from './public/public.brand.routes.js';
import CategoryRoutes from './public/public.category.routes.js';
import ReviewRoutes from './public/public.review.routes.js'
router.use('/shipping-zones', ShippingZoneRoutes)
router.use('/products', ProductRoutes)
router.use('/discounts', DiscountRoutes)
router.use('/brands', BrandRoutes)
router.use('/categories', CategoryRoutes)
router.use('/reviews', ReviewRoutes)
export default router;