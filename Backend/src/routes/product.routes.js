const express = require('express');
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    getUserListings,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

const requireAuth = require('../middlewares/requireAuth');

// PUBLIC ROUTES
// GET all products (with optional filtering/searching via query params)
router.get('/', getAllProducts);

// GET a single product by ID
router.get('/:id', getProductById);


// PRIVATE ROUTES (require authentication)
// GET all listings for the logged-in user
router.get('/user/mylistings', requireAuth, getUserListings);

// POST a new product listing
router.post('/', requireAuth, createProduct);

// PATCH/update an existing product
router.patch('/:id', requireAuth, updateProduct);

// DELETE a product
router.delete('/:id', requireAuth, deleteProduct);

module.exports = router;
