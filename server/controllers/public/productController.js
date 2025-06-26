import Product from '../../models/Product.js';
import Review from '../../models/Review.js';
import mongoose from 'mongoose';

export const getPublicProducts = async (req, res) => {
    try {
        const {
            category,
            brand,
            color,
            statusCurrent,
            minPrice,
            maxPrice,
            minRating,
            name,
            discountPercent,
            random,
            limit,        // có thể dùng cho random hoặc phân trang
            page          // mới thêm
        } = req.query;

        /* ---------- 1. Xây filter ---------- */
        const filter = {};

        if (category && category !== 'null' && mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
        }
        if (brand && brand !== 'null' && mongoose.Types.ObjectId.isValid(brand)) {
            filter.brand = brand;
        }
        if (color) filter.color = color;
        if (statusCurrent) filter.statusCurrent = statusCurrent;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (minRating) filter.ratings = { $gte: Number(minRating) };
        if (discountPercent) filter.discountPercent = { $gte: Number(discountPercent) };
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        /* ---------- 2. Random sample (giữ nguyên) ---------- */
        if (random === 'true') {
            const sampleLimit = parseInt(limit) || 4;
            const products = await Product.aggregate([
                { $match: filter },
                { $sample: { size: sampleLimit } }
            ]);

            const populated = await Product.populate(products, [
                { path: 'category', select: 'name' },
                { path: 'brand', select: 'name' }
            ]);

            return res.status(200).json({
                success: true,
                count: populated.length,
                products: populated,
            });
        }

        /* ---------- 3. Pagination ---------- */
        const pageNum = Math.max(parseInt(page) || 1, 1);
        const limitNum = Math.max(parseInt(limit) || 20, 1);
        const skip = (pageNum - 1) * limitNum;

        // Song song lấy total và products trang hiện tại
        const [total, products] = await Promise.all([
            Product.countDocuments(filter),
            Product.find(filter)
                .populate('category', 'name')
                .populate('brand', 'name')
                .skip(skip)
                .limit(limitNum)
                .lean()           // nhẹ hơn
        ]);

        res.status(200).json({
            success: true,
            total,                       // tổng số sản phẩm thỏa filter
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/* ------------------------------------------------------------------ */

export const getPublicProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await Product.findOne({
            slug,
            statusCurrent: 'active'
        })
            .populate('category', 'name slug')
            .populate('brand', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại hoặc không được phép xem'
            });
        }

        const reviews = await Review.find({ product: product._id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            data: { product, reviews }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm',
            error: error.message
        });
    }
};
