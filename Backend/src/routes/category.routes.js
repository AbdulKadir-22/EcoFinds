const express = require('express');
const router = express.Router();

const {
    createCategory,
    getAllCategories
} = require('../controllers/category.controller');

const requireAuth = require('../middlewares/requireAuth');

// PUBLIC ROUTE
// GET all categories
router.get('/', getAllCategories);

// PRIVATE ROUTE (in a real app, you might add an admin check here too)
// POST a new category
router.post('/', requireAuth, createCategory);

module.exports = router;
