import Category from '../../models/Category.js'
import Product  from '../../models/Product.js'
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().lean(); 

        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({
            message: 'Không tìm thấy danh sách sản phẩm',
            error: err.message,
        });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Kiểm tra trùng tên
        const existing = await Category.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ message: 'Tên danh mục đã tồn tại.' });
        }

        const newCategory = new Category({
            name: name.trim(),
            description
        });
        const category = await newCategory.save();
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi thêm category', error: err.message });
    }
}
export const getCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
};
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Kiểm tra trùng tên với category khác
        const existing = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
        if (existing) {
            return res.status(400).json({ message: 'Tên danh mục đã tồn tại.' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: name.trim(), description },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category không tồn tại' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
};
export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Kiểm tra xem có sản phẩm nào đang dùng category này không
      const isLinked = await Product.exists({ category: id });
  
      if (isLinked) {
        return res.status(400).json({
          message: 'Không thể xóa. Danh mục này đang được sử dụng bởi một hoặc nhiều sản phẩm.',
        });
      }
  
      // Tiến hành xóa
      const deleted = await Category.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: 'Category không tồn tại' });
      }
  
      res.status(200).json({
        message: 'Category đã bị xóa thành công',
        id: deleted._id,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi xóa Category',
        error: error.message,
      });
    }
  };
           