import Discount from '../../models/Discount.js';  // Import Discount model

export const createDiscount = async (req, res) => {
    try {
        const { code, description, discountPercent, validFrom, validTo, isActive } = req.body;

        const existingDiscount = await Discount.findOne({ code });
        if (existingDiscount) {
            return res.status(400).json({ message: 'Discount code already exists' });
        }

        const newDiscount = new Discount({
            code,
            description,
            discountPercent,
            validFrom,
            validTo,
            isActive,
        });

        await newDiscount.save();
        res.status(201).json({
            message: 'Discount created successfully',
            discount: newDiscount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getDiscountById = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findById(id);
        if (!discount) {
            return res.status(404).json({ message: 'Discount not found' });
        }
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, description, discountPercent, validFrom, validTo, isActive } = req.body;

        const updatedDiscount = await Discount.findByIdAndUpdate(
            id,
            { code, description, discountPercent, validFrom, validTo, isActive },
            { new: true }  
        );

        if (!updatedDiscount) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        res.status(200).json({
            message: 'Discount updated successfully',
            discount: updatedDiscount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDiscount = await Discount.findByIdAndDelete(id);

        if (!deletedDiscount) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        res.status(200).json({
            message: 'Discount deleted successfully',
            discount: deletedDiscount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
