import express from 'express';
import { getSavedShippingAddresses } from '../../controllers/user/shippingController.js';

const router = express.Router();

router.get('/shipping-addresses', getSavedShippingAddresses);

export default router;
