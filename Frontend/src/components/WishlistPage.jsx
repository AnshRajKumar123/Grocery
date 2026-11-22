import React from "react";
import ProductCard from "./ProductCard";
import { HeartCrack, ChevronLeft } from "lucide-react";
import "../styles/WishlistPage.css";

export default function WishlistPage({ wishlistItems, onBack, onAddToCart, onRemoveFromWishlist }) {
    return (
        <div className="wishlist-page-container">
            <div className="wishlist-header-row">
                <button onClick={onBack} className="wishlist-back-btn">
                    <ChevronLeft size={20} />
                </button>
                <h2>My Wishlist</h2>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="wishlist-empty-state">
                    <HeartCrack size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love to shop them later.</p>
                </div>
            ) : (
                <div className="product-grid-display">
                    {wishlistItems.map((prod) => (
                        <ProductCard
                            key={prod.id}
                            product={prod}
                            onAddToCart={onAddToCart}
                            onSelectProduct={() => { }} 
                            isWishlisted={true}
                            onToggleWishlist={onRemoveFromWishlist}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}