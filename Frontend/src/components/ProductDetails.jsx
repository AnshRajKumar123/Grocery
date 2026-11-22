import React, { useState } from "react";
import "../styles/ProductDetails.css";
import {
    ArrowLeft,
    ShoppingBag,
    Star,
    ShieldCheck,
    Truck,
    RotateCcw,
    Heart,
    ThumbsUp,
    MessageCircle
} from "lucide-react";

export default function ProductDetails({
    product,
    activeSection,
    onBack,
    onAddToCart,
    isWishlisted,
    onToggleWishlist
}) {
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    const handleCartAdd = () => {
        onAddToCart(product, quantity);
    };

    // Dummy review data generated dynamically based on the product
    const mockReviews = [
        {
            id: 1,
            user: "Rahul S.",
            rating: 5,
            date: "2 days ago",
            comment: `Absolutely brilliant quality! I was skeptical at first, but the ${product.name} exceeded my expectations. Packaging was totally sealed and authentic.`,
            verified: true,
            helpful: 24
        },
        {
            id: 2,
            user: "Priya M.",
            rating: 4,
            date: "1 week ago",
            comment: `Good product for the price. Delivery was super fast via local dispatch. Will definitely order from Kisan SuperMall again.`,
            verified: true,
            helpful: 8
        },
        {
            id: 3,
            user: "Amit K.",
            rating: 5,
            date: "3 weeks ago",
            comment: `Highly recommended! The wholesale pricing makes a huge difference. I've bought ${product.category} items from other places, but this is top-tier.`,
            verified: true,
            helpful: 41
        }
    ];

    return (
        <div className={`details-page-canvas theme-${activeSection}`}>
            {/* Action Bar */}
            <div className="details-action-bar">
                <button type="button" className="btn-back-catalog" onClick={onBack}>
                    <ArrowLeft size={16} /> Back to Catalog
                </button>
            </div>

            {/* Main Product Split Grid */}
            <div className="product-details-grid">
                {/* Left Side: Clean Visual Showcase */}
                <div className="details-image-showcase">
                    <img src={product.image} alt={product.name} />
                </div>

                {/* Right Side: Information & Purchase */}
                <div className="details-info-panel">
                    <div className="details-header-meta">
                        <span className="dept-category">{product.category}</span>
                        <h2>{product.name}</h2>
                        
                        <div className="details-rating-strip">
                            <span className="rating-badge">
                                {product.rating || "4.8"} <Star size={12} fill="#ffffff" stroke="none" /> 
                            </span>
                            <span className="rating-count-text">({Math.floor(Math.random() * (900 - 150 + 1) + 150)} Verified Ratings)</span>
                        </div>
                    </div>

                    <div className="details-pricing-deck">
                        <div className="main-price-row">
                            <span className="current-price">₹{product.price}</span>
                            <del>₹{product.mrp}</del>
                            {discountPercent > 0 && (
                                <span className="discount-tag">{discountPercent}% OFF</span>
                            )}
                        </div>
                        <p className="inclusive-tax-note">Inclusive of all taxes</p>
                    </div>

                    <div className="details-divider"></div>

                    <div className="product-description-block">
                        <h3>About this item</h3>
                        <p>{product.description}</p>
                    </div>

                    {/* Specifications Grid */}
                    <div className="details-highlights-grid">
                        <div className="highlight-item">
                            <span className="hl-label">Package Size</span>
                            <span className="hl-value">{product.unit}</span>
                        </div>
                        <div className="highlight-item">
                            <span className="hl-label">Dispatch Method</span>
                            <span className="hl-value">Direct Local Hub</span>
                        </div>
                        <div className="highlight-item">
                            <span className="hl-label">Verification</span>
                            <span className="hl-value">100% Authentic</span>
                        </div>
                        <div className="highlight-item">
                            <span className="hl-label">Product ID</span>
                            <span className="hl-value">{product.id.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="details-divider"></div>

                    {/* Purchase Controls */}
                    <div className="purchase-controls-row">
                        <div className="modern-qty-selector">
                            <span className="qty-label">Qty:</span>
                            <select 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="qty-dropdown"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="btn-detail-add-cart"
                            onClick={handleCartAdd}
                        >
                            <ShoppingBag size={18} /> Add to Cart — ₹{product.price * quantity}
                        </button>

                        <button 
                            type="button" 
                            className={`btn-detail-wishlist ${isWishlisted ? 'saved' : ''}`}
                            onClick={() => onToggleWishlist(product)}
                            title="Add to Wishlist"
                        >
                            <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                    </div>

                    {/* Guarantees */}
                    <div className="details-trust-strip">
                        <div className="trust-badge-item">
                            <div className="trust-icon"><Truck size={16} /></div>
                            <span>Express Delivery</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-icon"><ShieldCheck size={16} /></div>
                            <span>Quality Assured</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-icon"><RotateCcw size={16} /></div>
                            <span>Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Real Customer Feedback */}
            <div className="product-feedback-section">
                <div className="feedback-header">
                    <h3>Customer Ratings & Reviews</h3>
                    <button className="btn-write-review">
                        <MessageCircle size={16} /> Write a Review
                    </button>
                </div>

                <div className="reviews-grid">
                    {mockReviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-card-header">
                                <div className="reviewer-avatar">
                                    {review.user.charAt(0)}
                                </div>
                                <div className="reviewer-meta">
                                    <strong>{review.user}</strong>
                                    {review.verified && <span className="verified-buyer">Verified Buyer</span>}
                                </div>
                                <span className="review-date">{review.date}</span>
                            </div>
                            
                            <div className="review-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={14} 
                                        fill={i < review.rating ? "#f59e0b" : "#e2e8f0"} 
                                        color={i < review.rating ? "#f59e0b" : "#e2e8f0"} 
                                    />
                                ))}
                            </div>
                            
                            <p className="review-body-text">{review.comment}</p>
                            
                            <div className="review-helpful-action">
                                <button className="btn-helpful">
                                    <ThumbsUp size={14} /> Helpful ({review.helpful})
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}