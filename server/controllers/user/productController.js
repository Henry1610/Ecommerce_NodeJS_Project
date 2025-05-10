import Product from '../../models/Product.js';
// [GET] /api/user/products

export const getAllProducts=async(req,res)=>{
    try{
        const products=Product.find()
        .populate('category')
        .populate('brand')
        .sort({ createdAt: -1 }); 
  
        res.json(products)
    }catch(error){
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });

    }
}
// [GET] /api/user/products/:id
export const getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category')
        .populate('brand');
  
      if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
    }
  };