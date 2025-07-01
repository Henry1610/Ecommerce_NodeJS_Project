import express from 'express';
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../../controllers/admin/brandController.js';
import {  uploadBrandImageForCreate, uploadBrandImageWithSlug } from '../../config/cloudinary.js';
const router = express.Router();

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/',uploadBrandImageForCreate().single('logo'), createBrand);
router.put('/:id',uploadBrandImageWithSlug().single('logo'), updateBrand);
router.delete('/:id', deleteBrand);

export default router;
