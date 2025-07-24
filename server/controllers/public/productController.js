import Product from '../../models/Product.js';
import Review from '../../models/Review.js';
import AdminReviewResponse from '../../models/AdminReviewResponse.js';
import mongoose from 'mongoose';

export const getPublicProducts = async (req, res) => {
    try {
        const {
            category,
            brand,
            color,
            statusCurrent, // vẫn nhận nhưng sẽ override
            minPrice,
            maxPrice,
            minRating,
            name,
            discountPercent,
            random,
            limit,
            page,
            sortBy, 
        } = req.query;

        /* 1. Tạo object filter dựa trên FE gửi */
        const filter = {};

        if (category && mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
        }
        if (brand && mongoose.Types.ObjectId.isValid(brand)) {
            filter.brand = brand;
        }
        if (color) filter.color = color;
        // Luôn chỉ lấy sản phẩm active cho public
        filter.statusCurrent = 'active';

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (minRating) {
            filter.ratings = { $gte: Number(minRating) };
        }

        if (discountPercent) {
            filter.discountPercent = { $gte: Number(discountPercent) };
        }

        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // tìm theo tên (không phân biệt hoa thường)
        }

        /* 2. Xử lý sắp xếp */
        let sort = {};
        if (sortBy) {
            const [field, order] = sortBy.split('_'); // ví dụ: 'price_asc'
            if (field && order) {
                sort[field] = order === 'asc' ? 1 : -1;
            }
        }

        /* 3. Nếu FE muốn random sản phẩm (ví dụ: banner nổi bật) */
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

        /* 4. Phân trang */
        const pageNum = Math.max(parseInt(page) || 1, 1);
        const limitNum = Math.max(parseInt(limit) || 20, 1);
        const skip = (pageNum - 1) * limitNum;

        const [total, products] = await Promise.all([
            Product.countDocuments(filter),
            Product.find(filter)
                .sort(sort)
                .populate('category', 'name')
                .populate('brand', 'name')
                .skip(skip)
                .limit(limitNum)
                .lean()
        ]);

        return res.status(200).json({
            success: true,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

/* ------------------------------------------------------------------ */

export const getPublicProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { rating } = req.query;

        const product = await Product.findOne({
            slug,
        })
            .populate('category', 'name slug')
            .populate('brand', 'name logo slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại hoặc không được phép xem'
            });
        }

        const reviewFilter = { product: product._id };
        if (rating) {
            reviewFilter.rating = Number(rating); 
        }

        const reviews = await Review.find(reviewFilter)
            .populate('user', 'username avatar') 
            .sort({ createdAt: -1 })
            .lean(); // Dùng .lean() để có thể chỉnh sửa object

        // Lấy tất cả admin responses cho các review này
        const reviewIds = reviews.map(review => review._id);
        const adminResponses = await AdminReviewResponse.find({ review: { $in: reviewIds } })
          .populate('admin', 'username email avatar')
          .lean();

        // Tạo map để dễ truy xuất
        const responsesMap = adminResponses.reduce((acc, response) => {
            acc[response.review.toString()] = response;
            return acc;
        }, {});

        // Gắn adminResponse vào từng review
        const reviewsWithAdminResponse = reviews.map(review => ({
            ...review,
            adminResponse: responsesMap[review._id.toString()] || null
        }));

        res.status(200).json({
            success: true,
            data: { product, reviews: reviewsWithAdminResponse }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm',
            error: error.message
        });
    }
};

export const getProductSuggestions = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ success: false, message: 'Thiếu từ khóa tìm kiếm' });
        }

        const suggestions = await Product.find({
            name: { $regex: keyword, $options: 'i' }
        })
            .select('name slug') // Chỉ trả về những gì cần thiết
            .limit(8);           // Giới hạn gợi ý để phản hồi nhanh

        return res.status(200).json({
            success: true,
            suggestions
        });
    } catch (err) {
        console.error('Lỗi suggestion:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};