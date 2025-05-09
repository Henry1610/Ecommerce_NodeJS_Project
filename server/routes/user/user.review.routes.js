const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/user/reviewController');

router.post('',  reviewController.createReview);

router.get('/:productId', reviewController.getReviewsByProduct);

router.delete('/:id',  reviewController.deleteReview);

router.put('/:id',  reviewController.updateReview);

module.exports = router;
