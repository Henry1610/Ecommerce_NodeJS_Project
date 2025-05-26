import Product from '../../models/Product.js'
import Review from '../../models/Review.js'
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
        console.log("productId:", id);

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
            product,
            reviews
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, brand, discountPercent, statusCurrent, color, attributes } = req.body;

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

        const imagesPaths = files.map(file => file.filename);

        const newProduct = new Product({
            name,
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
        res.status(200).json(product);

    } catch (error) {
        console.error('[ADD PRODUCT ERROR]', error); // Ghi log ra terminal
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        let { attributes } = req.body
        const { name, description, price, stock, category, brand, statusCurrent, discountPercent, color } = req.body;
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
        const newImagesFiles = req.files;
        const oldImagesJson = req.body.oldImages;

        const oldImages = oldImagesJson ? JSON.parse(oldImagesJson) : [];//nếu mà  có content ở  header thì nó tự chuyển thành object trường hợp này gửi file nên k dùng nên phải thêm bước này
        const newImagesNames = newImagesFiles ? newImagesFiles.map(f => f.filename) : [];

        const newImg = [...oldImages, ...newImagesNames];

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name,
            stock,
            discountPercent,
            statusCurrent,
            description,
            price,
            category,
            brand,
            color,
            attributes:processedAttributes,
            images: newImg,

        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({
            message: 'Brand updated successfully',
            product: updatedProduct
        }
        );
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ message: 'Sản phẩm đã bị xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
};             