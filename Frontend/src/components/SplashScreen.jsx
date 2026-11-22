import React from "react";
import { Sprout, ShoppingBag, Truck } from "lucide-react";
import "../styles/SplashScreen.css";
import { WebImage } from "../assets/asset";

export default function SplashScreen() {
    return (
        <div className="splash-screen-container">
            {/* Background Ambient Shapes */}
            <div className="splash-shape splash-shape-1"></div>
            <div className="splash-shape splash-shape-2"></div>

            <div className="splash-content-wrapper">
                {/* 1. Logo Box */}
                <div className="splash-logo-box">
                    <img
                        src={WebImage.WebsiteLogo}
                        alt="Kisan SuperMall"
                        className="splash-brand-image"
                    />
                </div>

                {/* 2. Brand Name & Tagline */}
                <h1 className="splash-brand-title">Kisan SuperMall</h1>
                <p className="splash-brand-tagline">Direct Wholesale & Retail Hub</p>

                {/* 3. Feature Icons Row */}
                <div className="splash-features-row">
                    <div className="splash-feature">
                        <div className="splash-feature-icon-wrap">
                            <Sprout size={22} color="#16a34a" />
                        </div>
                        <span>Agri-Care</span>
                    </div>
                    <div className="splash-feature">
                        <div className="splash-feature-icon-wrap">
                            <ShoppingBag size={22} color="#2563eb" />
                        </div>
                        <span>Wholesale</span>
                    </div>
                    <div className="splash-feature">
                        <div className="splash-feature-icon-wrap">
                            <Truck size={22} color="#d97706" />
                        </div>
                        <span>Fast Delivery</span>
                    </div>
                </div>

                {/* 4. Elegant SVG Loader */}
                <div className="splash-loader-box">
                    <svg className="splash-spinner-ring" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                    </svg>
                    <span className="splash-loading-text">Preparing your store...</span>
                </div>
            </div>

            {/* 5. Footer branding */}
            <div className="splash-footer">
                &copy; {new Date().getFullYear()} Kisan & Parivaar SuperMall
            </div>
        </div>
    );
}