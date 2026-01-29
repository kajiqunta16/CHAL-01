const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                name: String,
                price: Number,
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        sub_total: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('Cart', cartSchema);