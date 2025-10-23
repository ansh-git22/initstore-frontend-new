import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AnimatedSuccessIcon from '../components/AnimatedSuccessIcon'; // Import the animated icon

const CheckoutPage = () => {
    const { cartItems, totalItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    
    // 0: Form State, 1: Processing, 2: Success
    const [step, setStep] = useState(0); 
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'COD' // Default to Cash On Delivery
    });

    const subtotal = cartItems.reduce((acc, item) => 
        acc + (parseFloat(item.price) * item.quantity), 0);
    
    const shipping = 5.00;
    const orderTotal = subtotal + shipping;

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setStep(1); // Set to Processing

        // Simulate API call delay
        setTimeout(() => {
            // Check basic form validation
            if (!formData.name || !formData.address || !formData.city) {
                alert("Please fill in all required address fields.");
                setStep(0);
                return;
            }

            // In a real app, you would send formData and cartItems to the backend here.
            
            // Once order is placed successfully:
            setStep(2); // Set to Success
            
            // Clear the cart after a successful order
            cartItems.forEach(item => removeFromCart(item.id));
            
        }, 2000); // 2 second processing delay
    };

    // --- RENDER FUNCTIONS ---
    
    // --- Success Screen ---
    const renderSuccess = () => (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-xl shadow-2xl animate-fade-in-up">
            <AnimatedSuccessIcon />
            <h2 className="text-4xl font-extrabold text-green-600 mt-8 mb-4 animate-bounce-in">
                Order Placed Successfully!
            </h2>
            <p className="text-xl text-gray-700 max-w-md">
                Thank you for your purchase. Your order will be delivered shortly.
            </p>
            <p className="text-lg font-semibold text-brand-primary mt-2">
                Payment Method: Cash On Delivery
            </p>
            <button
                onClick={() => navigate('/')}
                className="mt-10 bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-transform transform hover:scale-105 shadow-md"
            >
                Continue Shopping
            </button>
        </div>
    );
    
    // --- Checkout Form ---
    const renderForm = () => (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Shipping and Payment */}
            <form onSubmit={handlePlaceOrder} className="lg:w-2/3 space-y-8 p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-brand-primary border-b pb-3">1. Shipping Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-brand-accent focus:border-brand-accent transition" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">City *</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-brand-accent focus:border-brand-accent transition" />
                    </div>
                </div>
                
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Full Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-brand-accent focus:border-brand-accent transition" />
                </div>
                
                <h2 className="text-3xl font-bold text-brand-primary border-b pb-3 mt-8">2. Payment Method</h2>

                {/* COD Payment Card (Animated & Colorful) */}
                <div className="border-4 border-green-500 rounded-xl p-5 bg-green-50 shadow-inner animate-pulse-subtle">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="paymentMethod" value="COD" checked readOnly className="form-radio h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-700">Cash On Delivery (COD)</span>
                    </label>
                    <p className="text-gray-600 mt-2 ml-8">Pay with cash when your order arrives.</p>
                </div>
                
                <button 
                    type="submit" 
                    className={`w-full text-white font-extrabold py-4 rounded-lg transition-all duration-300 shadow-xl ${step === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-accent hover:bg-red-700 transform hover:scale-[1.01]'}`}
                    disabled={step === 1}
                >
                    {step === 1 ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Placing Order...
                        </span>
                    ) : (
                        `Place Order (COD) - $${orderTotal.toFixed(2)}`
                    )}
                </button>
            </form>

            {/* Right: Order Summary */}
            <div className="lg:w-1/3 p-6 bg-white rounded-xl shadow-lg h-fit border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-brand-primary">Order Summary ({totalItems} Items)</h2>
                
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700 truncate pr-2">{item.name} (x{item.quantity})</span>
                            <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between text-2xl font-extrabold text-brand-accent border-t mt-4 pt-4">
                    <span>Order Total:</span>
                    <span>${orderTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
    
    if (cartItems.length === 0 && step < 2) {
        return (
            <div className="container mx-auto px-6 py-12 text-center min-h-[60vh]">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Your Cart is Empty!</h2>
                <p className="text-lg text-gray-600">Please add items to proceed to checkout.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 bg-brand-primary text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition"
                >
                    Start Shopping
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">Final Checkout</h1>
                {step === 2 ? renderSuccess() : renderForm()}
            </div>
        </div>
    );
};

export default CheckoutPage;
