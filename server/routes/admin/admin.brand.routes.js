import express from 'express';
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../../controllers/admin/brandController.js';
import upload from '../../middleware/upload.js';
const router = express.Router();

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/',upload.single('logo'), createBrand);
router.put('/:id', upload.single('logo'), updateBrand);
router.delete('/:id', deleteBrand);

export default router;
