const express = require('express');
const router = express.Router();

const {
    createOrder,
    getPurchaseHistory
} = require('../controllers/order.controller');

const requireAuth = require('../middlewares/requireAuth');

// All order routes require a user to be logged in
router.use(requireAuth);

// GET the user's purchase history
router.get('/history', getPurchaseHistory);

// POST to create a new order from the user's cart
router.post('/', createOrder);

module.exports = router;
