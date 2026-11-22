import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Package, Truck, Box, ArrowRight, XCircle, AlertTriangle } from "lucide-react";
import { apiService } from "../services/api";
import "../styles/OrderHistoryPage.css";

export default function OrderHistoryPage({ onBack, user, onAddToCart, onViewReceipt }) {
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState("Changed my mind");

    useEffect(() => {
        if (user) fetchRealOrders();
        else setIsLoading(false);
    }, [user]);

    const fetchRealOrders = async () => {
        try {
            const response = await apiService.getOrders(user.email);
            if (response.ok) setOrders(response.data.orders);
        } catch (error) { 
            console.error("Failed to fetch orders"); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) { 
            alert("Please select a reason for cancellation."); 
            return; 
        }

        try {
            const response = await apiService.cancelOrder(cancelOrderId, cancelReason);
            if (response.ok) {
                alert("Order cancelled successfully.");
                setCancelOrderId(null);
                fetchRealOrders(); 
            } else { 
                alert(response.data.message || "Failed to cancel order."); 
            }
        } catch (error) { 
            alert("Server error cancelling order."); 
        }
    };

    const handleReorder = (orderItems) => {
        orderItems.forEach(item => {
            onAddToCart(item, item.quantity);
        });
        alert("Items added to your cart for reorder!");
    };

    const handleViewInvoiceClick = (order) => {
        const date = new Date(order.createdAt);
        const dateFormatted = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()} · ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        onViewReceipt({
            id: order.orderId,
            totalAmount: order.total,
            dateFormatted,
            status: order.status,
            customerName: user?.name || "Customer",
            paymentMethod: order.paymentMethod || "Card / UPI (Fast Dispatch)",
            paymentLast4: order.paymentMethod === "Cash on Delivery" ? "" : "8237"
        });
    };

    const cancelReasonOptions = ["Changed my mind", "Found a better price", "Ordered by mistake", "Delivery time too long"];

    return (
        <div className="orders-page-container">
            <div className="orders-header-row">
                <button onClick={onBack} className="orders-back-btn">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2>My Orders & Tracking</h2>
                    <p>View your past purchases and track active deliveries.</p>
                </div>
            </div>

            {!user ? (
                <div className="orders-empty-state">
                    <Box size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                    <h3>Please Login to View Orders</h3>
                </div>
            ) : isLoading ? (
                /* FIX: SKELETON LOADER FOR ORDERS */
                <div className="orders-content-grid">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton-box" style={{ width: '100%', height: '260px', borderRadius: '16px' }}></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="orders-empty-state">
                    <Package size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet. Start shopping!</p>
                </div>
            ) : (
                <div className="orders-content-grid">
                    <div className="order-list-container">
                        {orders.map((order) => (
                            <div key={order._id} className="order-history-card">
                                <div className="order-card-header">
                                    <div className="order-meta">
                                        <strong>Order #{order.orderId}</strong>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`order-status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-card-body">
                                    <div className="order-itemized-list">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="order-item-row">
                                                <div className="order-item-img-box">
                                                    <img src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100"} alt={item.name} />
                                                </div>
                                                <div className="order-item-details">
                                                    <h5>{item.name}</h5>
                                                    <span>Qty: {item.quantity} × ₹{item.price}</span>
                                                </div>
                                                <strong className="order-item-total">₹{item.price * item.quantity}</strong>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="order-summary-totals">
                                        <p className="delivery-est">Est. Delivery: {order.deliveryEstimate || "Processing"}</p>
                                        <strong>Total Paid: ₹{order.total}</strong>
                                    </div>
                                </div>

                                <div className="order-card-footer">
                                    <button className="btn-view-receipt" onClick={() => handleViewInvoiceClick(order)}>
                                        View Invoice
                                    </button>
                                    
                                    {order.status === "Processing" || order.status === "In Transit" ? (
                                        <div style={{display: 'flex', gap: '10px', marginLeft: 'auto'}}>
                                            <button className="btn-cancel-order" onClick={() => setCancelOrderId(order.orderId)}>
                                                <XCircle size={16} /> Cancel Order
                                            </button>
                                            
                                            <button className="btn-track-package" onClick={() => navigate(`/track/${order.orderId}`)}>
                                                <Truck size={16} /> Track Package
                                            </button>
                                        </div>
                                    ) : order.status === "Completed" || order.status === "Delivered" ? (
                                        <button className="btn-reorder" onClick={() => handleReorder(order.items)}>
                                            Reorder Items <ArrowRight size={14} />
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cancellation Popup Modal */}
            {cancelOrderId && (
                <div className="cancel-modal-backdrop">
                    <div className="cancel-modal-card">
                        <div className="cancel-icon-head"><AlertTriangle size={32} color="#ef4444" /></div>
                        <h3>Cancel Order #{cancelOrderId}</h3>
                        <p>Are you sure you want to cancel this order? Please select a reason below.</p>
                        
                        <div className="cancel-reason-radio-group">
                            {cancelReasonOptions.map(reason => (
                                <label key={reason} className={`cancel-radio-label ${cancelReason === reason ? 'selected' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="cancelReason" 
                                        value={reason} 
                                        checked={cancelReason === reason} 
                                        onChange={(e) => setCancelReason(e.target.value)} 
                                    />
                                    {reason}
                                </label>
                            ))}
                        </div>

                        <div className="cancel-actions">
                            <button className="btn-abort-cancel" onClick={() => setCancelOrderId(null)}>Keep Order</button>
                            <button className="btn-confirm-cancel" onClick={handleCancelOrder}>Confirm Cancellation</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}