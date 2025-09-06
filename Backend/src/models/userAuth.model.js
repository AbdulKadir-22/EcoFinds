const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // Added username field as it's essential for the profile
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true // Removes whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true // Store emails in lowercase for consistency
    },
    password: {
        type: String,
        required: true
    },
    // Added profileImage with a default placeholder
    profileImage: {
        type: String,
        default: 'https://placehold.co/150x150/EFEFEF/3A3A3A?text=No+Image'
    },
    // Added references to other models we will create later
    listings: [{
        type: Schema.Types.ObjectId,
        ref: 'Product' // Reference to the Product model
    }],
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product' // Reference to the Product model
    }],
    purchaseHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Order' // Reference to the Order model
    }]
}, { timestamps: true }); // Added timestamps for createdAt and updatedAt

// --- Static signup method (UPDATED) ---
UserSchema.statics.signup = async function(email, password, username) {
    // Added validation for username
    if (!email || !password || !username) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        // You can add more specific password requirements on the frontend
        throw Error('Password is not strong enough');
    }
    if (!validator.isAlphanumeric(username)) {
        throw Error('Username must contain only letters and numbers');
    }

    const emailExists = await this.findOne({ email });
    if (emailExists) {
        throw Error('Email already in use');
    }

    const usernameExists = await this.findOne({ username });
    if (usernameExists) {
        throw Error('Username is already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user with email, hashed password, and username
    const user = await this.create({ email, password: hash, username });

    return user;
}

// --- Static login method (NO CHANGES) ---
UserSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect Email or Password'); // More generic error for security
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect Email or Password'); // More generic error for security
    }

    return user;
}

module.exports = mongoose.model('User', UserSchema);
