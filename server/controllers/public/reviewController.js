import Review from "../../models/Review.js";

export const getPublicReviewsProductBySlug = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.slug })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error });
    }
};
