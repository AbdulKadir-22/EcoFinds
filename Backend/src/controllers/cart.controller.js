const User = require('../models/userAuth.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// @desc    Get items in the user's cart
// @route   GET /api/cart
// @access  Private
const getCartItems = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'cart',
            populate: {
                path: 'seller',
                select: 'username'
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching cart.' });
    }
};

// @desc    Add an item to the cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        
        if (product.status === 'Sold') {
             return res.status(400).json({ error: 'This product is already sold.' });
        }
        
        if (product.seller.toString() === req.user._id.toString()){
            return res.status(400).json({ error: 'You cannot add your own product to the cart.' });
        }

        const user = await User.findById(req.user._id);

        // Check if the product is already in the cart
        if (user.cart.includes(productId)) {
            return res.status(400).json({ error: 'Product is already in your cart.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, { $push: { cart: productId } }, { new: true }
        ).populate('cart');

        res.status(200).json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ error: 'Server error while adding to cart.' });
    }
};

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID.' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, { $pull: { cart: productId } }, { new: true }
        ).populate('cart');
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ error: 'Server error while removing from cart.' });
    }
};


module.exports = {
    getCartItems,
    addToCart,
    removeFromCart
};
