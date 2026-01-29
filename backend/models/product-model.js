const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        short_description: {
            type: String,
            default: null
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        list_price: {
            type: Number,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);