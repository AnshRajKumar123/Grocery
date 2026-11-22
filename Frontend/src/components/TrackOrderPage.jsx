import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { ArrowLeft, MapPin, Truck, CheckCircle2, Package, Phone, Star, Clock, AlertCircle } from "lucide-react";
import "../styles/TrackOrderPage.css";

export default function TrackOrderPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    
    // Live Timer State to trigger re-renders every 10 seconds
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await apiService.trackSingleOrder(orderId);
                if (res.ok) setOrder(res.data.order);
                else setErrorMsg(res.data.message || "Order not found");
            } catch (error) {
                setErrorMsg("Failed to connect to the tracking server.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // Update the current time every 10 seconds to drive the live animations
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center' }}>
                <div className="tracking-spinner" style={{ width: 44, height: 44, border: '4px solid #e2e8f0', borderTop: '4px solid #16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="track-page-container error-state">
                <AlertCircle size={48} color="#ef4444" />
                <h3>{errorMsg || "Order not found or invalid ID."}</h3>
                <button onClick={() => navigate(-1)} className="btn-back-track"><ArrowLeft size={16} /> Go Back</button>
            </div>
        );
    }

    // ==========================================
    // REAL-TIME DELIVERY CALCULATION ENGINE
    // ==========================================
    let derivedStatus = order.status;
    let progressPercent = 0;
    let liveEtaText = "Calculating...";
    let isDelivered = false;

    if (order.status !== 'Cancelled') {
        const createdAt = new Date(order.createdAt);
        const elapsedMins = (currentTime - createdAt) / 60000;
        
        let totalDuration = 35; // Standard default
        if (order.deliveryType === 'Fast') totalDuration = 25;

        // Schedule Logic (Simplified)
        if (order.deliveryType === 'Schedule' && order.scheduledDate && order.scheduledTime) {
            const scheduledTarget = new Date(`${order.scheduledDate}T${order.scheduledTime}`);
            const minsToTarget = (scheduledTarget - currentTime) / 60000;

            if (minsToTarget > 60) {
                derivedStatus = 'Processing';
                progressPercent = 10;
                liveEtaText = `Scheduled for ${order.scheduledDate} at ${order.scheduledTime}`;
            } else if (minsToTarget > 0) {
                derivedStatus = 'In Transit';
                progressPercent = Math.min(95, Math.max(15, 100 - ((minsToTarget / 60) * 100)));
                liveEtaText = `Arriving in approx. ${Math.ceil(minsToTarget)} mins`;
            } else {
                derivedStatus = 'Delivered';
                progressPercent = 100;
                isDelivered = true;
                liveEtaText = "Delivered Successfully";
            }
        } else {
            // Standard & Fast Logic
            if (elapsedMins >= totalDuration) {
                derivedStatus = 'Delivered';
                progressPercent = 100;
                isDelivered = true;
                liveEtaText = "Delivered Successfully";
            } else if (elapsedMins >= 5) {
                derivedStatus = 'In Transit';
                // Calculate progress between 15% and 95%
                progressPercent = 15 + ((elapsedMins - 5) / (totalDuration - 5)) * 80;
                const remaining = Math.ceil(totalDuration - elapsedMins);
                liveEtaText = `Arriving in ${remaining} mins`;
            } else {
                derivedStatus = 'Processing';
                progressPercent = (elapsedMins / 5) * 15; // 0 to 15%
                liveEtaText = `Preparing your order...`;
            }
        }
    } else {
        liveEtaText = "Order Cancelled";
    }

    const displayStatus = order.status === 'Cancelled' ? 'Cancelled' : derivedStatus;

    return (
        <div className="track-page-container">
            <button onClick={() => navigate(-1)} className="btn-back-track">
                <ArrowLeft size={16} /> Back to Orders
            </button>

            <div className="track-header-block">
                <div className="track-header-left">
                    <h2>Live Tracking</h2>
                    <p>Order #{order.orderId} • Placed {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <span className={`live-status-pill ${displayStatus.toLowerCase().replace(" ", "-")}`}>
                    {displayStatus === 'In Transit' ? <span className="pulse-dot"></span> : null}
                    {displayStatus}
                </span>
            </div>

            <div className="track-dashboard-grid">
                
                {/* LEFT COLUMN: Map & Timeline */}
                <div className="track-main-flow">
                    
                    {/* Live Progress Map Engine */}
                    <div className="live-map-card">
                        <div className="map-eta-header">
                            <Clock size={20} color={isDelivered ? "#16a34a" : "#2563eb"} />
                            <div>
                                <h3>{liveEtaText}</h3>
                                <span>{order.deliveryType} Delivery</span>
                            </div>
                        </div>

                        <div className="progress-track-wrapper">
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            
                            <div className="progress-nodes">
                                <div className={`node origin ${progressPercent >= 0 ? 'active' : ''}`}>
                                    <Package size={14} />
                                </div>
                                <div className={`node destination ${isDelivered ? 'active' : ''}`}>
                                    <MapPin size={14} />
                                </div>
                            </div>

                            {displayStatus !== 'Cancelled' && !isDelivered && (
                                <div className="live-truck-marker" style={{ left: `calc(${progressPercent}% - 20px)` }}>
                                    <Truck size={18} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Driver Card */}
                    {displayStatus !== 'Cancelled' && (
                        <div className="driver-courier-card">
                            <div className="driver-avatar-circle">
                                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop" alt="Driver" />
                            </div>
                            <div className="driver-info">
                                <strong>Rajeev Kumar</strong>
                                <span>Kisan SuperMall Delivery Partner</span>
                                <div className="driver-rating">
                                    4.9 <Star size={12} fill="#f59e0b" color="#f59e0b" /> • 1,240 Deliveries
                                </div>
                            </div>
                            <button className="btn-call-driver">
                                <Phone size={18} /> Call
                            </button>
                        </div>
                    )}

                    {/* Timeline Log */}
                    <div className="timeline-log-card">
                        <h3>Order Updates</h3>
                        <div className="timeline-log-list">
                            <div className={`log-step ${progressPercent >= 0 ? 'active' : ''}`}>
                                <div className="log-marker"><CheckCircle2 size={16} /></div>
                                <div className="log-content">
                                    <strong>Order Confirmed</strong>
                                    <span>Your order has been received and verified.</span>
                                </div>
                            </div>
                            <div className={`log-step ${progressPercent >= 15 ? 'active' : ''}`}>
                                <div className="log-marker"><Package size={16} /></div>
                                <div className="log-content">
                                    <strong>Preparing Order</strong>
                                    <span>Items are being packed securely at the local hub.</span>
                                </div>
                            </div>
                            <div className={`log-step ${displayStatus === 'In Transit' || isDelivered ? 'active' : ''}`}>
                                <div className="log-marker"><Truck size={16} /></div>
                                <div className="log-content">
                                    <strong>Out for Delivery</strong>
                                    <span>Driver is on the way to your address.</span>
                                </div>
                            </div>
                            <div className={`log-step ${isDelivered ? 'active' : ''}`}>
                                <div className="log-marker"><MapPin size={16} /></div>
                                <div className="log-content">
                                    <strong>Delivered</strong>
                                    <span>Package successfully handed over.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Order Receipt Summary */}
                <div className="track-receipt-sidebar">
                    <div className="receipt-slip-card">
                        <div className="receipt-head">
                            <h3>Order Summary</h3>
                            <span>#{order.orderId}</span>
                        </div>

                        <div className="receipt-items-scroll">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="receipt-item-row">
                                    <div className="receipt-item-qty">{item.quantity}x</div>
                                    <div className="receipt-item-name">{item.name}</div>
                                    <div className="receipt-item-price">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className="receipt-calculations">
                            <div className="calc-row">
                                <span>Subtotal</span>
                                <span>₹{order.total - (order.deliveryFee || 0)}</span>
                            </div>
                            <div className="calc-row">
                                <span>Delivery Fee ({order.deliveryType})</span>
                                <span>{order.deliveryFee ? `₹${order.deliveryFee}` : 'FREE'}</span>
                            </div>
                            <div className="calc-row grand-total">
                                <span>Total Paid</span>
                                <span>₹{order.total}</span>
                            </div>
                        </div>
                        
                        <div className="receipt-footer-meta">
                            Payment: <strong>{order.paymentMethod || "Card"}</strong>
                            <br/>
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}