const Product = require('../models/product.model');
const User = require('../models/userAuth.model');
const mongoose = require('mongoose');

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    const { title, description, price, category, images } = req.body;

    // Basic validation
    if (!title || !description || !price || !category) {
        return res.status(400).json({ error: 'Please provide all required fields: title, description, price, and category.' });
    }

    try {
        const product = await Product.create({
            title,
            description,
            price,
            category,
            images: images && images.length > 0 ? images : undefined, // Use default if no images are provided
            seller: req.user._id // From requireAuth middleware
        });

        // Also add this product to the user's listings array
        await User.findByIdAndUpdate(req.user._id, { $push: { listings: product._id } });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get all product listings with filtering and searching
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    const { category, keyword } = req.query;
    let query = {};

    // Filtering by category
    if (category) {
        query.category = category;
    }

    // Searching by keyword in title or description
    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } }, // 'i' for case-insensitive
            { description: { $regex: keyword, $options: 'i' } }
        ];
    }
    
    // Only show available products
    query.status = 'Available';

    try {
        const products = await Product.find(query)
            .populate('seller', 'username email') // Populate seller's username and email
            .populate('category', 'name') // Populate category name
            .sort({ createdAt: -1 }); // Show newest first
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching products.' });
    }
};

// @desc    Get a single product by its ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid product ID format.' });
    }

    try {
        const product = await Product.findById(id)
            .populate('seller', 'username email profileImage')
            .populate('category', 'name');

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching the product.' });
    }
};

// @desc    Get listings for the logged-in user
// @route   GET /api/products/mylistings
// @access  Private
const getUserListings = async (req, res) => {
    try {
        const userListings = await Product.find({ seller: req.user._id })
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(userListings);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching your listings.' });
    }
};

// @desc    Update a product listing
// @route   PATCH /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid product ID format.' });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Check if the logged-in user is the seller
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Not authorized to update this product.' });
        }
        
        // Ensure product is not already sold
        if (product.status === 'Sold') {
            return res.status(400).json({ error: 'Cannot update a product that has already been sold.' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid product ID format.' });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Check if the logged-in user is the seller
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Not authorized to delete this product.' });
        }

        await product.deleteOne();

        // Also remove this product from the user's listings array
        await User.findByIdAndUpdate(req.user._id, { $pull: { listings: product._id } });

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while deleting the product.' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getUserListings,
    updateProduct,
    deleteProduct
};
