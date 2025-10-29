import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 
import { useNotification } from '../context/NotificationContext'; 
import { formatINR } from '../utils/formatCurrency'; // <-- CRITICAL IMPORT

const API_BASE_URL = 'https://initstore-backend-4.onrender.com/api/products';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart(); 
    const { showToast } = useNotification(); 

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    
    useEffect(() => {
        axios.get(`${API_BASE_URL}/${id}`)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    // Function to handle adding the product to the cart
    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            
            // Use global toast notification
            showToast(`${quantity} x ${product.name} added successfully!`, 'success');
        }
    };

    if (loading) return <div className="container mx-auto px-6 py-12 text-center">Loading product details...</div>;
    if (!product) return <div className="container mx-auto px-6 py-12 text-center text-red-500">Product not found.</div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Image Section */}
                <div className="lg:w-1/2">
                    <img 
                        src={product.imageUrl || 'https://via.placeholder.com/600x600.png?text=Product+Image'} 
                        alt={product.name} 
                        className="w-full h-auto object-cover rounded-lg shadow-xl" 
                    />
                </div>

                {/* Details and Actions Section */}
                <div className="lg:w-1/2">
                    <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
                    {/* INR FORMATTING APPLIED HERE */}
                    <p className="text-3xl font-bold text-brand-primary mt-4">
                        {formatINR(product.price)}
                    </p>
                    <p className="text-gray-600 mt-6">{product.description}</p>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4 mt-8">
                        <label htmlFor="quantity-input" className="text-lg font-medium">Quantity:</label>
                        <input
                            id="quantity-input"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} // Ensure quantity is never less than 1
                            className="w-20 border border-gray-300 rounded-md p-2 text-center focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-8">
                        <button 
                            onClick={handleAddToCart} 
                            className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition shadow-lg flex items-center justify-center"
                        >
                            ➕ Add to Cart
                        </button>
                        <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition shadow-lg flex items-center justify-center">
                            🛒 Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
