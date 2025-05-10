import express from 'express';
import { createReview, getReviewsByProduct, deleteReview, updateReview } from '../../controllers/user/reviewController.js';

const router = express.Router();

router.post('', createReview);

router.get('/:productId', getReviewsByProduct);

router.delete('/:id', deleteReview);

router.put('/:id', updateReview);

export default router;
