// src/pages/CheckoutPage.js - FINAL VERSION WITH RENDER URL

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import AnimatedSuccessIcon from '../components/AnimatedSuccessIcon'; 
import axios from 'axios'; 

// ----------------------------------------------------------------------
// ✅ FIX: Using the live Render backend URL and the correct plural path /api/orders
const BACKEND_DOMAIN = 'https://initstore-backend-4.onrender.com'; 
const API_BASE_URL = `${BACKEND_DOMAIN}/api/orders`; 
// ----------------------------------------------------------------------

// Configure axios to send credentials
axios.defaults.withCredentials = true;

const CheckoutPage = () => {
    const { user } = useAuth();
    const { cartItems, totalItems, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: ''
    });

    const subtotal = cartItems.reduce((acc, item) => 
        acc + (parseFloat(item.price) * item.quantity), 0);
    
    const shipping = 100.00; 
    const orderTotal = subtotal + shipping;
    
    const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;
    
    // --- Order Submission Logic ---
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!user || !user.id) {
            alert("Please log in to place an order.");
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }
        
        if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.city) {
            alert("Please fill in all required shipping details."); 
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setIsProcessing(true);

        const orderData = {
            userId: user.id, 
            userName: shippingDetails.name,
            totalAmount: parseFloat(orderTotal.toFixed(2)), // Ensure it's a clean number
            shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}`,
            itemsSummary: cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ')
        };

        console.log("📦 Sending order data:", orderData);

        try {
            // This axios call now uses the absolute URL of the Render backend
            const response = await axios.post(API_BASE_URL, orderData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("✅ Order placed successfully:", response.data);

            setTimeout(() => {
                setIsOrderPlaced(true); 
                clearCart(); 
                setIsProcessing(false); 
            }, 1000); 

        } catch (error) {
            console.error("❌ ORDER SUBMISSION FAILED:", error);
            
            if (error.response) {
                // Server responded with error
                const status = error.response.status;
                const data = error.response.data;
                
                console.error("Error response data:", data);
                console.error("Error status:", status);
                
                if (status === 405) {
                    alert(`Order failed (Status 405 - Method Not Allowed). The path is now correct, but the server is blocking the request. Check your Spring Boot Security Config (CORS/Authentication).`);
                } else if (status === 403) {
                    alert("Access denied (403 - Forbidden). Please check your login status and Spring Boot security configuration.");
                    navigate('/login');
                } else if (status === 401) {
                    alert("Session expired (401). Please log in again.");
                    navigate('/login');
                } else if (status === 400) {
                    alert("Invalid order data (400). Please check your details.");
                } else if (status === 500) {
                    alert("Server error (500). Please try again later or contact support.");
                } else {
                    alert(`Order failed (Status ${status}). Please try again.`);
                }
            } else if (error.request) {
                // If the error is a network error, Render might be asleep or the URL is wrong.
                console.error("No response from server:", error.request);
                alert("Cannot connect to the backend server. Check your Render service status.");
            } else {
                // Request setup error
                console.error("Error setting up request:", error.message);
                alert("Order placement failed. Please refresh and try again.");
            }
            
            setIsProcessing(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    // --- Empty Cart Check ---
    if (cartItems.length === 0 && !isOrderPlaced) {
        return (
            <div className="container mx-auto px-6 py-20 text-center min-h-screen bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500">Add items before checking out.</p>
                <Link to="/" className="mt-6 inline-block bg-brand-primary text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition">
                    Go Shopping
                </Link>
            </div>
        );
    }
    
    // --- Order Success Screen ---
    if (isOrderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-green-50/50 p-6">
                <AnimatedSuccessIcon /> 
                <h2 className="text-4xl font-extrabold text-green-700 mt-8 mb-4">Thank You! Your Order is Placed Successfully!</h2>
                <p className="text-xl text-gray-600 mb-8 text-center">
                    We've sent a confirmation email to {shippingDetails.email}.<br/>
                    Your order will be processed and shipped soon.
                </p>
                <Link to="/" className="mt-6 inline-block bg-brand-primary text-white py-3 px-8 rounded-full hover:bg-opacity-90 transition shadow-lg">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    // --- Main Checkout Form ---
    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-10 text-center">Finalize Your Order</h1>
            
            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* Shipping Details */}
                <div className="lg:w-2/3 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">1. Shipping Information</h2>
                    <form onSubmit={handlePlaceOrder}> 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Full Name *" 
                                value={shippingDetails.name}
                                onChange={handleInputChange} 
                                className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email Address *" 
                                value={shippingDetails.email}
                                onChange={handleInputChange} 
                                className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                            <input 
                                type="text" 
                                name="address" 
                                placeholder="Street Address *" 
                                value={shippingDetails.address}
                                onChange={handleInputChange} 
                                className="p-3 border rounded-lg col-span-full focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                            <input 
                                type="text" 
                                name="city" 
                                placeholder="City *" 
                                value={shippingDetails.city}
                                onChange={handleInputChange} 
                                className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                            <input 
                                type="text" 
                                name="zip" 
                                placeholder="Zip/Postal Code *" 
                                value={shippingDetails.zip}
                                onChange={handleInputChange} 
                                className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full text-white font-extrabold py-4 mt-6 rounded-full transition transform hover:scale-[1.01] shadow-xl text-lg tracking-wider 
                                ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Place Order (COD)"
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="p-6 rounded-xl shadow-xl bg-white border border-gray-200 h-fit">
                        <h2 className="text-2xl font-bold text-brand-primary mb-4 border-b pb-3">Order Summary</h2>
                        
                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between text-base">
                                    <span className="text-gray-700 truncate pr-2">{item.name} (x{item.quantity})</span>
                                    <span className="font-medium">{formatCurrency(parseFloat(item.price) * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Shipping:</span>
                                <span>{formatCurrency(shipping)}</span> 
                            </div>
                        </div>

                        <div className="flex justify-between text-2xl font-extrabold text-brand-accent border-t mt-4 pt-4">
                            <span>Order Total:</span>
                            <span>{formatCurrency(orderTotal)}</span>
                        </div>
                    </div>
                    
                    {/* Payment Method */}
                    <div className="mt-6 p-6 rounded-xl shadow-xl bg-white border border-yellow-300">
                        <h2 className="text-2xl font-bold text-yellow-700 mb-4">2. Payment Method</h2>
                        <label className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-400 rounded-lg cursor-pointer">
                            <input type="radio" name="payment" value="COD" checked readOnly className="h-5 w-5 text-yellow-600 border-yellow-300 focus:ring-yellow-500" />
                            <span className="text-lg font-medium text-yellow-700">Cash On Delivery (COD)</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Pay upon delivery of your order.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;