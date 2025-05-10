import  Brand from '../../models/Brand.js';  

export const createBrand = async (req, res) => {
    try {
        const { name } = req.body;

        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand already exists' });
        }

        const brand = new Brand({ name });
        await brand.save();
        res.status(200).json({
           
            brand
        });
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

        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            { name },
            { new: true }  
        );
        
        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        
        res.status(200).json({
            message: 'Brand updated successfully',
            brand: updatedBrand,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBrand = await Brand.findByIdAndDelete(id);
        
        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        
        res.status(200).json({
            message: 'Brand deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
