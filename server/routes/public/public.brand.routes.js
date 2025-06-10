import { getPublicBrands } from "../../controllers/public/brandController.js";
import express from 'express'
const router=express.Router();

router.get('/',getPublicBrands)
// router.get('/:slug',getPublicCategoryById)

export default router