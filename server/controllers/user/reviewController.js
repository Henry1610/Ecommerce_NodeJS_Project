import Review from '../../models/Review.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import { getPublicIdFromUrl } from '../../utils/getPublicIdFromUrl.js';

export const createReview = async (req, res) => {
    try {
        const { product, rating, comment, orderNumber } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!product || !rating || !comment) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
        }

        // Kiểm tra xem user đã mua sản phẩm và đánh giá sản phẩm chưa 
        const order = await Order.findOne({
            orderNumber,
            user: req.user.id,
            status: 'delivered',
            items: {
                $elemMatch: {
                    product: new mongoose.Types.ObjectId(product),
                    reviewed: false
                }
            }
        });

        // Validate input
        if (!order) {
            return res.status(400).json({ message: 'Bạn chưa mua hoặc đã đánh giá sản phẩm!' });
        }
        // Xử lý ảnh nếu có
        const images = req.files?.map(file => file.path) || [];
        // tìm Id hiện tại của sản phẩm đang đánh giá
        const item = order.items.find(
            i => i.product.toString() === product && i.reviewed === false
        );
        // Tạo review
        const review = await Review.create({
            user: userId,
            product,
            rating,
            comment,
            images,
            orderNumber: order.orderNumber,
        });

        // Cập nhật lại rating trung bình và số lượng đánh giá của product (tuỳ chọn)
        const reviews = await Review.find({ product });
        const avgRating = (
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1);

        await Product.findByIdAndUpdate(product, {
            ratings: avgRating,
            numReviews: reviews.length
        });
        // Cập nhật reviewed: true cho sản phẩm đã đánh giá trong đơn hàng
        order.items = order.items.map(item => {
            if (item.product.toString() === product) {
                item.reviewed = true;
            }
            return item;
        });
        await order.save();

        res.status(201).json({ message: 'Đánh giá thành công', review });
    } catch (error) {
        console.error('Tạo review thất bại:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo review' });
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

export const getReviewByOrderNumberAndProduct = async (req, res) => {
    try {
        const { orderNumber, productId } = req.params;

        const userId = req.user.id;


        // Kiểm tra hợp lệ ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'ID mục đơn hàng không hợp lệ' });
        }

        // Tìm review
        const review = await Review.findOne({
            user: userId,
            orderNumber,
            product: productId
        }).populate('product');

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        res.status(200).json({ review });
    } catch (error) {
        console.error('Lỗi khi tìm đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server khi tìm đánh giá' });
    }
};

export const updateReviewByOrderNumberAndProduct = async (req, res) => {
    const { orderNumber, productId } = req.params;
    const { rating, comment } = req.body;

    const oldImages = Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages].filter(Boolean); // nếu không có thì []

    try {
        const review = await Review.findOne({ orderNumber, product: productId });
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Giữ ảnh cũ
        const keptImages = review.images.filter(img => oldImages.includes(img));

        // Xoá ảnh bị gỡ bỏ
        const deletedImages = review.images.filter(img => !oldImages.includes(img));
        for (const url of deletedImages) {
            const publicId = getPublicIdFromUrl(url);
            await cloudinary.uploader.destroy(publicId);
        }

        // Thêm ảnh mới
        const newUploadedImages = req.files?.map(file => file.path) || [];

        // Cập nhật review
        review.rating = rating;
        review.comment = comment;
        review.images = [...keptImages, ...newUploadedImages];
        await review.save();

        // ✅ Cập nhật lại rating trung bình và số đánh giá của sản phẩm
        const reviews = await Review.find({ product: productId });
        const avgRating = (
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1);

        await Product.findByIdAndUpdate(productId, {
            ratings: Number(avgRating),
            numReviews: reviews.length
        });

        res.json({ message: 'Review updated successfully', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getReviewsByProductSlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Tìm tất cả review theo _id của product
        const reviews = await Review.find({ product: product._id })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (err) {
        console.error('Lỗi khi lấy review theo slug:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy review' });
    }
};