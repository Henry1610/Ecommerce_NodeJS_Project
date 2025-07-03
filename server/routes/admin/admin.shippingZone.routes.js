// routes/shippingZoneRoutes.js
import express from 'express';
import {
  getShippingZones,
  getShippingZoneById,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
  calculateShippingFeeForCity,
  getAvailableCities,
} from '../../controllers/admin/shippingZoneController.js';

const router = express.Router();

router.get('/', getShippingZones);
router.get('/available-cities', getAvailableCities);
router.get('/calculate-fee/:cityName', calculateShippingFeeForCity);
router.get('/:id', getShippingZoneById);
router.post('/', createShippingZone);
router.put('/:id', updateShippingZone);
router.delete('/:id', deleteShippingZone);

export default router;
