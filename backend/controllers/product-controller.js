const productModel = require('../models/product-model');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const product = new productModel({ name, description, price, stock });
        await product.save();
        res.status(201).json(product);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProductById = async (req, res) => {
    try {
        const updates = req.body;
        const product = await productModel.findByIdAndUpdate(req.params.productId, updates, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
