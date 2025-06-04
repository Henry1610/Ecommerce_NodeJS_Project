import { getPublicShippingZones } from "../../controllers/public/shippingZoneController.js";
import express from 'express'
const router=express.Router();

router.get('/',getPublicShippingZones)

export default router