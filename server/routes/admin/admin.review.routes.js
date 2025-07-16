import express from 'express';
import { 
    getAllReviews, 
    createAdminReviewResponse, 
    updateAdminReviewResponse, 
    getAdminReviewResponseByReviewId 
} from '../../controllers/admin/reviewController.js';


const router = express.Router();

router.get('/', getAllReviews);
router.post('/response',createAdminReviewResponse);
router.put('/response/:responseId', updateAdminReviewResponse);
router.get('/:reviewId/response', getAdminReviewResponseByReviewId);

export default router; 