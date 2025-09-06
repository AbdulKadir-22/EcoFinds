const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Storing an array of the products included in the order
    products: [{
        productDetails: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        // It's good practice to store the price at the time of purchase
        soldPrice: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: [true, 'Total order amount is required'],
        min: [0, 'Total amount must be a positive number']
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt for order tracking
});

module.exports = mongoose.model('Order', OrderSchema);
