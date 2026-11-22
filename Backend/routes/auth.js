require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || "KISAN_SUPERMALL_SECRET_KEY_1020";

// Rate Limiter for Login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3, 
    message: { message: "Account locked due to too many attempts. Please try again after 15 minutes." }
});

// Mail Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ==========================================
// OTP Verification Route
// ==========================================
router.post('/send-register-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const otp = generateOTP();
        
        const htmlTemplate = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 25px;">
                <img src="cid:websitelogo" alt="Kisan SuperMall Logo" style="width: 72px; height: 72px; border-radius: 14px; object-fit: cover; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);" />
                <h1 style="color: #0f172a; margin: 0 0 5px; font-size: 24px; font-weight: 800;">Kisan SuperMall</h1>
            </div>
            <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 16px; text-align: center;">
                <h2 style="color: #0f172a; margin-top: 0;">Verify Your Email</h2>
                <div style="margin: 30px 0;"><span style="font-size: 36px; font-weight: 800; color: #16a34a; letter-spacing: 8px; background: #f0fdf4; padding: 15px 25px; border-radius: 10px; border: 1px solid #bbf7d0;">${otp}</span></div>
            </div>
        </div>`;

        transporter.sendMail({
            from: `Kisan SuperMall <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: 'Registration Verification Code', 
            html: htmlTemplate,
            attachments: [{
                filename: 'WebsiteLogo.png',
                path: path.join(__dirname, '../assets/WebsiteLogo.png'),
                cid: 'websitelogo',
                contentDisposition: 'inline'
            }]
        }, (error) => {
            if (error) return res.status(500).json({ message: 'Error sending email' });
            res.json({ message: 'OTP sent', otp }); 
        });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ name, email, phone, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        if (user.lockUntil && user.lockUntil > Date.now()) return res.status(403).json({ message: 'Account locked.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) user.lockUntil = Date.now() + 15 * 60 * 1000; 
            await user.save();
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        user.loginAttempts = 0; user.lockUntil = undefined; await user.save();
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, user }); 
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ email: decoded.email }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
});

router.put('/profile', async (req, res) => {
    try {
        const { email, name, phone, gender, landmark, addresses } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.gender = gender || user.gender;
        user.landmark = landmark || user.landmark;
        user.addresses = addresses || user.addresses;
        await user.save();
        res.status(200).json({ message: 'Profile updated', user });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/account', async (req, res) => {
    try {
        const { email } = req.body;
        await User.findOneAndDelete({ email });
        await Order.deleteMany({ userEmail: email }); 
        await Wishlist.deleteOne({ userEmail: email });
        res.status(200).json({ message: 'Account deleted' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ==========================================
// Razorpay Payment Routes
// ==========================================
router.post('/razorpay/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid order amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency: 'INR',
            receipt: 'ksm_rcpt_' + Date.now()
        };

        const rzpOrder = await razorpay.orders.create(options);
        res.status(200).json({
            orderId: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error('Razorpay Create Order Error:', err);
        res.status(500).json({ message: 'Failed to initiate Razorpay payment' });
    }
});

router.post('/razorpay/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ verified: true, paymentId: razorpay_payment_id });
        } else {
            return res.status(400).json({ verified: false, message: 'Invalid payment signature' });
        }
    } catch (err) {
        console.error('Razorpay Verify Error:', err);
        res.status(500).json({ message: 'Server error verifying payment' });
    }
});

// ==========================================
// Orders Route (With Duplicate Guard)
// ==========================================
router.post('/orders', async (req, res) => {
    try {
        const {
            userEmail,
            orderId,
            items,
            total,
            deliveryEstimate,
            deliveryType,
            deliveryFee,
            scheduledDate,
            scheduledTime,
            deliveryAddress,
            paymentMethod,
            razorpayPaymentId,
            codConfirmed
        } = req.body;

        // Prevent duplicate order creation on slow network retries
        if (razorpayPaymentId) {
            const existingPaidOrder = await Order.findOne({ razorpayPaymentId });
            if (existingPaidOrder) {
                return res.status(200).json({ message: 'Order already recorded', order: existingPaidOrder });
            }
        }
        const existingOrder = await Order.findOne({ orderId });
        if (existingOrder) {
            return res.status(200).json({ message: 'Order already recorded', order: existingOrder });
        }

        const newOrder = new Order({ 
            userEmail,
            orderId,
            items,
            total,
            deliveryEstimate,
            status: 'Processing',
            deliveryType,
            deliveryFee,
            scheduledDate,
            scheduledTime,
            deliveryAddress,
            paymentMethod,
            razorpayPaymentId: razorpayPaymentId || '',
            codConfirmed
        });
        await newOrder.save();

        const itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: left;">
                    <span style="font-weight: 700; color: #0f172a; font-size: 15px;">${item.name}</span><br/>
                    <span style="font-size: 13px; color: #64748b;">Qty: ${item.quantity}</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 800; color: #0f172a; font-size: 15px;">
                    ₹${item.price * item.quantity}
                </td>
            </tr>
        `).join('');

        const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="background-color: #0f172a; padding: 30px 20px; text-align: center;">
                    <img src="cid:websitelogo" alt="Kisan SuperMall Logo" style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover; margin-bottom: 14px;" />
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">Kisan SuperMall</h1>
                    <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Order Confirmed Successfully!</p>
                </div>
                
                <div style="padding: 30px 24px;">
                    <div style="margin-bottom: 24px; text-align: center;">
                        <p style="margin: 0 0 4px; font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700;">Order ID</p>
                        <h2 style="margin: 0; font-size: 22px; color: #0f172a; font-weight: 800;">#${orderId}</h2>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        ${itemsHtml}
                    </table>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #475569;">
                            <span style="float: left;">Items Subtotal</span>
                            <span style="float: right;">₹${total - (deliveryFee || 0)}</span>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; color: #475569;">
                            <span style="float: left;">Delivery Fee (${deliveryType})</span>
                            <span style="float: right;">${deliveryFee ? `₹${deliveryFee}` : 'FREE'}</span>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed #cbd5e1; padding-top: 16px; font-size: 18px; font-weight: 900; color: #0f172a;">
                            <span style="float: left;">Total Paid</span>
                            <span style="float: right;">₹${total}</span>
                            <div style="clear: both;"></div>
                        </div>
                    </div>
                    
                    <p style="text-align: center; margin: 24px 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                        Thank you for shopping with us!<br/>
                        Track your order live in your account dashboard.
                    </p>
                </div>
            </div>
        </div>`;

        transporter.sendMail({
            from: `Kisan SuperMall <${process.env.EMAIL_USER}>`,
            to: userEmail, 
            subject: `Order Invoice #${orderId} - Kisan SuperMall`, 
            html: emailHtml,
            attachments: [{
                filename: 'WebsiteLogo.png',
                path: path.join(__dirname, '../assets/WebsiteLogo.png'),
                cid: 'websitelogo',
                contentDisposition: 'inline'
            }]
        }, (error) => {
            if (error) console.error('Background Error sending invoice email:', error);
        });

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) { 
        console.error("Order Creation Error:", err);
        res.status(500).json({ message: 'Server error creating order' }); 
    }
});

router.get('/orders/:email', async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) { res.status(500).json({ message: 'Server error fetching orders' }); }
});

router.put('/orders/:orderId/cancel', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;
        const order = await Order.findOneAndUpdate(
            { orderId: String(orderId) },
            { status: 'Cancelled', cancelReason: reason || 'Changed my mind' },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (err) { res.status(500).json({ message: 'Server error cancelling order' }); }
});

router.get('/orders/track/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: String(req.params.orderId) });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ order });
    } catch (err) { res.status(500).json({ message: 'Server error tracking order' }); }
});

router.put('/orders/:orderId/confirm-cod', async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: String(req.params.orderId) },
            { codConfirmed: true, status: 'Processing' },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'COD Confirmed', order });
    } catch (err) { res.status(500).json({ message: 'Server error confirming COD' }); }
});

// ==========================================
// Wishlist Routes
// ==========================================
router.get('/wishlist/:email', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userEmail: req.params.email });
        res.json({ wishlist: wishlist ? wishlist.items : [] });
    } catch (err) { res.status(500).json({ message: 'Server error fetching wishlist' }); }
});

router.post('/wishlist', async (req, res) => {
    try {
        const { userEmail, items } = req.body;
        let wishlist = await Wishlist.findOne({ userEmail });
        
        if (wishlist) {
            wishlist.items = items;
            wishlist.updatedAt = Date.now();
        } else {
            wishlist = new Wishlist({ userEmail, items });
        }
        
        await wishlist.save();
        res.status(200).json({ message: 'Wishlist synced successfully', wishlist: wishlist.items });
    } catch (err) { res.status(500).json({ message: 'Server error syncing wishlist' }); }
});

module.exports = router;