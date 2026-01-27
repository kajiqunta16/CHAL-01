const express = require('express');
const router = express.Router();
const productController = require('./controllers/product-controller');

// Create a new product
router.post('/create', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:productId', productController.getProductById);

// Update a product by ID
router.put('/:productId', productController.updateProductById);

// Delete a product by ID
router.delete('/:productId', productController.deleteProductById);

module.exports = router;