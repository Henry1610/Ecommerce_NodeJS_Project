import express from 'express';
import Product from '../../models/Product.js';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../controllers/admin/productController.js';
import { uploadProductImageForCreate, uploadProductImageForUpdate } from '../../config/cloudinary.js';
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', uploadProductImageForCreate().array('images', 5), addProduct);
router.put('/:id', uploadProductImageForUpdate().array('newImages', 5), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
