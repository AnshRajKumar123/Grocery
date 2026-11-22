import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // FIX: Required for URL navigation
import "../styles/AuthAndProfile.css";
import { apiService } from "../services/api";
import { 
    User, Mail, Phone, MapPin, Navigation, Plus, X, Check, ArrowLeft, 
    LogOut, Save, Home, Tag, ClipboardList, Bell, Trash2, Package, 
    Truck, CheckCircle2, ArrowRight, XCircle, AlertTriangle 
} from "lucide-react";

export default function ProfilePage({ user, onUpdateUser, onLogout, onBackToStore, onAddToCart, onViewReceipt }) {
    const navigate = useNavigate(); // Hook initialization for routing
    const [activeTab, setActiveTab] = useState("profile");

    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [gender, setGender] = useState(user?.gender || "Male");

    const [street, setStreet] = useState(user?.addresses?.[0]?.street || "");
    const [landmark, setLandmark] = useState(user?.landmark || "");
    const [city, setCity] = useState(user?.addresses?.[0]?.city || "");
    const [pincode, setPincode] = useState(user?.addresses?.[0]?.pincode || "");

    const [showAddExtra, setShowAddExtra] = useState(false);
    const [extraTag, setExtraTag] = useState("");
    const [extraStreet, setExtraStreet] = useState("");
    const [extraLandmark, setExtraLandmark] = useState("");
    const [extraCity, setExtraCity] = useState("");
    const [extraPincode, setExtraPincode] = useState("");

    const [orders, setOrders] = useState([]);
    const [orderFilter, setOrderFilter] = useState("Processing"); 
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState("Changed my mind"); 

    useEffect(() => {
        if (activeTab === "orders") fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await apiService.getOrders(user.email);
            if (res.ok) setOrders(res.data.orders);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) { alert("Please select a reason for cancellation."); return; }

        try {
            const response = await apiService.cancelOrder(cancelOrderId, cancelReason);
            if (response.ok) {
                alert("Order cancelled successfully.");
                setCancelOrderId(null);
                fetchOrders(); 
            } else { 
                alert(response.data.message || "Failed to cancel order."); 
            }
        } catch (error) { 
            alert("Server error cancelling order."); 
        }
    };

    const handleReorder = (orderItems) => {
        orderItems.forEach(item => { onAddToCart(item, item.quantity); });
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
            customerName: name || user.name || "Customer",
            paymentMethod: "Card / UPI (Fast Dispatch)",
            paymentLast4: "8237"
        });
    };

    const handleDetectCurrentLocation = () => {
        if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCity("Chandigarh, Punjab");
                setPincode("160017");
                setLandmark(`GPS Detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                alert("Location coordinates detected! Pincode updated.");
            },
            (error) => alert("Unable to fetch location: " + error.message)
        );
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const updatedAddresses = [...(user?.addresses || [])];
        if (updatedAddresses.length > 0) {
            updatedAddresses[0] = { ...updatedAddresses[0], fullName: name, phone, street, landmark, city, pincode };
        } else if (street && city && pincode) {
            updatedAddresses.push({ id: "addr-primary", tag: "Home", fullName: name, phone, street, landmark, city, pincode, isDefault: true });
        }
        const updatedUser = { ...user, name, email, phone, gender, landmark, addresses: updatedAddresses };

        try {
            const response = await apiService.updateProfile(updatedUser);
            if (response.ok) {
                onUpdateUser(response.data.user);
                alert("Profile details saved securely!");
            } else { alert(response.data.message || "Failed to update profile."); }
        } catch (error) { alert("Server error while saving profile."); }
    };

    const handleAddExtraAddress = async (e) => {
        e.preventDefault();
        if (!extraStreet.trim()) { alert("Please enter street details."); return; }
        const newAddr = { id: "addr-" + Date.now(), tag: extraTag || "Other", fullName: name, phone, street: extraStreet, landmark: extraLandmark, city: extraCity, pincode: extraPincode, isDefault: false };
        const updatedUser = { ...user, addresses: [...(user?.addresses || []), newAddr] };

        try {
            const response = await apiService.updateProfile(updatedUser);
            if (response.ok) {
                onUpdateUser(response.data.user);
                setShowAddExtra(false);
                setExtraStreet(""); setExtraLandmark(""); setExtraTag(""); setExtraCity(""); setExtraPincode("");
                alert("New address added!");
            }
        } catch (error) { alert("Failed to add address."); }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Are you absolutely sure you want to delete your account? This permanently erases all data, addresses, and order history.");
        if (confirmed) {
            try {
                const response = await apiService.deleteAccount(user.email);
                if (response.ok) {
                    alert("Account and data permanently deleted.");
                    onLogout(); 
                } else { alert(response.data.message || "Failed to delete account."); }
            } catch (error) { alert("Server error during account deletion."); }
        }
    };

    const filteredOrders = orders.filter(o => o.status === orderFilter);
    const cancelReasonOptions = ["Changed my mind", "Found a better price", "Ordered by mistake", "Delivery time too long"];

    return (
        <div className="profile-page-canvas">
            <button type="button" className="btn-back-catalog" onClick={onBackToStore} style={{ marginBottom: 20 }}>
                <ArrowLeft size={16} /> Back to Store
            </button>

            <div className="profile-dashboard-layout">
                {/* LEFT SIDEBAR NAVIGATION */}
                <aside className="profile-sidebar">
                    <div className="sidebar-user-summary">
                        <div className="sidebar-avatar">{name ? name.charAt(0).toUpperCase() : "U"}</div>
                        <div className="sidebar-meta">
                            <h4>{name || "User"}</h4>
                            <span>{email}</span>
                        </div>
                    </div>

                    <nav className="sidebar-menu">
                        <button className={`sidebar-menu-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            <User size={18} /> Personal Info & Addresses
                        </button>
                        <button className={`sidebar-menu-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            <ClipboardList size={18} /> Order History & Tracking
                        </button>
                        <button className={`sidebar-menu-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                            <Bell size={18} /> Notifications Hub
                        </button>
                        <div className="sidebar-divider"></div>
                        <button className="sidebar-menu-btn text-danger" onClick={onLogout}>
                            <LogOut size={18} /> Log Out securely
                        </button>
                        <button className="sidebar-menu-btn delete-account-btn" onClick={handleDeleteAccount}>
                            <Trash2 size={18} /> Delete My Account
                        </button>
                    </nav>
                </aside>

                {/* RIGHT MAIN CONTENT AREA */}
                <main className="profile-content-area">
                    {/* TAB: PROFILE & ADDRESS */}
                    {activeTab === 'profile' && (
                        <div className="profile-sections-stack">
                            <form onSubmit={handleSaveProfile} className="profile-panel-card">
                                <div className="panel-card-heading"><h3><User size={18} /> Edit Personal Details</h3></div>
                                <div className="auth-form-cluster">
                                    <div className="input-field-group">
                                        <label>Full Name</label>
                                        <div className="input-wrapper">
                                            <User size={16} className="field-icon" />
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="form-two-col">
                                        <div className="input-field-group">
                                            <label>Email Address</label>
                                            <div className="input-wrapper">
                                                <Mail size={16} className="field-icon" />
                                                <input type="email" value={email} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} />
                                            </div>
                                        </div>
                                        <div className="input-field-group">
                                            <label>Mobile Number</label>
                                            <div className="input-wrapper">
                                                <Phone size={16} className="field-icon" />
                                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-field-group">
                                        <label>Gender</label>
                                        <div className="gender-selector-row">
                                            {["Male", "Female", "Other"].map((g) => (
                                                <label key={g} className={`gender-pill-label ${gender === g ? "selected" : ""}`}>
                                                    <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} />
                                                    {g}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="panel-card-heading" style={{ marginTop: 20 }}>
                                        <h3><MapPin size={18} /> Primary Delivery Address</h3>
                                        <button type="button" className="btn-location-gps" onClick={handleDetectCurrentLocation}>
                                            <Navigation size={13} /> Fetch GPS Location
                                        </button>
                                    </div>
                                    <div className="input-field-group">
                                        <label>House Name / Flat No. / Landmark</label>
                                        <div className="input-wrapper">
                                            <Home size={16} className="field-icon" />
                                            <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near Market Water Tank" />
                                        </div>
                                    </div>
                                    <div className="input-field-group">
                                        <label>Complete Street Address / Locality</label>
                                        <div className="input-wrapper">
                                            <MapPin size={16} className="field-icon" />
                                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="form-two-col">
                                        <div className="input-field-group">
                                            <label>City & State</label>
                                            <input type="text" className="styled-address-input" value={city} onChange={(e) => setCity(e.target.value)} required />
                                        </div>
                                        <div className="input-field-group">
                                            <label>Pincode</label>
                                            <input type="text" className="styled-address-input" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-auth-submit" style={{ marginTop: 12 }}><Save size={16} /> Save Changes</button>
                                </div>
                            </form>

                            <div className="profile-panel-card">
                                <div className="panel-card-heading">
                                    <h3><MapPin size={18} /> Saved Delivery Addresses</h3>
                                    <button type="button" className="btn-location-gps" onClick={() => setShowAddExtra(!showAddExtra)}>
                                        {showAddExtra ? <X size={13} /> : <Plus size={13} />} {showAddExtra ? "Cancel" : "Add New"}
                                    </button>
                                </div>

                                {showAddExtra && (
                                    <form onSubmit={handleAddExtraAddress} className="add-address-card-drawer">
                                        <div className="add-address-title"><Tag size={14} /> Add New Location</div>
                                        <div className="form-two-col">
                                            <input type="text" className="styled-address-input" placeholder="Tag (e.g. Farm, Shop)" value={extraTag} onChange={(e) => setExtraTag(e.target.value)} required />
                                            <input type="text" className="styled-address-input" placeholder="Landmark" value={extraLandmark} onChange={(e) => setExtraLandmark(e.target.value)} />
                                        </div>
                                        <input type="text" className="styled-address-input" placeholder="Street Address" value={extraStreet} onChange={(e) => setExtraStreet(e.target.value)} required />
                                        <div className="form-two-col">
                                            <input type="text" className="styled-address-input" placeholder="City, State" value={extraCity} onChange={(e) => setExtraCity(e.target.value)} required />
                                            <input type="text" className="styled-address-input" placeholder="Pincode" value={extraPincode} onChange={(e) => setExtraPincode(e.target.value)} required />
                                        </div>
                                        <div className="address-form-actions">
                                            <button type="submit" className="btn-save-address-submit"><Check size={14} /> Save Address</button>
                                        </div>
                                    </form>
                                )}

                                <div className="saved-addresses-stack">
                                    {(user?.addresses || []).map((addr, idx) => (
                                        <div key={addr.id || idx} className={`profile-address-tile ${idx === 0 ? "default-addr" : ""}`}>
                                            <div className="address-content-wrap">
                                                <span className="address-tag-pill">{addr.tag || "Address"}</span>
                                                <h5>{addr.fullName || name}</h5>
                                                <p>{addr.street}</p>
                                                {addr.landmark && <span className="address-landmark-tag">Landmark: {addr.landmark}</span>}
                                                <p>{addr.city} - {addr.pincode}</p>
                                                <small>Phone: {addr.phone || phone}</small>
                                            </div>
                                            {idx === 0 && <span className="default-badge">Primary</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: ORDERS */}
                    {activeTab === 'orders' && (
                        <div className="profile-panel-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                {['Processing', 'Completed', 'Cancelled'].map(status => (
                                    <button 
                                        key={status} onClick={() => setOrderFilter(status)}
                                        style={{ flex: 1, padding: '16px', border: 'none', background: 'transparent', borderBottom: orderFilter === status ? '3px solid #0f172a' : '3px solid transparent', fontWeight: orderFilter === status ? 800 : 600, color: orderFilter === status ? '#0f172a' : '#64748b', cursor: 'pointer' }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            
                            <div style={{ padding: 24 }}>
                                {isLoadingOrders ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                        <div style={{ width: 30, height: 30, border: '3px solid #e2e8f0', borderTop: '3px solid #16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                                    </div>
                                ) : filteredOrders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                                        <Package size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                                        <h4>No {orderFilter} Orders</h4>
                                        <p style={{ fontSize: 13 }}>You don't have any {orderFilter.toLowerCase()} orders currently.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        
                                        {filteredOrders.map(order => (
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
                                                            
                                                            {/* FIX: NOW ROUTES DIRECTLY TO THE URL VIA REACT ROUTER */}
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
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB: NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <div className="profile-panel-card">
                            <div className="panel-card-heading"><h3><Bell size={18} /> Notifications Center</h3></div>
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                <Bell size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                                <h4>No New Notifications</h4>
                                <p>We'll alert you here when your orders are dispatched or delivered.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>

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