const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    items: Array,
    total: Number,
    status: { type: String, default: 'Processing' }, 
    deliveryEstimate: String,
    cancelReason: { type: String, default: '' },
    
    // Delivery & Payment Tracking
    deliveryType: { type: String, default: 'Standard' },
    deliveryFee: { type: Number, default: 0 },
    scheduledDate: { type: String, default: '' },
    scheduledTime: { type: String, default: '' },
    deliveryAddress: { type: Object, default: {} },
    paymentMethod: { type: String, default: 'Card' },
    razorpayPaymentId: { type: String, default: '' },
    codConfirmed: { type: Boolean, default: true }, 

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);