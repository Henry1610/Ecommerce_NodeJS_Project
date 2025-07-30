import Product from '../../models/Product.js'
import Review from '../../models/Review.js'
import { getPublicIdFromUrl } from '../../utils/getPublicIdFromUrl.js';
import { v2 as cloudinary } from 'cloudinary';
import { deleteCloudinaryFolder } from '../../utils/deleteCloudinaryFolder.js';
export const getProducts = async (req, res) => {

    try {
        const products = await Product.find().populate('category brand');
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ message: 'Không tìm thấy danh sách sản phẩm', error: err.message })
    }
}
export const getProductById = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('category')
            .populate('brand')
            .exec();

        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }
        const reviews = await Review.find({ product: product._id })
            .populate('user')
            .exec();
        res.status(200).json({
            success: true,
            data: {
                product,
                reviews
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category, brand, discountPercent, statusCurrent, color, attributes } = req.body;

        // Kiểm tra trùng tên sản phẩm
        const existing = await Product.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại.' });
        }

        let processedAttributes = {};
        if (attributes) {
            try {
                if (typeof attributes === 'string') {
                    processedAttributes = JSON.parse(attributes);
                } else {
                    processedAttributes = attributes;
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid attributes format'
                });
            }
        }

        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Vui lòng upload ít nhất 1 ảnh.' });
        }

        const imagesPaths = files.map(file => file.path);
        
        const newProduct = new Product({
            name: name.trim(),
            description,
            price,
            stock: Number(stock),
            category,
            brand,
            color,
            discountPercent: Number(discountPercent),
            statusCurrent,
            images: imagesPaths,
            attributes: processedAttributes
        });

        const product = await newProduct.save();
        // req.product = product;
        // next();
        res.status(201).json({
            success: true,
            message: 'Thêm sản phẩm thành công',
            product
          });
    } catch (error) {
        console.error('[ADD PRODUCT ERROR]', error); // Ghi log ra terminal
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
    }
};


export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            stock,
            category,
            brand,
            statusCurrent,
            discountPercent,
            color,
            attributes
        } = req.body;

        // Kiểm tra trùng tên với sản phẩm khác
        const existing = await Product.findOne({ name: name.trim(), _id: { $ne: id } });
        if (existing) {
            return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại.' });
        }

        // Xử lý attributes (có thể là stringified JSON hoặc object)
        let processedAttributes = {};
        if (attributes) {
            try {
                processedAttributes = typeof attributes === 'string'
                    ? JSON.parse(attributes)
                    : attributes;
            } catch (err) {
                return res.status(400).json({ message: 'Invalid attributes format' });
            }
        }

        // Lấy oldImages (từ client gửi lên)
        const oldImages = Array.isArray(req.body.oldImages)
            ? req.body.oldImages
            : [req.body.oldImages].filter(Boolean);


        // Tìm product để cập nhật
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Lọc ảnh giữ lại
        const keptImages = product.images.filter(img => oldImages.includes(img));

        // Xoá ảnh đã bị gỡ khỏi Cloudinary
        const deletedImages = product.images.filter(img => !oldImages.includes(img));
        for (const url of deletedImages) {
            const publicId = getPublicIdFromUrl(url);
            if (publicId) await cloudinary.uploader.destroy(publicId);
        }

        // Ảnh mới (upload)
        const newImages = req.files?.map(file => file.path) || [];

        await Product.findByIdAndUpdate(id, {
            name: name.trim(),
            description,
            price,
            stock,
            category,
            brand,
            color,
            statusCurrent,
            discountPercent,
            attributes: processedAttributes,
            images: [...keptImages, ...newImages],
        });


        res.status(200).json({
            message: 'Product updated successfully',
            product,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        await deleteCloudinaryFolder(`products/${deletedProduct.slug}`);
       
        
        res.status(200).json({
            message: 'Sản phẩm đã bị xóa thành công',
            id: deletedProduct._id,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
};             