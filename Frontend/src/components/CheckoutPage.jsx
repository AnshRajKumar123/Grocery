import React, { useState, useEffect, useRef } from "react";
import "../styles/CheckoutPage.css";
import { apiService } from "../services/api";
import {
    ArrowLeft,
    MapPin,
    Plus,
    ShoppingBag,
    CheckCircle2,
    Clock,
    Zap,
    AlertCircle,
    Loader2,
    ShieldCheck
} from "lucide-react";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutPage({ cartItems, user, onBackToCart, onOrderPlaced, onPromptLogin }) {
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [selectedAddressId, setSelectedAddressId] = useState(user?.addresses?.[0]?.id || "");
    const [paymentMethod, setPaymentMethod] = useState("Razorpay");
    const [couponCode, setCouponCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [appliedCouponName, setAppliedCouponName] = useState("");

    const [deliveryType, setDeliveryType] = useState("Standard");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");

    const [isAddingNewAddr, setIsAddingNewAddr] = useState(!(user?.addresses?.length > 0));
    const [inlineTag, setInlineTag] = useState("Home");
    const [inlineStreet, setInlineStreet] = useState("");
    const [inlineCity, setInlineCity] = useState("");
    const [inlinePincode, setInlinePincode] = useState("");
    const [inlinePhone, setInlinePhone] = useState(user?.phone || "");

    const [formError, setFormError] = useState("");
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Synchronous lock: blocks rapid double-clicks before React finishes re-rendering
    const paymentLockRef = useRef(false);

    useEffect(() => {
        const userAddrs = user?.addresses || [];
        setAddresses(userAddrs);
        if (userAddrs.length > 0 && !selectedAddressId) {
            setSelectedAddressId(userAddrs[0].id);
            setIsAddingNewAddr(false);
        }
    }, [user]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = deliveryType === "Fast" ? 25 : 0;
    const grandTotal = Math.max(0, subtotal - appliedDiscount + deliveryFee);

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

    const releasePaymentLock = () => {
        paymentLockRef.current = false;
        setIsProcessing(false);
    };

    const handleApplyCoupon = (e) => {
        if (e) e.preventDefault();
        if (isProcessing) return;
        const code = couponCode.trim().toUpperCase();
        if (!code) {
            setFormError("Please enter a promo code.");
            return;
        }
        setFormError("");
        if (code === "KISAN10") {
            setAppliedDiscount(Math.round(subtotal * 0.1));
            setAppliedCouponName("KISAN10 applied (-10%)");
        } else if (code === "SUPER20") {
            setAppliedDiscount(Math.round(subtotal * 0.2));
            setAppliedCouponName("SUPER20 applied (-20%)");
        } else if (code === "COMEBACK10") {
            setAppliedDiscount(Math.round(subtotal * 0.1));
            setAppliedCouponName("COMEBACK10 (-10%)");
        } else {
            setFormError("Invalid coupon code!");
        }
    };

    const handleCreateInlineAddress = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!inlineTag.trim() || !inlineStreet.trim() || !inlineCity.trim()) {
            setFormError("Please fill in Address Label, Street, and City.");
            return;
        }
        if (!/^\d{6}$/.test(inlinePincode.trim())) {
            setFormError("Please enter a valid 6-digit Pincode.");
            return;
        }
        if (!/^\d{10}$/.test(inlinePhone.trim())) {
            setFormError("Please enter a valid 10-digit Mobile Number.");
            return;
        }

        const created = {
            id: "addr-" + Date.now(),
            tag: inlineTag.trim(),
            fullName: user?.name || "Customer",
            phone: inlinePhone.trim(),
            street: inlineStreet.trim(),
            city: inlineCity.trim(),
            pincode: inlinePincode.trim()
        };

        const updatedAddresses = [...addresses, created];
        setIsSavingAddress(true);

        try {
            if (user?.email) {
                await apiService.updateProfile({
                    email: user.email,
                    addresses: updatedAddresses
                });
            }
            setAddresses(updatedAddresses);
            if (user) user.addresses = updatedAddresses;
            setSelectedAddressId(created.id);
            setIsAddingNewAddr(false);
            setInlineStreet("");
            setInlineCity("");
            setInlinePincode("");
        } catch (err) {
            setFormError("Failed to save address. Please try again.");
        } finally {
            setIsSavingAddress(false);
        }
    };

    const getDeliveryEstimateText = () => {
        if (deliveryType === "Fast") return "Today (20-25 mins)";
        if (deliveryType === "Schedule" && scheduledDate && scheduledTime) {
            return `${scheduledDate} at ${scheduledTime}`;
        }
        return "Today (30-35 mins)";
    };

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 3);
    const todayStr = today.toISOString().split("T")[0];
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const finalizeOrderInDatabase = async (paymentId = "") => {
        const generatedOrderId = "0" + Math.floor(100000000000 + Math.random() * 900000000000);

        const dbOrderData = {
            userEmail: user.email,
            orderId: generatedOrderId,
            items: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            total: grandTotal,
            deliveryEstimate: getDeliveryEstimateText(),
            deliveryType,
            deliveryFee,
            scheduledDate,
            scheduledTime,
            deliveryAddress: selectedAddress,
            paymentMethod: paymentMethod === "Razorpay" ? `Razorpay (${paymentId})` : "Cash on Delivery",
            razorpayPaymentId: paymentId,
            codConfirmed: true
        };

        const response = await apiService.createOrder(dbOrderData);

        if (response.ok) {
            const now = new Date();
            const dateFormatted = `${now.getDate()} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()} · ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

            // Keep lock active while redirecting so user cannot re-trigger
            onOrderPlaced({
                id: generatedOrderId,
                totalAmount: grandTotal,
                dateFormatted,
                status: "Confirmed",
                customerName: user.name || "Customer",
                paymentMethod: paymentMethod === "Razorpay" ? "Razorpay Online" : "Cash on Delivery",
                paymentLast4: paymentId ? paymentId.slice(-4) : ""
            });
        } else {
            setFormError(response.data.message || "Failed to save order.");
            releasePaymentLock();
        }
    };

    const handlePlaceOrderSubmit = async () => {
        // INSTANT DOUBLE-CLICK GUARD (0ms)
        if (paymentLockRef.current || isProcessing) return;

        setFormError("");

        if (!user) {
            onPromptLogin();
            return;
        }
        if (cartItems.length === 0) {
            setFormError("Your cart is empty!");
            return;
        }
        if (!selectedAddress) {
            setFormError("Please add and select a delivery address before placing your order.");
            setIsAddingNewAddr(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (deliveryType === "Schedule" && (!scheduledDate || !scheduledTime)) {
            setFormError("Please select both a delivery date and time for Scheduled Delivery.");
            return;
        }

        // Lock immediately on first valid click
        paymentLockRef.current = true;
        setIsProcessing(true);

        try {
            // FLOW 1: CASH ON DELIVERY
            if (paymentMethod === "Cash on Delivery") {
                await finalizeOrderInDatabase();
                return;
            }

            // FLOW 2: RAZORPAY ONLINE PAYMENT
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setFormError("Failed to load Razorpay SDK. Check your internet connection.");
                releasePaymentLock();
                return;
            }

            const rzpRes = await apiService.createRazorpayOrder(grandTotal);
            if (!rzpRes.ok) {
                setFormError(rzpRes.data.message || "Could not initiate Razorpay payment.");
                releasePaymentLock();
                return;
            }

            const { orderId, amount, currency, keyId } = rzpRes.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: "Kisan SuperMall",
                description: `Order Payment (${cartItems.length} items)`,
                order_id: orderId,
                prefill: {
                    name: user.name || "",
                    email: user.email || "",
                    contact: selectedAddress.phone || user.phone || ""
                },
                theme: {
                    color: "#0f172a"
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await apiService.verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.ok && verifyRes.data.verified) {
                            await finalizeOrderInDatabase(response.razorpay_payment_id);
                        } else {
                            setFormError("Payment verification failed. Please contact support.");
                            releasePaymentLock();
                        }
                    } catch (err) {
                        setFormError("Error verifying payment.");
                        releasePaymentLock();
                    }
                },
                modal: {
                    ondismiss: function () {
                        releasePaymentLock();
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                setFormError(response.error.description || "Payment failed. Please try again.");
                releasePaymentLock();
            });
            rzp.open();
        } catch (error) {
            setFormError("Server error placing order. Please try again.");
            releasePaymentLock();
        }
    };

    return (
        <div className="checkout-page-canvas">
            <button type="button" className="btn-back-catalog" onClick={onBackToCart} disabled={isProcessing}>
                <ArrowLeft size={16} /> Back to Bag
            </button>

            {formError && (
                <div className="checkout-error-banner">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                </div>
            )}

            <div className="checkout-grid-layout">
                <div className="checkout-left-flow">
                    {/* Selected Products */}
                    <div className="checkout-card-box">
                        <div className="checkout-card-title">
                            <h3><ShoppingBag size={18} /> Review Selected Products ({cartItems.length})</h3>
                        </div>
                        <div className="checkout-items-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="checkout-product-row">
                                    <img src={item.image} alt={item.name} className="checkout-thumb" />
                                    <div className="checkout-prod-info">
                                        <h4>{item.name}</h4>
                                        <small>Qty: <strong>{item.quantity}</strong> · {item.unit}</small>
                                    </div>
                                    <strong className="checkout-prod-price">₹{item.price * item.quantity}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="checkout-card-box">
                        <div className="checkout-card-title">
                            <h3><MapPin size={18} /> Delivery Address</h3>
                            <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => setIsAddingNewAddr(!isAddingNewAddr)}
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    background: "#f1f5f9",
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    border: "none",
                                    cursor: isProcessing ? "not-allowed" : "pointer"
                                }}
                            >
                                <Plus size={12} style={{ verticalAlign: "middle" }} /> {isAddingNewAddr ? "Close Form" : "Add Address"}
                            </button>
                        </div>

                        {addresses.length === 0 && !isAddingNewAddr && (
                            <div className="empty-address-notice">
                                No delivery address saved yet. Click <strong>+ Add Address</strong> to continue.
                            </div>
                        )}

                        {isAddingNewAddr && (
                            <form onSubmit={handleCreateInlineAddress} className="new-address-form">
                                <div className="form-row-duo">
                                    <input
                                        type="text"
                                        className="form-input-control"
                                        placeholder="Label (e.g. Home / Farm)"
                                        value={inlineTag}
                                        onChange={(e) => setInlineTag(e.target.value)}
                                        disabled={isProcessing}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        className="form-input-control"
                                        placeholder="10-digit Mobile Number"
                                        maxLength="10"
                                        value={inlinePhone}
                                        onChange={(e) => setInlinePhone(e.target.value.replace(/\D/g, ""))}
                                        disabled={isProcessing}
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    className="form-input-control"
                                    placeholder="Street / Locality / Village Road"
                                    value={inlineStreet}
                                    onChange={(e) => setInlineStreet(e.target.value)}
                                    disabled={isProcessing}
                                    required
                                />
                                <div className="form-row-duo">
                                    <input
                                        type="text"
                                        className="form-input-control"
                                        placeholder="City, State"
                                        value={inlineCity}
                                        onChange={(e) => setInlineCity(e.target.value)}
                                        disabled={isProcessing}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className="form-input-control"
                                        placeholder="6-digit Pincode"
                                        maxLength="6"
                                        value={inlinePincode}
                                        onChange={(e) => setInlinePincode(e.target.value.replace(/\D/g, ""))}
                                        disabled={isProcessing}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-apply-coupon" disabled={isSavingAddress || isProcessing}>
                                    {isSavingAddress ? "Saving..." : "Save & Select Address"}
                                </button>
                            </form>
                        )}

                        {addresses.length > 0 && (
                            <div className="address-selector-grid">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`address-option-card ${selectedAddressId === addr.id ? "selected" : ""}`}
                                        onClick={() => {
                                            if (isProcessing) return;
                                            setSelectedAddressId(addr.id);
                                            setFormError("");
                                        }}
                                    >
                                        <span className="address-tag-pill">{addr.tag}</span>
                                        <h5>{addr.fullName}</h5>
                                        <p>{addr.street}</p>
                                        <p>{addr.city} - {addr.pincode}</p>
                                        <small>Phone: {addr.phone}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Delivery Options + Order Summary */}
                <div className="checkout-right-summary">
                    <div className="order-summary-box">
                        <h3>Delivery Options</h3>
                        <div className="delivery-type-options">
                            <label className={`dlv-type-card ${deliveryType === "Standard" ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    checked={deliveryType === "Standard"}
                                    disabled={isProcessing}
                                    onChange={() => setDeliveryType("Standard")}
                                />
                                <div className="dlv-meta">
                                    <strong>Standard Delivery</strong>
                                    <span>30 - 35 mins</span>
                                </div>
                                <span className="dlv-fee free">FREE</span>
                            </label>

                            <label className={`dlv-type-card ${deliveryType === "Fast" ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    checked={deliveryType === "Fast"}
                                    disabled={isProcessing}
                                    onChange={() => setDeliveryType("Fast")}
                                />
                                <div className="dlv-meta">
                                    <strong>
                                        Fast Track{" "}
                                        <Zap size={12} color="#f59e0b" fill="#f59e0b" style={{ display: "inline", verticalAlign: "middle" }} />
                                    </strong>
                                    <span>20 - 25 mins</span>
                                </div>
                                <span className="dlv-fee">₹25</span>
                            </label>

                            <label className={`dlv-type-card ${deliveryType === "Schedule" ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    checked={deliveryType === "Schedule"}
                                    disabled={isProcessing}
                                    onChange={() => setDeliveryType("Schedule")}
                                />
                                <div className="dlv-meta">
                                    <strong>
                                        Choose Time <Clock size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                                    </strong>
                                    <span>Schedule ahead (up to 3 days)</span>
                                </div>
                            </label>

                            {deliveryType === "Schedule" && (
                                <div className="schedule-inputs animate-slide-down">
                                    <input
                                        type="date"
                                        className="form-input-control"
                                        min={todayStr}
                                        max={maxDateStr}
                                        value={scheduledDate}
                                        disabled={isProcessing}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="time"
                                        className="form-input-control"
                                        value={scheduledTime}
                                        disabled={isProcessing}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="order-summary-box">
                        <h3>Order Summary</h3>

                        <div className="payment-methods-grid" style={{ marginBottom: 14 }}>
                            <label
                                className={`payment-method-row ${paymentMethod === "Razorpay" ? "selected" : ""}`}
                                style={{ padding: "12px 14px" }}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Razorpay"
                                    checked={paymentMethod === "Razorpay"}
                                    disabled={isProcessing}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                                    UPI / Card / NetBanking (Razorpay) <ShieldCheck size={14} color="#16a34a" />
                                </span>
                            </label>

                            <label
                                className={`payment-method-row ${paymentMethod === "Cash on Delivery" ? "selected" : ""}`}
                                style={{ padding: "12px 14px" }}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Cash on Delivery"
                                    checked={paymentMethod === "Cash on Delivery"}
                                    disabled={isProcessing}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span style={{ fontSize: 13, fontWeight: 700 }}>Cash on Delivery</span>
                            </label>
                        </div>

                        <div>
                            <div className="coupon-input-group">
                                <input
                                    type="text"
                                    placeholder="Promo code (e.g. KISAN10)"
                                    className="form-input-control"
                                    value={couponCode}
                                    disabled={isProcessing}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button type="button" className="btn-apply-coupon" onClick={handleApplyCoupon} disabled={isProcessing}>
                                    Apply
                                </button>
                            </div>
                            {appliedDiscount > 0 && (
                                <span className="coupon-active-badge">
                                    <CheckCircle2 size={13} /> {appliedCouponName}
                                </span>
                            )}
                        </div>

                        <div className="summary-calc-row" style={{ marginTop: 12 }}>
                            <span>Items Subtotal</span>
                            <strong>₹{subtotal}</strong>
                        </div>
                        {appliedDiscount > 0 && (
                            <div className="summary-calc-row discount">
                                <span>Promotional Discount</span>
                                <strong>-₹{appliedDiscount}</strong>
                            </div>
                        )}
                        <div className="summary-calc-row">
                            <span>Delivery Fee</span>
                            <strong style={{ color: deliveryFee === 0 ? "#16a34a" : "#0f172a" }}>
                                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                            </strong>
                        </div>
                        <div className="summary-calc-row final-total">
                            <span>Total Payable</span>
                            <span>₹{grandTotal}</span>
                        </div>

                        <button
                            type="button"
                            className="btn-place-order-submit"
                            onClick={handlePlaceOrderSubmit}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 size={16} className="spin-icon" />{" "}
                                    {paymentMethod === "Razorpay" ? "Opening Payment..." : "Placing Order..."}
                                </>
                            ) : paymentMethod === "Razorpay" ? (
                                `Pay ₹${grandTotal} with Razorpay`
                            ) : (
                                `Place COD Order (₹${grandTotal})`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}