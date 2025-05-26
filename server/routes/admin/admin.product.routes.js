import express from 'express';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../controllers/admin/productController.js';
import { generateSlugFromName } from '../../middleware/generateSlugFromName.js';
import  moveFilesToSlugFolder  from '../../middleware/moveFilesToSlugFolder.js';
import upload from '../../middleware/upload.js';
import moveFilesToSlugFolderForCreate from '../../middleware/moveFilesToSlugFolderForCreate.js';
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('images', 10), addProduct,moveFilesToSlugFolderForCreate);
router.put('/:id', upload.array('newImages', 10), updateProduct,moveFilesToSlugFolder);
router.delete('/:id', deleteProduct);

export default router;
