const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

const getAuthHeaders = () => {
    const token = localStorage.getItem('ksm_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const apiService = {
    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },
    
    getMe: async () => {
        const res = await fetch(`${BASE_URL}/auth/me`, { method: 'GET', headers: getAuthHeaders() });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    sendRegisterOtp: async (email) => {
        const res = await fetch(`${BASE_URL}/auth/send-register-otp`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    register: async (userData) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData)
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    updateProfile: async (userData) => {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(userData)
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    deleteAccount: async (email) => {
        const res = await fetch(`${BASE_URL}/auth/account`, {
            method: 'DELETE', headers: getAuthHeaders(), body: JSON.stringify({ email })
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    createOrder: async (orderData) => {
        const res = await fetch(`${BASE_URL}/auth/orders`, { 
            method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(orderData)
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    getOrders: async (email) => {
        const res = await fetch(`${BASE_URL}/auth/orders/${email}`, { method: 'GET', headers: getAuthHeaders() });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    cancelOrder: async (orderId, reason) => {
        const res = await fetch(`${BASE_URL}/auth/orders/${orderId}/cancel`, { 
            method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ reason }) 
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    getWishlist: async (email) => {
        const res = await fetch(`${BASE_URL}/auth/wishlist/${email}`, { method: 'GET', headers: getAuthHeaders() });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    syncWishlist: async (userEmail, items) => {
        const res = await fetch(`${BASE_URL}/auth/wishlist`, { 
            method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ userEmail, items }) 
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    trackSingleOrder: async (orderId) => {
        const res = await fetch(`${BASE_URL}/auth/orders/track/${orderId}`, { method: 'GET', headers: getAuthHeaders() });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    confirmCodOrder: async (orderId) => {
        const res = await fetch(`${BASE_URL}/auth/orders/${orderId}/confirm-cod`, { method: 'PUT', headers: getAuthHeaders() });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    // ==========================================
    // RAZORPAY API METHODS
    // ==========================================
    createRazorpayOrder: async (amount) => {
        const res = await fetch(`${BASE_URL}/auth/razorpay/create-order`, {
            method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ amount })
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    },

    verifyRazorpayPayment: async (paymentData) => {
        const res = await fetch(`${BASE_URL}/auth/razorpay/verify-payment`, {
            method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(paymentData)
        });
        return { ok: res.ok, status: res.status, data: await res.json() };
    }
};