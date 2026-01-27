const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');

// Create a new order
router.post('/create', orderController.createOrder);

// Get orders for a user
router.get('/:userId', orderController.getUserOrders);
module.exports = router;

// Update order status
router.put('/:orderId/status', orderController.updateOrderStatus);
// Delete an order
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;