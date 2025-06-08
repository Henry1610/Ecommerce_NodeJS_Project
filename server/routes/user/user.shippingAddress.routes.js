import express from 'express';
import { createShippingAddress, getSavedShippingAddresses,updateShippingAddress ,getShippingAddressById,getDefaultShippingAddress} from '../../controllers/user/shippingAddressController.js';

const router = express.Router();

router.get('/', getSavedShippingAddresses);
router.post('/', createShippingAddress);
router.get('/default', getDefaultShippingAddress);
router.patch('/:id', updateShippingAddress);
router.get('/:id', getShippingAddressById);

export default router;
