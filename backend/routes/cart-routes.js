const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart-controller');
const auth = require('../middleware/auth');

// Add product to cart - Changed route to accept userId as param
router.post('/:userId', auth, cartController.addToCart);

// Remove product ✅ FIXED
router.post('/remove/:userId', auth, cartController.removeFromCart);

router.post('/decrease/:userId', auth, cartController.decreaseQuantity);

// Get cart
router.get('/:userId', auth, cartController.getCart);

module.exports = router;