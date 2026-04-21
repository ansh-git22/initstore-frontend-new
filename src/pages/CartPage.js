import React from 'react';
import { useCart } from '../context/CartContext'; 
import { TrashIcon } from '../Icons'; 
import { Link } from 'react-router-dom'; 
import { formatINR } from '../utils/formatCurrency'; // <-- CRITICAL IMPORT

const CartPage = () => {
    // Destructure cart state and functions from the context
    const { cartItems, removeFromCart, totalItems } = useCart();
    
    // Calculate the subtotal price for all items in the cart
    const subtotal = cartItems.reduce((acc, item) => 
        acc + (parseFloat(item.price) * item.quantity), 0);

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-8">
                🛒 Your Shopping Cart ({totalItems} items)
            </h1>
            
            {cartItems.length === 0 ? (
                // Display message if cart is empty
                <p className="text-xl text-gray-500 p-8 border rounded-lg shadow-sm">
                    Your cart is empty. Explore our collection and add your first item!
                </p>
            ) : (
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* ===== Cart Items List (Left Column) ===== */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center border p-4 rounded-lg bg-white shadow-md">
                                <img 
                                    src={item.imageUrl || 'https://via.placeholder.com/100x100.png?text=Product'} 
                                    alt={item.name} 
                                    className="w-20 h-20 object-cover rounded-md mr-4 border" 
                                />
                                
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-500">
                                        Price: {formatINR(item.price)} x {item.quantity}
                                    </p>
                                </div>
                                
                                <div className="text-xl font-bold text-gray-900 mr-6">
                                    {/* INR Formatting for Item Subtotal */}
                                    {formatINR(parseFloat(item.price) * item.quantity)}
                                </div>
                                
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <span className="text-sm">Remove</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ===== Summary Card (Right Column) ===== */}
                    <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg shadow-xl h-fit border">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-brand-primary">Order Summary</h2>
                        
                        <div className="flex justify-between py-2">
                            <p>Subtotal ({totalItems} items)</p>
                            {/* INR Formatting for Subtotal */}
                            <p className="font-medium">{formatINR(subtotal)}</p>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b mb-4">
                            <p>Shipping Estimate</p>
                            <p className="font-medium">Calculated at Checkout</p>
                        </div>

                        <div className="flex justify-between font-bold text-2xl">
                            <p>Order Total</p>
                            {/* INR Formatting for Grand Total */}
                            <p>{formatINR(subtotal)}</p>
                        </div>
                        
                        {/* THE FUNCTIONAL CHECKOUT LINK */}
                        <Link 
                            to="/checkout" 
                            className="w-full bg-brand-primary text-white font-bold py-3 mt-6 rounded-lg hover:bg-opacity-90 transition shadow-lg text-center block"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
