const orderModel = require('../models/order-model');

exports.createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, status } = req.body;
        const order = new orderModel({ userId, items, totalAmount, status });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.params.userId });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await orderModel.findByIdAndUpdate(
            req.params.orderId,
            {
                status
            },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await orderModel.findByIdAndDelete(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};