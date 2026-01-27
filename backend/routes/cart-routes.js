const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart-controller');
const auth = require('../middleware/auth');

// Add product to cart
router.post('/add',auth, cartController.addToCart);

// Remove product from cart
router.post('/remove', auth, cartController.removeFromCart);

// Get user's cart
router.get('/:userId', auth, cartController.getCart);

module.exports = router;