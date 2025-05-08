import Product from '../models/Product'
exports.getProducts=async(req,res)=>{
    try{
        const products=Product.find();
        res.status(200).json(products)
    }catch(err){
        res.status(500).json({message:'Không tìm thấy danh sách sản phẩm',error:err.message})
    }
}
exports.addProduct=async(req,res)=>{
    try{
        const { name, description, price, stock, category, brand, images } = req.body;
        const newProduct=new Product(
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
        const product=newProduct.save();
        res.status(200).json(product)
    }catch(err){
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
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
  };             