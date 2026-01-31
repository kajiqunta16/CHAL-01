const cartModel = require('../models/cart-model');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.params.userId; // Get from URL params

        // Find existing cart for user
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new cartModel({
                userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            // Check if product already exists in cart
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                // Product exists, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Product doesn't exist, add new item
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(400).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json(cart);
    } catch (err) {
        console.error("Remove from cart error:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await cartModel
            .findOne({ userId: req.params.userId })
            .populate('items.product');

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

};

exports.decreaseQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ error: "Product not in cart" });
        }

        // ⬇️ Decrease quantity
        cart.items[itemIndex].quantity -= 1;

        // 🧹 Remove if quantity reaches 0
        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error("Decrease quantity error:", err);
        res.status(400).json({ error: err.message });
    }
};