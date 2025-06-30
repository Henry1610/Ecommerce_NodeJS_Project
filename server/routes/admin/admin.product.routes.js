import express from 'express';
import Product from '../../models/Product.js';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../controllers/admin/productController.js';
import {moveFilesToSlugFolderForCreate} from '../../middleware/moveFilesToSlugFolderForCreate.js';
import {productImageUploader, productImageUploaderTemp } from '../../config/cloudinary.js';
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/',  (req, res, next) => {
  try {
    const uploader = productImageUploaderTemp();
    uploader.array('images', 10)(req, res, next);
  } catch (err) {
    console.error('Uploader middleware error:', err.message);
    res.status(500).json({ message: 'Error in uploader middleware' });
  }
}, addProduct, moveFilesToSlugFolderForCreate);

router.put('/:id',
  async (req, res, next) => {
    try {
      // Lấy slug từ productId
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const slug = product.slug;

      const uploader = productImageUploader(slug);
      uploader.array('newImages', 10)(req, res, next);
    } catch (err) {
      console.error('Uploader middleware error:', err.message);
      res.status(500).json({ message: 'Error in uploader middleware' });
    }
  }, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
