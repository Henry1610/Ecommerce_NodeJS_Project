import express from 'express';
import { createReview, deleteReview, updateReview, getMyReviews } from '../../controllers/user/reviewController.js';
import { authenticate } from '../../middleware/authenticate.js';
const router = express.Router();

router.post('/', createReview);

router.get('/',authenticate, getMyReviews);

router.delete('/:id',authenticate, deleteReview);

router.put('/:id',authenticate, updateReview);

export default router;
