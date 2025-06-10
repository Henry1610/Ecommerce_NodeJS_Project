import { getPublicCategories,getPublicCategoryById } from "../../controllers/public/categoryController.js";
import express from 'express'
const router=express.Router();

router.get('/',getPublicCategories)
// router.get('/:slug',getPublicCategoryById)

export default router