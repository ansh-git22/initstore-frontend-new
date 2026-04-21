import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { formatINR } from '../utils/formatCurrency'; // <-- CRITICAL INR IMPORT

// StarRating component
const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
    ));
    return <div className="flex items-center">{stars}</div>;
};

// ProductCard Component
const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useNotification();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart(product, 1);
        showToast(`${product.name} added to cart!`, 'success');
    };

    // Safely parse price and apply INR formatting
    const displayPrice = formatINR(product.price);

    return (
        <Link to={`/product/${product.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl group animate-fade-in">
                
                <div className="relative h-64 overflow-hidden">
                    <img 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src={product.imageUrl} 
                        alt={product.name} 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = `https://placehold.co/400x400/E2E8F0/4A5568?text=Image+Not+Found`; 
                        }}
                    />
                </div>
                
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-brand-text mb-2 truncate">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 h-10 truncate">{product.description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                        {/* INR CURRENCY APPLIED HERE */}
                        <span className="text-xl font-bold text-brand-primary">{displayPrice}</span>
                        <StarRating rating={product.rating || 4} />
                    </div>
                    
                    <button 
                        onClick={handleAddToCart}
                        className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-full hover:bg-brand-accent-hover transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;