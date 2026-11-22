import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Truck, Headphones, CreditCard, Mail, Package, User } from "lucide-react";
import "../styles/Footer.css";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="store-footer">
            <div className="footer-inner-container">
                
                {/* 1. Premium Value Proposition Strip */}
                <div className="footer-features-strip">
                    <div className="footer-feature-box">
                        <div className="feature-icon-wrap bg-blue"><Truck size={24} color="#3b82f6" /></div>
                        <div className="footer-feature-text">
                            <h4>Lightning Fast Dispatch</h4>
                            <span>Direct local hub delivery under 40 mins.</span>
                        </div>
                    </div>
                    <div className="footer-feature-box">
                        <div className="feature-icon-wrap bg-green"><ShieldCheck size={24} color="#10b981" /></div>
                        <div className="footer-feature-text">
                            <h4>100% Genuine Quality</h4>
                            <span>Govt. authorized & sealed packaging.</span>
                        </div>
                    </div>
                    <div className="footer-feature-box">
                        <div className="feature-icon-wrap bg-yellow"><Headphones size={24} color="#f59e0b" /></div>
                        <div className="footer-feature-text">
                            <h4>24/7 Dedicated Support</h4>
                            <span>Farmer & Kirana merchant helplines.</span>
                        </div>
                    </div>
                </div>

                {/* 2. Main Navigation & Newsletter Grid */}
                <div className="footer-main-grid">
                    
                    {/* Brand & Newsletter */}
                    <div className="footer-brand-col">
                        <h3 className="footer-brand-title">Kisan SuperMall</h3>
                        <p className="footer-brand-desc">
                            Your direct wholesale link to premium fertilizers, daily kirana essentials, and luxury beauty products.
                        </p>
                        
                        <div className="newsletter-box">
                            <label>Subscribe for Wholesale Deals</label>
                            <div className="newsletter-input-group">
                                <Mail size={16} className="mail-icon" />
                                <input type="email" placeholder="Enter your email address" />
                                <button type="button">Join</button>
                            </div>
                        </div>

                        <div className="social-links-row">
                            <button className="social-btn" aria-label="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </button>
                            <button className="social-btn" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </button>
                            <button className="social-btn" aria-label="Twitter">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="footer-nav-col">
                        <h4>My Account</h4>
                        <ul>
                            <li onClick={() => navigate('/profile')}>
                                <User size={14}/> Profile & Addresses
                            </li>
                            <li onClick={() => navigate('/orders')}>
                                <Package size={14}/> Track My Orders
                            </li>
                            <li onClick={() => navigate('/wishlist')}>
                                Saved Wishlist
                            </li>
                            <li onClick={() => {
                                window.scrollTo({top: 0, behavior: 'smooth'});
                            }}>
                                View Shopping Bag
                            </li>
                        </ul>
                    </div>

                    <div className="footer-nav-col">
                        <h4>Departments</h4>
                        <ul>
                            <li onClick={() => navigate('/')}>Agri-Care & Fertilizers</li>
                            <li onClick={() => navigate('/')}>Kirana & Staples</li>
                            <li onClick={() => navigate('/')}>Beauty & Cosmetics</li>
                        </ul>
                    </div>

                    <div className="footer-nav-col">
                        <h4>Legal & Support</h4>
                        <ul>
                            <li>Store Policies</li>
                            <li>Wholesale Inquiry</li>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                            <li>Help Center</li>
                        </ul>
                    </div>
                </div>

                {/* 3. Bottom Legal Bar */}
                <div className="footer-bottom-bar">
                    <div className="footer-copyright">
                        © {new Date().getFullYear()} Kisan & Parivaar SuperMall. All rights reserved.<br/>
                        <small>GSTIN: 03AAAAA0000A1Z5 | FSSAI: 12345678901234</small>
                    </div>
                    <div className="footer-secure-badges">
                        <span className="secure-badge"><ShieldCheck size={14}/> SSL Secured</span>
                        <span className="secure-badge"><CreditCard size={14}/> Official Payment Gateways</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}