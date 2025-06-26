import { getPublicProductBySlug,getPublicProducts } from "../../controllers/public/productController.js";
import express from 'express'
const router=express.Router();

router.get('/filter',getPublicProducts)
router.get('/:slug',getPublicProductBySlug)

export default router