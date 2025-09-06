const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be a positive number']
    },
    images: [{
        type: String,
        required: true,
        default: 'https://placehold.co/600x400/EFEFEF/3A3A3A?text=No+Image'
    }],
    // We will create the Category model next. This sets up the relationship.
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Sold'], // The status can only be one of these two values
        default: 'Available'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', ProductSchema);
