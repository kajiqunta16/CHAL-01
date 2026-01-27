const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const auth = require('../middleware/auth');

// Create a new product
router.post('/create', auth, productController.createProduct);

// Get all products
router.get('/', auth, productController.getAllProducts);

// Get a product by ID
router.get('/:productId', auth, productController.getProductById);

// Update a product by ID
router.put('/:productId', auth, productController.updateProductById);
// Delete a product by ID
router.delete('/:productId', auth, productController.deleteProductById);

module.exports = router;