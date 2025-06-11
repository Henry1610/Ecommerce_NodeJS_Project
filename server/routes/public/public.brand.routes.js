import { getPublicBrandBySlug,getPublicBrands } from "../../controllers/public/brandController.js";
import express from 'express'
const router=express.Router();

router.get('/',getPublicBrands)
router.get('/:slug',getPublicBrandBySlug)

export default router