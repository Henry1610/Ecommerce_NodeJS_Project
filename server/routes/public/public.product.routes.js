import { getPublicProductBySlug,getPublicProducts,getProductSuggestions } from "../../controllers/public/productController.js";
import express from 'express'
const router=express.Router();

router.get('/filter', getPublicProducts);
router.get('/suggestions', getProductSuggestions); // moved up
router.get('/:slug', getPublicProductBySlug); // put at the bottom


export default router