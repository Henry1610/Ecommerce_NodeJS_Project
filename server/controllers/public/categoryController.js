import Category from '../../models/Category.js'
export const getPublicCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Không lấy được danh mục', error: err.message });
    }
  };
  export const getPublicCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
