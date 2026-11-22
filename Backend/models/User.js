const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, default: 'Male' },
    landmark: { type: String },
    addresses: [{
        id: String,
        tag: String,
        fullName: String,
        phone: String,
        street: String,
        landmark: String,
        city: String,
        pincode: String,
        isDefault: Boolean
    }],
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number }
});

module.exports = mongoose.model('User', userSchema);