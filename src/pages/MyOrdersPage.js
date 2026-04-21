// src/pages/MyOrdersPage.js - FIXED FOR SESSION-BASED AUTH
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { formatINR } from '../utils/formatCurrency';
import { API } from '../config';

const API_BASE_URL = API.ORDERS;

// Use full backend URL to match your AuthContext patter
const MyOrdersPage = () => {
    const { user } = useAuth(); 
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCancelling, setIsCancelling] = useState(null); 

    const userId = user ? user.id : null;

    // 🔧 FIX: Create axios config with credentials (for session cookies)
    const getAxiosConfig = () => {
        return {
            withCredentials: true, // This sends the session cookie
            headers: {
                'Content-Type': 'application/json'
            }
        };
    };

    // --- Fetching Logic with Session Auth ---
    const fetchOrders = useCallback(() => {
        if (!userId) {
            setLoading(false);
            setError("Please log in to view your order history.");
            return;
        }

        if (!user) {
            setLoading(false);
            setError("Authentication required. Please log in again.");
            return;
        }

        setLoading(true);
        setError(null);

        // 🔧 FIX: Pass withCredentials config to axios
        axios.get(`${API_BASE_URL}/user/${userId}`, getAxiosConfig())
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                if (err.response?.status === 403) {
                    setError("Access denied. Please log in again.");
                } else if (err.response?.status === 401) {
                    setError("Session expired. Please log in again.");
                } else {
                    setError("Failed to load orders. Please check backend connection.");
                }
                setLoading(false);
            });
    }, [userId, user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // --- Cancel Order Handler with Session Auth ---
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm(`Are you sure you want to cancel Order #${orderId}? This cannot be undone.`)) {
            return;
        }

        setIsCancelling(orderId);

        try {
            // 🔧 FIX: Pass withCredentials config to cancel request
            await axios.put(`${API_BASE_URL}/cancel/${orderId}`, {}, getAxiosConfig());
            
            fetchOrders();

        } catch (error) {
            console.error(`Error cancelling order ${orderId}:`, error);
            if (error.response && error.response.status === 409) {
                alert("Cancellation failed: Order is no longer in the processing stage.");
            } else if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Authentication failed. Please log in again.");
            } else {
                setError("Failed to communicate with the server to cancel the order.");
            }
        } finally {
            setIsCancelling(null);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-6 py-12 text-center text-xl">Loading your order history...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-6 py-12 text-red-500 text-center text-xl">{error}</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-8">My Orders</h1>
            
            {orders.length === 0 ? (
                <p className="text-xl text-gray-500 p-8 border rounded-lg shadow-sm">
                    You have not placed any orders yet.
                </p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
                            <div className="flex justify-between items-start border-b pb-3 mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Order ID: #{order.id}</p>
                                    <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                
                                <span className={`text-sm font-bold px-3 py-1 rounded-full 
                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                      'bg-yellow-100 text-yellow-700'}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            
                            <p className="text-lg font-medium text-gray-800 mb-2">Items: {order.itemsSummary}</p>
                            
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xl font-extrabold text-brand-accent">
                                    {formatINR(order.totalAmount)} 
                                </span>
                                
                                {order.status === 'Processing' && (
                                    <button 
                                        onClick={() => handleCancelOrder(order.id)}
                                        disabled={isCancelling === order.id}
                                        className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-red-600 transition disabled:bg-gray-400"
                                    >
                                        {isCancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                                
                                {order.status !== 'Processing' && (
                                    <span className="text-sm text-gray-600">Ship To: {order.shippingAddress}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;