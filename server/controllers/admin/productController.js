import Product from '../models/Product'
import Review from '../models/Review'
exports.getProducts = async (req, res) => {
    try {
        const products = Product.find().populate('category brand');
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ message: 'Không tìm thấy danh sách sản phẩm', error: err.message })
    }
}
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('category') 
            .populate('brand')     
            .exec();

        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }
        const reviews = await Review.find({ product: productId })
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
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, brand, images } = req.body;
        const newProduct = new Product(
            {
                name,
                description,
                price,
                stock,
                category,
                brand,
                images,
            }
        )
        const product = await newProduct.save();
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: err.message });

    }
}
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category, brand, images } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name,
            description,
            price,
            stock,
            category,
            brand,
            images,
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
exports.deleteProduct = async (req, res) => {
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