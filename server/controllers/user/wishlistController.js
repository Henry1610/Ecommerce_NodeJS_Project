import User from '../../models/User.js';
import Product from '../../models/Product.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find user and populate wishlist with product details
        const user = await User.findById(userId).populate({
            path: 'wishlist',
            select: 'name price images slug stock brand category',
            populate: [
                { path: 'brand', select: 'name logo' },
                { path: 'category', select: 'name' }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            wishlist: user.wishlist || []
        });
    } catch (error) {
        console.error('Error getting wishlist:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required' 
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if product is already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product already in wishlist' 
            });
        }

        // Add product to wishlist
        user.wishlist.push(productId);
        await user.save();

        // Populate product details for response
        await user.populate({
            path: 'wishlist',
            select: 'name price images slug stock brand category',
            populate: [
                { path: 'brand', select: 'name' },
                { path: 'category', select: 'name' }
            ]
        });

        const addedProduct = user.wishlist[user.wishlist.length - 1];

        res.status(200).json({
            success: true,
            message: 'Product added to wishlist successfully',
            product: addedProduct
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required' 
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if product is in wishlist
        if (!user.wishlist.includes(productId)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found in wishlist' 
            });
        }

        // Remove product from wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist successfully'
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

