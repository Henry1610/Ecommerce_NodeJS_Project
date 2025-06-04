import Category from '../../models/Category.js'
export const getPublicCategories = async (req, res) => {
    try {
      const categories = await Category.find({ isActive: true }).lean();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Không lấy được danh mục', error: err.message });
    }
  };