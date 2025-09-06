const Order = require('../models/order.model');
const User = require('../models/userAuth.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// @desc    Create a new order from the user's cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart');

        if (!user || user.cart.length === 0) {
            return res.status(400).json({ error: 'Your cart is empty. Cannot create an order.' });
        }

        let totalAmount = 0;
        const orderProducts = user.cart.map(item => {
            // Ensure all items in cart are still available
            if(item.status === 'Sold') {
                throw new Error(`Product "${item.title}" is no longer available.`);
            }
            totalAmount += item.price;
            return {
                productDetails: item._id,
                quantity: 1, // Assuming quantity is always 1 for this project
                soldPrice: item.price
            };
        });

        // Create the order
        const order = await Order.create({
            buyer: req.user._id,
            products: orderProducts,
            totalAmount
        });

        // Mark products as "Sold"
        const productIdsInCart = user.cart.map(item => item._id);
        await Product.updateMany(
            { _id: { $in: productIdsInCart } },
            { $set: { status: 'Sold' } }
        );

        // Add order to user's purchase history and clear their cart
        await User.findByIdAndUpdate(req.user._id, {
            $push: { purchaseHistory: order._id },
            $set: { cart: [] } // Clear the cart
        });

        res.status(201).json(order);
    } catch (error) {
        // If one of the products became unavailable during checkout
        if(error.message.includes("is no longer available")){
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server error while creating the order.' });
    }
};

// @desc    Get the logged-in user's purchase history
// @route   GET /api/orders/history
// @access  Private
const getPurchaseHistory = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'products.productDetails',
                select: 'title images'
            });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching purchase history.' });
    }
};

module.exports = {
    createOrder,
    getPurchaseHistory
};
