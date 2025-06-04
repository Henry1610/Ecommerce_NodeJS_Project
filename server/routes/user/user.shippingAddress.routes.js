import express from 'express';
import { createShippingAddress, getSavedShippingAddresses,updateShippingAddress } from '../../controllers/user/shippingAddressController.js';

const router = express.Router();

router.get('/', getSavedShippingAddresses);
router.post('/', createShippingAddress);
router.patch('/:id', updateShippingAddress);

export default router;
