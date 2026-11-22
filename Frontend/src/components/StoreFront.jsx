import React, { useState, useEffect, useMemo } from "react";
import "../styles/StoreFront.css";
import ProductCard from "./ProductCard";
import { SECTIONS_DATA, PRODUCTS_CATALOG } from "../assets/asset";
import { Sparkles, ShieldCheck, Tag, Truck, Award } from "lucide-react";

export default function StoreFront({ activeSection, searchQuery, onAddToCart, onSelectProduct, wishlist, onToggleWishlist }) {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate Network Load for Skeletons
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // 800ms simulated load
        return () => clearTimeout(timer);
    }, [activeSection]);

    const currentSectionMeta = SECTIONS_DATA.find((s) => s.id === activeSection);
    const currentProducts = PRODUCTS_CATALOG[activeSection] || [];

    const filteredProducts = currentProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const bestSellers = useMemo(() => {
        return currentProducts
            .filter((p) => (p.soldCount || 0) > 150)
            .sort((a, b) => b.soldCount - a.soldCount);
    }, [currentProducts]);

    return (
        <div className={`storefront-canvas theme-${activeSection}`}>
            <section className="hero-category-banner">
                <div className="hero-banner-inner">
                    <div className="hero-text-block">
                        <span className="hero-badge-pill">
                            <Sparkles size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
                            {currentSectionMeta?.badge}
                        </span>
                        <h2>{currentSectionMeta?.title}</h2>
                        <p>{currentSectionMeta?.subtitle}</p>

                        <div className="hero-benefits-strip">
                            <span className="hero-benefit-item"><Truck size={14} /> Direct Doorstep Delivery</span>
                            <span className="hero-benefit-item"><Tag size={14} /> Wholesale Bulk Margins</span>
                            <span className="hero-benefit-item"><ShieldCheck size={14} /> 100% Sealed Packaging</span>
                        </div>
                    </div>
                </div>
            </section>

            {!searchQuery && bestSellers.length > 2 && (
                <section className="best-seller-showcase">
                    <div className="section-headline-bar">
                        <div className="headline-title-block">
                            <div className="headline-icon-box"><Award size={20} /></div>
                            <div>
                                <h3>Weekly Best Sellers</h3>
                                <span>Most demanded products in your area this week</span>
                            </div>
                        </div>
                    </div>
                    <div className="horizontal-product-scroller">
                        {isLoading ? (
                            [1, 2, 3, 4].map(n => (
                                <div className="scroller-card-wrapper" key={n}>
                                    <div className="skeleton-box" style={{ width: '100%', height: '380px', borderRadius: '16px' }}></div>
                                </div>
                            ))
                        ) : (
                            bestSellers.map((prod) => (
                                <div className="scroller-card-wrapper" key={`bs-${prod.id}`}>
                                    <ProductCard
                                        product={prod}
                                        onAddToCart={onAddToCart}
                                        onSelectProduct={onSelectProduct}
                                        isWishlisted={wishlist.some(w => w.id === prod.id)}
                                        onToggleWishlist={onToggleWishlist}
                                        isBestSeller={true}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}

            <main className="catalog-content-section">
                <div className="section-headline-bar">
                    <div>
                        <h3>Complete Inventory</h3>
                        <span>Wholesale and retail prices with same-day local dispatch</span>
                    </div>
                    {!isLoading && <span className="catalog-count-badge">{filteredProducts.length} Items</span>}
                </div>

                {isLoading ? (
                    <div className="product-grid-display">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="skeleton-box" style={{ width: '100%', height: '380px', borderRadius: '16px' }}></div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="catalog-empty-view">
                        <h4>No items match "{searchQuery}"</h4>
                        <p>Try searching with another keyword or explore other departments.</p>
                    </div>
                ) : (
                    <div className="product-grid-display">
                        {filteredProducts.map((prod) => {
                            const isBS = (prod.soldCount || 0) > 150;
                            return (
                                <ProductCard
                                    key={prod.id}
                                    product={prod}
                                    onAddToCart={onAddToCart}
                                    onSelectProduct={onSelectProduct}
                                    isWishlisted={wishlist.some(w => w.id === prod.id)}
                                    onToggleWishlist={onToggleWishlist}
                                    isBestSeller={isBS}
                                />
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}