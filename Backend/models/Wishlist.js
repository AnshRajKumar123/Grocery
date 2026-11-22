const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    items: Array, // Array to store the full product objects saved by the user
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);