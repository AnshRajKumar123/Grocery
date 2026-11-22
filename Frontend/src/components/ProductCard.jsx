import React from "react";
import { Heart, Plus, TrendingUp } from "lucide-react";

export default function ProductCard({
    product,
    onAddToCart,
    onSelectProduct,
    isWishlisted,
    onToggleWishlist,
    isBestSeller
}) {
    return (
        <article
            className="store-product-card"
            onClick={() => onSelectProduct(product)}
        >
            <div className="product-image-container">
                <img src={product.image} alt={product.name} loading="lazy" />

                {/* Badges Overlay */}
                <div className="card-top-badges">
                    {isBestSeller && (
                        <span className="best-seller-chip">
                            <TrendingUp size={11} /> Top Rated
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className={`wishlist-fab ${isWishlisted ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                    }}
                >
                    <Heart size={16} fill={isWishlisted ? "#ef4444" : "transparent"} color={isWishlisted ? "#ef4444" : "#64748b"} />
                </button>
            </div>

            <div className="product-details-body">
                <span className="product-category-sub">{product.category}</span>
                <h4>{product.name}</h4>
                <p className="product-desc-snippet">{product.description}</p>

                <div className="pricing-action-footer">
                    <div className="price-tag-group">
                        <div>
                            <strong>₹{product.price}</strong>
                            <del>₹{product.mrp}</del>
                        </div>
                        <span className="unit-spec-note">{product.unit}</span>
                    </div>

                    <button
                        type="button"
                        className="btn-add-cart-circle"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        aria-label="Add to cart"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </article>
    );
}