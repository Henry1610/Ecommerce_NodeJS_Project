import express from 'express';
import { getReviewStats  } from '../../controllers/public/reviewController.js';
const router = express.Router();


router.get('/:slug/stats',getReviewStats)

export default router;
