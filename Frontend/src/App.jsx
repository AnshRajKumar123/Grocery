import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import StoreFront from "./components/StoreFront";
import ProductDetails from "./components/ProductDetails";
import CartDrawer from "./components/CartDrawer";
import CheckoutPage from "./components/CheckoutPage";
import ProfilePage from "./components/ProfilePage";
import AuthPage from "./components/AuthPage";
import OrderReceiptSlip from "./components/OrderReceiptSlip";
import WishlistPage from "./components/WishlistPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import TrackOrderPage from "./components/TrackOrderPage";
import SplashScreen from "./components/SplashScreen";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import { apiService } from "./services/api";

// IMPORT SKELETON STYLES GLOBALLY
import "./styles/Skeleton.css"; 

export default function App() {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [activeSection, setActiveSection] = useState("fertilizer");
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('ksm_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [wishlist, setWishlist] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);

    useEffect(() => {
        localStorage.setItem('ksm_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (currentUser) {
            const fetchWishlist = async () => {
                try {
                    const res = await apiService.getWishlist(currentUser.email);
                    if (res.ok) setWishlist(res.data.wishlist);
                } catch (e) {
                    console.error("Failed to load wishlist");
                }
            };
            fetchWishlist();
        } else {
            setWishlist([]); 
        }
    }, [currentUser]);

    const hasSeenSplash = sessionStorage.getItem('ksm_splash_shown') === 'true';
    const [showSplash, setShowSplash] = useState(!hasSeenSplash);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        if (showSplash) {
            const timer = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('ksm_splash_shown', 'true'); 
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [showSplash]);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('ksm_token');
            if (token) {
                try {
                    const response = await apiService.getMe();
                    if (response.ok) {
                        setCurrentUser(response.data.user);
                    } else {
                        localStorage.removeItem('ksm_token');
                        setCurrentUser(null);
                    }
                } catch (error) {
                    localStorage.removeItem('ksm_token');
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
            setIsAuthLoading(false);
        };
        checkAuth();
    }, []);

    const handleAddToCart = (product, count = 1) => {
        if (!currentUser) {
            alert("Please log in or register to add items to your cart.");
            navigate('/auth');
            return;
        }

        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + count } : item
                );
            }
            return [...prevCart, { ...product, quantity: count }];
        });
        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart((prev) => prev.filter((item) => item.id !== productId));
            return;
        }
        setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
    };

    const handleToggleWishlist = async (product) => {
        if (!currentUser) {
            alert("Please log in or register to save items to your wishlist.");
            navigate('/auth');
            return;
        }

        let newWishlist;
        setWishlist((prev) => {
            const isSaved = prev.some((item) => item.id === product.id);
            if (isSaved) {
                newWishlist = prev.filter((item) => item.id !== product.id);
            } else {
                newWishlist = [...prev, product];
            }
            return newWishlist;
        });

        try { await apiService.syncWishlist(currentUser.email, newWishlist); } 
        catch (error) { console.error("Failed to sync wishlist", error); }
    };

    const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (showSplash) return <SplashScreen />;

    // FIX: GLOBAL SKELETON LOADER
    if (isAuthLoading) {
        return (
            <div style={{ padding: '32px', maxWidth: '1240px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div className="skeleton-box" style={{ width: '100%', height: '80px', borderRadius: '16px', marginBottom: '40px' }}></div>
                <div className="skeleton-box" style={{ width: '60%', height: '40px', borderRadius: '8px', marginBottom: '24px' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="skeleton-box" style={{ width: '100%', height: '320px', borderRadius: '16px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    const hideFooterOnRoutes = ['/auth'];
    const showFooter = !hideFooterOnRoutes.includes(location.pathname);

    return (
        <div className="app-root-shell">
            <ScrollToTop />
            
            <Navbar
                activeSection={activeSection}
                setActiveSection={(sec) => { setActiveSection(sec); navigate('/'); }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                cartCount={totalCartCount}
                onOpenCart={() => setIsCartOpen(true)}
                currentUser={currentUser}
                onOpenAuth={() => navigate('/auth')}
                onOpenProfile={() => navigate('/profile')}
                onOpenWishlist={() => navigate('/wishlist')}
                onOpenOrders={() => navigate('/orders')}
                onGoHome={() => navigate('/')}
            />

            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={
                        <StoreFront
                            activeSection={activeSection}
                            searchQuery={searchQuery}
                            onAddToCart={(prod) => handleAddToCart(prod, 1)}
                            onSelectProduct={(prod) => { setSelectedProduct(prod); navigate('/product'); }}
                            wishlist={wishlist}
                            onToggleWishlist={handleToggleWishlist}
                        />
                    } />

                    <Route path="/product" element={
                        selectedProduct ? (
                            <ProductDetails
                                product={selectedProduct}
                                activeSection={activeSection}
                                onBack={() => navigate(-1)}
                                onAddToCart={handleAddToCart}
                                isWishlisted={wishlist.some(w => w.id === selectedProduct.id)}
                                onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
                            />
                        ) : <Navigate to="/" replace />
                    } />

                    <Route path="/auth" element={
                        <AuthPage
                            onLoginSuccess={(userData, token) => {
                                if (token) localStorage.setItem('ksm_token', token);
                                setCurrentUser(userData);
                                navigate('/'); 
                            }}
                            onBackToStore={() => navigate('/')}
                        />
                    } />

                    <Route path="/checkout" element={
                        currentUser ? (
                            <CheckoutPage
                                cartItems={cart}
                                user={currentUser}
                                onBackToCart={() => { navigate(-1); setIsCartOpen(true); }}
                                onOrderPlaced={(orderPayload) => {
                                    setCart([]);
                                    setActiveReceiptOrder(orderPayload);
                                    navigate('/orders');
                                }}
                                onPromptLogin={() => navigate('/auth')}
                            />
                        ) : <Navigate to="/auth" replace />
                    } />

                    <Route path="/profile" element={
                        currentUser ? (
                            <ProfilePage
                                user={currentUser}
                                onUpdateUser={setCurrentUser}
                                onLogout={() => { localStorage.removeItem('ksm_token'); setCurrentUser(null); navigate('/'); }}
                                onBackToStore={() => navigate('/')}
                                onOpenOrders={() => navigate('/orders')}
                                onAddToCart={handleAddToCart}
                                onViewReceipt={setActiveReceiptOrder}
                            />
                        ) : <Navigate to="/auth" replace />
                    } />

                    <Route path="/orders" element={
                        currentUser ? (
                            <OrderHistoryPage
                                onBack={() => navigate('/')}
                                user={currentUser}
                                onAddToCart={handleAddToCart}
                                onViewReceipt={setActiveReceiptOrder} 
                            />
                        ) : <Navigate to="/auth" replace />
                    } />

                    <Route path="/track/:orderId" element={<TrackOrderPage />} />

                    <Route path="/wishlist" element={
                        <WishlistPage
                            wishlistItems={wishlist}
                            onBack={() => navigate('/')}
                            onAddToCart={(prod) => handleAddToCart(prod, 1)}
                            onRemoveFromWishlist={(prod) => handleToggleWishlist(prod)}
                        />
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            {showFooter && <Footer />}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={(id) => setCart(cart.filter((i) => i.id !== id))}
                activeSection={activeSection}
                onProceedToCheckout={() => {
                    setIsCartOpen(false);
                    navigate(currentUser ? '/checkout' : '/auth');
                }}
            />

            {activeReceiptOrder && (
                <OrderReceiptSlip order={activeReceiptOrder} onClose={() => setActiveReceiptOrder(null)} />
            )}
        </div>
    );
}