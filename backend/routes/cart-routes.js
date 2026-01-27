const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart-controller');

// Add product to cart
router.post('/add', cartController.addToCart);

// Remove product from cart
router.post('/remove', cartController.removeFromCart);

// Get user's cart
router.get('/:userId', cartController.getCart);

module.exports = router;