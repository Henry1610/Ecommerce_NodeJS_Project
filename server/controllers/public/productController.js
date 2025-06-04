import Product from "../../models/Product.js";
export const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).populate('category brand');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Không lấy được sản phẩm', error: err.message });
    }
}
export const getPublicProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, isActive: true })
            .populate('category')
            .populate('brand');
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại hoặc không được phép xem' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
    }
};