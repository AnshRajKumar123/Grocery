import React from "react";
import "../styles/CartDrawer.css";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer({
    isOpen,
    onClose,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    activeSection,
    onProceedToCheckout
}) {
    if (!isOpen) return null;

    const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-drawer-backdrop" onClick={onClose}>
            <div
                className={`cart-drawer-panel theme-${activeSection}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drawer Header */}
                <div className="cart-drawer-header">
                    <div className="cart-header-title">
                        <ShoppingBag size={19} />
                        <h3>Your Shopping Bag</h3>
                        <span className="cart-items-pill">{totalItemCount} Items</span>
                    </div>
                    <button
                        type="button"
                        className="btn-close-drawer"
                        onClick={onClose}
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Contents */}
                {cartItems.length === 0 ? (
                    <div className="cart-empty-state">
                        <div className="cart-empty-icon-wrap">
                            <ShoppingBag size={32} />
                        </div>
                        <h4>Your bag is empty</h4>
                        <p>Explore our Farm, Kirana, or Beauty departments and add essentials to your cart.</p>
                    </div>
                ) : (
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                <img src={item.image} alt={item.name} className="cart-item-thumb" />

                                <div className="cart-item-details">
                                    <div className="cart-item-title-row">
                                        <h5>{item.name}</h5>
                                        <button
                                            type="button"
                                            className="btn-remove-item"
                                            onClick={() => onRemoveItem(item.id)}
                                            title="Remove product"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>

                                    <span className="cart-item-meta">
                                        ₹{item.price} · {item.unit}
                                    </span>

                                    <div className="cart-item-bottom-row">
                                        {/* Item Quantity Counter */}
                                        <div className="cart-item-stepper">
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <strong className="cart-item-total-price">
                                            ₹{item.price * item.quantity}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Drawer Summary & Checkout */}
                {cartItems.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-summary-line">
                            <span>Items Total</span>
                            <strong>₹{subtotal}</strong>
                        </div>
                        <div className="cart-summary-line">
                            <span>Local Store Delivery</span>
                            <span className="free-delivery-badge">FREE</span>
                        </div>
                        <div className="cart-summary-line total">
                            <span>Total Payable</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <button
                            type="button"
                            className="btn-checkout-now"
                            onClick={() => {
                                onClose();
                                onProceedToCheckout();
                            }}
                        >
                            Proceed to Checkout <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}