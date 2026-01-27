const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');
const auth = require('../middleware/auth');

// Create a new order
router.post('/create',auth, orderController.createOrder);


// Get orders for a user
router.get('/:userId', auth, orderController.getUserOrders);

// Update order status
router.put('/:orderId/status', auth, orderController.updateOrderStatus);

// Delete an order
router.delete('/:orderId', auth, orderController.deleteOrder);

module.exports = router;