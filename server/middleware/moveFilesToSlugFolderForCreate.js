import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';
import { getPublicIdFromUrl } from '../utils/getPublicIdFromUrl.js';

export const moveFilesToSlugFolderForCreate = async (req, res) => {
  try {
    const product = req.product;

    if (!product || !product.slug) {
      return res.status(400).json({ message: 'Không có thông tin sản phẩm hoặc slug.' });
    }

    const newImageUrls = [];

    for (const imageUrl of product.images) {
      const publicId = getPublicIdFromUrl(imageUrl); // ex: products/temp/abc123
      if (!publicId) continue;

      const fileName = publicId.split('/').pop(); // abc123
      const newPublicId = `products/${product.slug}/${fileName}`;

      try {
        const result = await cloudinary.uploader.rename(publicId, newPublicId);
        newImageUrls.push(result.secure_url); // ✅ chỉ lưu URL
      } catch (err) {
        console.warn(`❌ Không thể di chuyển file ${publicId}:`, err.message);
        // vẫn tiếp tục các ảnh khác
      }
    }

    product.images = newImageUrls;
    await product.save();

    res.status(201).json({
      message: 'Tạo sản phẩm thành công và ảnh đã được di chuyển',
      product,
    });
  } catch (error) {
    console.error('[MOVE FILE ERROR]', error);
    res.status(500).json({
      message: 'Lỗi khi di chuyển ảnh sau khi tạo sản phẩm',
      error: error.message,
    });
  }
};
