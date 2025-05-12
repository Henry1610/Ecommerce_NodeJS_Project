import express from 'express';
import { createReview, getReviewsByProduct, deleteReview, updateReview } from '../../controllers/user/reviewController.js';
import { authenticate } from '../../middleware/authenticate.js';
const router = express.Router();

router.post('', createReview);

router.get('/:productId',authenticate, getReviewsByProduct);

router.delete('/:id',authenticate, deleteReview);

router.put('/:id',authenticate, updateReview);

export default router;
