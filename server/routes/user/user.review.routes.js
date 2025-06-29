import express from 'express';
import { createReview, getReviewByOrderNumberAndProduct, updateReviewByOrderNumberAndProduct, getMyReviews,getReviewsByProductSlug } from '../../controllers/user/reviewController.js';
import { reviewImageUploader } from '../../config/cloudinary.js';
import Product from '../../models/Product.js';
const router = express.Router();

router.post('/:slug', (req, res, next) => {
    const slug = req.params.slug;
    const userId = req.user.id;
    
    // Gọi uploader động theo slug và userId
    const uploader = reviewImageUploader(slug, userId);
    
    // Gọi uploader như middleware
    uploader.array('images', 3)(req, res, next);
}, createReview);

router.get('/', getMyReviews);
router.get('/:slug', getReviewsByProductSlug);

router.get('/:orderNumber/:productId', getReviewByOrderNumberAndProduct);

router.patch('/:orderNumber/:productId',
    async (req, res, next) => {
      try {
        // Lấy slug từ productId
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
  
        const slug = product.slug;
        const userId = req.user._id;
  
        const uploader = reviewImageUploader(slug, userId);
        uploader.array('images', 3)(req, res, next);
      } catch (err) {
        console.error('Uploader middleware error:', err.message);
        res.status(500).json({ message: 'Error in uploader middleware' });
      }
    },
    updateReviewByOrderNumberAndProduct
  );

export default router;
