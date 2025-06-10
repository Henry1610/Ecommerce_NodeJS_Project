import Category from '../../models/Category.js'
export const getPublicCategories = async (req, res) => {
    try {
      const categories = await Category.find({ isActive: true }).lean();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Không lấy được danh mục', error: err.message });
    }
  };
  export const getPublicCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
};