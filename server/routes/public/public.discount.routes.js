import { getPublicDiscounts } from "../../controllers/public/discountController.js";
import express from 'express'
const router=express.Router();

router.get('/',getPublicDiscounts)

export default router