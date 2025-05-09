import Category from '../models/Category'
exports.getCategories = async (req, res) => {
    try {
        const categories = Category.find();
        res.status(200).json(categories)
    } catch (err) {
        res.status(500).json({ message: 'Không tìm thấy danh sách sản phẩm', error: err.message })
    }
}
exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category(
            {
                name,
                description
            }
        )
        const category = newCategory.save();
        res.status(200).json(category)
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi thêm category', error: err.message });

    }
}
exports.getCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id).populate('category brand');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
};
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, {
            name,
            description
        }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category không tồn tại' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
};
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteCategory = await Category.findByIdAndDelete(id);
        if (!deleteCategory) {
            return res.status(404).json({ message: 'Category không tồn tại' });
        }

        res.status(200).json({ message: 'Category đã bị xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa Category', error: error.message });
    }
};             