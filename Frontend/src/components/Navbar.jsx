import React, { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";
import { STORE_INFO, SECTIONS_DATA, WebImage } from "../assets/asset";
import {
    ShoppingBag,
    Search,
    User,
    LogIn,
    ChevronDown,
    Heart,
    Bell,
    Headphones,
    Menu,
    Home,
    Package,
    ClipboardList,
    MapPin
} from "lucide-react";

export default function Navbar({
    activeSection,
    setActiveSection,
    searchQuery,
    setSearchQuery,
    cartCount,
    onOpenCart,
    currentUser,
    onOpenAuth,
    onOpenProfile,
    onOpenWishlist,
    onOpenOrders,
    onOpenNotifications,
    onOpenCustomerService,
    onGoHome
}) {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    const currentSectionMeta = SECTIONS_DATA.find((s) => s.id === activeSection);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setIsUserDropdownOpen(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="master-header">
            {/* Desktop & Tablet Main Unified Navbar */}
            <div className="main-nav-bar">
                {/* Left Side: Category Dropdown & Logo/Name */}
                <div className="nav-left-cluster">
                    {/* Logo & Kisan SuperMall Brand */}
                    <div className="brand-identity" onClick={onGoHome} style={{ cursor: "pointer" }}>
                        <div className="brand-logo-frame">
                            <img
                                src={WebImage.WebsiteLogo}
                                alt="Kisan SuperMall Logo"
                                className="brand-logo-img"
                            />
                        </div>
                        <div className="brand-text-col">
                            <h1>Kisan SuperMall</h1>
                            <p>Direct Wholesale & Retail Hub</p>
                        </div>
                    </div>
                </div>

                {/* Middle: Search Box */}
                <div className="nav-search-box">
                    <Search size={16} color="#64748b" />
                    <input
                        type="text"
                        placeholder={`Search ${currentSectionMeta?.title || "products"} across Kisan SuperMall...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Right Side: User Menu / Login & Cart */}
                <div className="nav-right-cluster">

                    {/* User Profile Dropdown or Sign In Button */}

                    {currentUser ? (
                        <div className="user-dropdown-container" ref={userDropdownRef}>
                            <button
                                type="button"
                                className="user-menu-trigger-btn"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            >
                                <div className="user-avatar-badge">
                                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="user-display-name">
                                    {currentUser.name ? currentUser.name.split(" ")[0] : "Account"}
                                </span>
                                <ChevronDown size={14} className={isUserDropdownOpen ? "rotated" : ""} />
                            </button>

                            {isUserDropdownOpen && (
                                <div className="user-dropdown-popover">
                                    <div className="user-popover-header">
                                        <strong>{currentUser.name}</strong>
                                        <small>{currentUser.phone || currentUser.email || "Verified Member"}</small>
                                    </div>
                                    <div className="user-popover-links">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onOpenProfile();
                                                setIsUserDropdownOpen(false);
                                            }}
                                        >
                                            <User size={15} /> Profile Settings
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onOpenWishlist) onOpenWishlist();
                                                setIsUserDropdownOpen(false);
                                            }}
                                        >
                                            <Heart size={15} /> My Wishlist
                                        </button>

                                        <button type="button" className="mobile-nav-item" onClick={() => { if (onOpenOrders) onOpenOrders(); }}>
                                            <ClipboardList size={20} /><span>Orders</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onOpenNotifications) onOpenNotifications();
                                                setIsUserDropdownOpen(false);
                                            }}
                                        >
                                            <Bell size={15} /> Notifications
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onOpenCustomerService) onOpenCustomerService();
                                                setIsUserDropdownOpen(false);
                                            }}
                                        >
                                            <Headphones size={15} /> Customer Service
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="auth-signin-btn"
                            onClick={onOpenAuth}
                        >
                            <LogIn size={16} />
                            <span>Login / Sign In</span>
                        </button>
                    )}


                    {/* Category Dropdown */}
                    <div className="category-dropdown-wrapper" ref={categoryDropdownRef}>
                        <button
                            type="button"
                            className="category-dropdown-trigger"
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        >
                            <Menu size={18} />
                            <span>Categories</span>
                            <ChevronDown size={14} className={isCategoryDropdownOpen ? "rotated" : ""} />
                        </button>

                        {isCategoryDropdownOpen && (
                            <div className="category-dropdown-menu">
                                {SECTIONS_DATA.map((sec) => (
                                    <button
                                        key={sec.id}
                                        type="button"
                                        className={`category-dropdown-item ${activeSection === sec.id ? "active" : ""}`}
                                        onClick={() => {
                                            setActiveSection(sec.id);
                                            setSearchQuery("");
                                            onGoHome();
                                            setIsCategoryDropdownOpen(false);
                                        }}
                                    >
                                        <Package size={15} />
                                        <span>{sec.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Button */}
                    <button
                        type="button"
                        className="cart-indicator-btn"
                        aria-label="Open Shopping Cart"
                        onClick={onOpenCart}
                    >
                        <ShoppingBag size={18} />
                        <span className="cart-text-label">Cart</span>
                        <span className="cart-count-badge">{cartCount}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Responsive Top Header */}
            <div className="mobile-top-header">
                <div className="mobile-top-row">
                    <div className="brand-identity" onClick={onGoHome} style={{ cursor: "pointer" }}>
                        <img
                            src={WebImage.WebsiteLogo}
                            alt="Logo"
                            className="brand-logo-img"
                        />
                        <h1>Kisan SuperMall</h1>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            type="button"
                            className="mobile-icon-action-btn"
                            onClick={onOpenCart}
                            aria-label="Cart"
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
                        </button>
                    </div>
                </div>
                {/* Mobile Search Bar */}
                <div className="mobile-search-box">
                    <Search size={15} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search Kisan SuperMall products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="mobile-bottom-navbar" aria-label="Mobile Navigation">
                <button
                    type="button"
                    className="mobile-nav-item active"
                    onClick={onGoHome}
                >
                    <Home size={20} />
                    <span>Home</span>
                </button>
                <button
                    type="button"
                    className="mobile-nav-item"
                    onClick={() => {
                        if (onOpenWishlist) onOpenWishlist();
                    }}
                >
                    <Heart size={20} />
                    <span>Wishlist</span>
                </button>
                <button
                    type="button"
                    className="mobile-nav-item cart-center-fab"
                    onClick={onOpenCart}
                >
                    <div className="fab-circle">
                        <ShoppingBag size={20} color="#fff" />
                        {cartCount > 0 && <span className="fab-count">{cartCount}</span>}
                    </div>
                    <span>Cart</span>
                </button>
                <button
                    type="button"
                    className="mobile-nav-item"
                    onClick={() => {
                        if (onOpenNotifications) onOpenNotifications();
                    }}
                >
                    <Bell size={20} />
                    <span>Alerts</span>
                </button>
                <button
                    type="button"
                    className="mobile-nav-item"
                    onClick={() => {
                        if (currentUser) {
                            onOpenProfile();
                        } else {
                            onOpenAuth();
                        }
                    }}
                >
                    <User size={20} />
                    <span>{currentUser ? "Profile" : "Login"}</span>
                </button>
            </nav>
        </header>
    );
}