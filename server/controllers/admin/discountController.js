const Discount = require('../model/Discount');  // Import Discount model

// 1. Tạo mới mã giảm giá (Create)
exports.createDiscount = async (req, res) => {
    try {
        const { code, description, discountPercent, validFrom, validTo, isActive } = req.body;

        // Kiểm tra xem mã giảm giá đã tồn tại chưa
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

// 2. Lấy tất cả mã giảm giá (Read All)
exports.getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 3. Lấy mã giảm giá theo ID (Read One)
exports.getDiscountById = async (req, res) => {
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

// 4. Cập nhật mã giảm giá (Update)
exports.updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, description, discountPercent, validFrom, validTo, isActive } = req.body;

        const updatedDiscount = await Discount.findByIdAndUpdate(
            id,
            { code, description, discountPercent, validFrom, validTo, isActive },
            { new: true }  // Trả về discount đã được cập nhật
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

// 5. Xóa mã giảm giá (Delete)
exports.deleteDiscount = async (req, res) => {
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
