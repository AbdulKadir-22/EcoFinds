const express = require('express');
const router = express.Router();

const {
    getCartItems,
    addToCart,
    removeFromCart
} = require('../controllers/cart.controller');

const requireAuth = require('../middlewares/requireAuth');

// All cart routes require a user to be logged in
router.use(requireAuth);

// GET all items from the user's cart
router.get('/', getCartItems);

// POST (add) an item to the cart
router.post('/', addToCart);

// DELETE an item from the cart
router.delete('/:productId', removeFromCart);

module.exports = router;
