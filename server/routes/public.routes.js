import express from 'express';
const router = express.Router();
import ShippingZoneRoutes from './public/public.shippingZone.routes.js';
router.use('/shipping-zone', ShippingZoneRoutes)
export default router;