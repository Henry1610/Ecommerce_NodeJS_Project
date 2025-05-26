
import Brand from '../../models/Brand.js';
import path from 'path';
import fs from 'fs';

export const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const logo = req.file ? req.file.filename : null;
        
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
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Tên brand không được để trống' });
        }

        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        // Nếu có logo mới thì gán, không thì giữ logo cũ
        const logo = req.file ? req.file.filename : brand.logo;

        
        brand.name = name;
        brand.logo = logo;

        
        const updatedBrand = await brand.save();

        res.status(200).json({
            message: 'Cập nhật brand thành công',
            brand: updatedBrand,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBrand = await Brand.findByIdAndDelete(id);

        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        const productPathLogo=path.join('uploads','brands',deletedBrand.logo);
        if(fs.existsSync(productPathLogo)){
            fs.rmSync(productPathLogo);

        }
        res.status(200).json({
            message: 'Brand deleted successfully',
            id: deletedBrand._id

        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
