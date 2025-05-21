import express from 'express';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../controllers/admin/productController.js';


import upload from '../../middleware/upload.js';
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('images', 10), addProduct);
router.put('/:id', upload.array('images', 10), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
