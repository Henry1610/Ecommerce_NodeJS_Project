import Review from '../../models/Review.js';
import Product from '../../models/Product.js';

export const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const alreadyReview = await Review.findOne({
            user: req.user._id,
            product,
        });
        if (alreadyReview) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi!' });
        }

        const review = new Review({
            user: req.user._id,  // sửa lại đây
            product,
            rating,
            comment,
        });
        await review.save();

        // Cập nhật đánh giá trung bình cho sản phẩm
        const reviews = await Review.find({ product: review.product });
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;
        await Product.findByIdAndUpdate(product, {
            ratings: avgRating,
            numReviews: reviews.length,
        });

        res.status(201).json({ message: 'Đánh giá thành công', review });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo đánh giá', error });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error });
    }
};

// [DELETE] Người dùng xóa review của họ
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy review để xóa' });
        }

        await review.remove();

        // Cập nhật lại điểm trung bình cho sản phẩm
        const reviews = await Review.find({ product: review.product });
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        await Product.findByIdAndUpdate(review.product, {
            ratings: avgRating,
            numReviews: reviews.length,
        });

        res.json({ message: 'Xóa đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đánh giá', error });
    }
};
// [PUT] Người dùng sửa đánh giá của họ
export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá để sửa' });
        }

        // Cập nhật đánh giá
        review.rating = rating;
        review.comment = comment;
        await review.save();

        // Cập nhật lại điểm trung bình cho sản phẩm
        const reviews = await Review.find({ product: review.product });
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        await Product.findByIdAndUpdate(review.product, {
            ratings: avgRating,
            numReviews: reviews.length,
        });

        res.json({ message: 'Sửa đánh giá thành công', review });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi sửa đánh giá', error });
    }
};
