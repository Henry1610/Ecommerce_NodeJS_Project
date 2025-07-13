import Brand from '../../models/Brand.js';
import Product from '../../models/Product.js';
import path from 'path';
import fs from 'fs';
import { getPublicIdFromUrl } from '../../utils/getPublicIdFromUrl.js';
import { v2 as cloudinary } from 'cloudinary';
import { deleteCloudinaryFolder } from '../../utils/deleteCloudinaryFolder.js';

export const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const logo = req.file ? req.file.path : null;
        
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand already exists' });
        }

        const brand = new Brand({ name, logo });
        await brand.save(); 
        res.status(201).json({ message: 'Brand created successfully', brand });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;


        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, removeLogo } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tên brand không được để trống' });
    }

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Kiểm tra trùng tên với brand khác
    const existing = await Brand.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ message: 'Tên brand đã tồn tại.' });
    }

    console.log('🔥 Brand cũ:', brand); // ✅ Kiểm tra dữ liệu brand cũ

    let logo = brand.logo;

    // Xử lý xóa logo nếu có cờ removeLogo
    if (removeLogo === 'true' && brand.logo) {
      const publicId = getPublicIdFromUrl(brand.logo);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      logo = null;
    }

    if (req.file) {
      console.log('🆕 Có file logo mới:', req.file.path);

      if (brand.logo) {
        const publicId = getPublicIdFromUrl(brand.logo);
        console.log('📦 publicId tách ra:', publicId); // ✅ Kiểm tra publicId

        if (publicId) {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log('🗑️ Kết quả xoá logo cũ:', result); // ✅ Kiểm tra kết quả xoá
        } else {
          console.warn('⚠️ Không tách được publicId từ URL:', brand.logo);
        }
      }

      logo = req.file.path;
    }

    brand.name = name.trim();
    brand.logo = logo;

    const updatedBrand = await brand.save();

    console.log('✅ Brand cập nhật:', updatedBrand); // ✅ Kiểm tra dữ liệu mới

    res.status(200).json({
      message: 'Cập nhật brand thành công',
      brand: updatedBrand,
    });
  } catch (error) {
    console.error('💥 Lỗi update brand:', error); // ✅ In lỗi chi tiết
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};



export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra xem brand có đang được sử dụng bởi sản phẩm nào không
    const isLinked = await Product.exists({ brand: id });
    if (isLinked) {
      return res.status(400).json({
        message: 'Không thể xóa. Thương hiệu này đang được sử dụng bởi một hoặc nhiều sản phẩm.',
      });
    }

    // 2. Lấy brand trước khi xoá
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    console.log('👉 Brand tìm được:', brand.name, '| Slug:', brand.slug);

    // 3. Xoá folder Cloudinary nếu có slug
    if (brand.slug) {
      console.log(`🗑 Đang xoá folder Cloudinary: brands/${brand.slug}`);
      await deleteCloudinaryFolder(`brands/${brand.slug}`);
      console.log(`✅ Đã xoá folder Cloudinary: brands/${brand.slug}`);
    } else {
      console.log('⚠️ Không có slug — bỏ qua xoá folder Cloudinary');
    }

    // 4. Xoá khỏi MongoDB
    await Brand.findByIdAndDelete(id);
    console.log(`✅ Đã xoá brand trong MongoDB: ${brand._id}`);

    res.status(200).json({
      message: 'Brand deleted successfully',
      id: brand._id,
    });
  } catch (error) {
    console.error('❌ Lỗi khi xoá brand:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

  
