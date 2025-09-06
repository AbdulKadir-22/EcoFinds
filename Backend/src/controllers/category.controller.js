const Category = require('../models/category.model');
const mongoose = require('mongoose');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (should be admin in a real app)
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Category name is required.' });
    }

    try {
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ error: 'A category with this name already exists.' });
        }

        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort('name');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching categories.' });
    }
};

module.exports = {
    createCategory,
    getAllCategories
};
