import Product from "../../models/Product.js";
import Review from '../../models/Review.js'
export const getPublicProducts = async (req, res) => {
    try {
        const {
            // Basic filters
            category,       // Lọc theo category ID
            brand,          // Lọc theo brand ID  
            color,          // Lọc theo màu sắc

            // Price & Stock filters
            minPrice,       // Giá tối thiểu
            maxPrice,       // Giá tối đa
            inStock,        // Có hàng hay không

            // Rating filters
            minRating,      // Rating tối thiểu

            // Discount
            onSale,         // Có giảm giá hay không

            // Pagination & Sort
            page = 1,
            limit = 12,
            sort = 'createdAt',
            search
        } = req.query;

        let query = { statusCurrent: 'active' }; // Chỉ lấy sản phẩm active

        // Tìm kiếm theo tên
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter theo category
        if (category) {
            query.category = Array.isArray(category) ? { $in: category } : category;
        }

        // Filter theo brand
        if (brand) {
            query.brand = Array.isArray(brand) ? { $in: brand } : brand;
        }

        // Filter theo màu
        if (color) {
            query.color = Array.isArray(color) ? { $in: color } : color;
        }

        // Filter theo giá
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter theo stock
        if (inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // Filter theo rating
        if (minRating) {
            query.ratings = { $gte: Number(minRating) };
        }

        // Filter sản phẩm có giảm giá
        if (onSale === 'true') {
            query.discountPercent = { $gt: 0 };
        }

        // Sort options
        let sortOptions = {};
        switch (sort) {
            case 'price_asc': sortOptions.price = 1; break;
            case 'price_desc': sortOptions.price = -1; break;
            case 'name': sortOptions.name = 1; break;
            case 'rating': sortOptions.ratings = -1; break;
            case 'popular': sortOptions.numReviews = -1; break;
            case 'discount': sortOptions.discountPercent = -1; break;
            default: sortOptions.createdAt = -1;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .populate('category', 'name')
            .populate('brand', 'name')
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total,
                count: products.length
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Không lấy được sản phẩm',
            error: err.message
        });
    }
}
export const getPublicProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        const product = await Product.findOne({ 
            slug,
            statusCurrent: 'active' // Thêm điều kiện này để đảm bảo sản phẩm active
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
            .populate('user', 'name avatar') // Chỉ lấy name và avatar
            .sort({ createdAt: -1 }) // Sắp xếp review mới nhất trước
            .exec();
        
        // Trả về đúng format JSON
        res.status(200).json({
            success: true,
            data: {
                product,
                reviews
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Lỗi khi lấy sản phẩm', 
            error: error.message 
        });
    }
};