import express from 'express';
import { createReview, deleteReview, updateReview, getMyReviews } from '../../controllers/user/reviewController.js';
import { authenticate } from '../../middleware/authenticate.js';
const router = express.Router();

router.post('/', createReview);

router.get('/', getMyReviews);

router.delete('/:id', deleteReview);

router.put('/:id', updateReview);

export default router;
