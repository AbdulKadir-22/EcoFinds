const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [250, 'Description cannot be more than 250 characters']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Category', CategorySchema);
