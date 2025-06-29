import Product from '../../models/Product.js';
import Review from '../../models/Review.js';



export const getReviewStats = async (req, res) => {
    const { slug } = req.params;
  
    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  
    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);
  
    const formatted = [1, 2, 3, 4, 5].reduce((acc, star) => {
      acc[star] = stats.find((s) => s._id === star)?.count || 0;
      return acc;
    }, {});
  
    res.json({ stats: formatted });
  };