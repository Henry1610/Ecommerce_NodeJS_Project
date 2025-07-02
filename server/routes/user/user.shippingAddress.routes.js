import express from 'express';
import { deleteShippingAddress,createShippingAddress, getSavedShippingAddresses,updateShippingAddress ,getShippingAddressById,getDefaultShippingAddress, setDefaultShippingAddress} from '../../controllers/user/shippingAddressController.js';

const router = express.Router();

router.get('/', getSavedShippingAddresses);
router.post('/', createShippingAddress);
router.get('/default', getDefaultShippingAddress);
router.patch('/:addressId', updateShippingAddress);
router.put('/:addressId/default', setDefaultShippingAddress);
router.get('/:id', getShippingAddressById);
router.delete('/:addressId', deleteShippingAddress);

export default router;
