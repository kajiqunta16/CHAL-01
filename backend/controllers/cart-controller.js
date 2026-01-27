const cartModel = require('../models/cart-model');

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await cartModel
            .findOneAndUpdate(
                { userId, 'items.productId': productId },
                { $inc: { 'items.$.quantity': quantity } },
                { new: true }
            );
        if (!cart) {
            cart = await cartModel.findOneAndUpdate(
                { userId },
                { $push: { items: { productId, quantity } } },
                { new: true, upsert: true }
            );
        }
        res.status(200).json(cart);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        );
        res.status(200).json(cart);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};