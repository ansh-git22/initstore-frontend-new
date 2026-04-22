import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { useCart } from './context/CartContext'; // Import useCart for state management
import { useNotification } from './context/NotificationContext'; // <-- NEW IMPORT
import { formatINR } from './utils/formatCurrency'; // <-- CRITICAL INR IMPORT

// StarRating component remains the same
const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
    ));
    return <div className="flex items-center">{stars}</div>;
};

// --- ProductCard Component (Linked and Cart Enabled) ---
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
        // Wrap the entire card in <Link>
        <Link to={`/product/${product.id}`} className="block"> 
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl group animate-fade-in">
                
                <div className="relative h-64 overflow-hidden">
                    <img 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src={product.imageUrl} 
                        alt={product.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/E2E8F0/4A5568?text=Image+Not+Found`; }}
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

// --- ProductList Component (Updated to handle SearchQuery) ---
const ProductList = ({ selectedCategory, searchQuery }) => { 
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    
    const API_BASE_URL = 'https://initstore-backend-5.onrender.com/api/products'; 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(API_BASE_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                setProducts(data);
                setStatus('success');
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setStatus('error');
            }
        };
        fetchProducts();
    }, []);

    // 2. Apply filtering based on Category AND Search Query
    const query = searchQuery ? searchQuery.toLowerCase() : '';

    const filteredProducts = products
        .filter(product => {
            // Category Filter (Always applies unless selectedCategory is 'All')
            const passesCategory = selectedCategory === 'All' || 
                (product.category && 
                 product.category.name && 
                 product.category.name.toLowerCase() === selectedCategory.toLowerCase());

            // Search Filter (Applies if query is present)
            const passesSearch = !query || 
                (product.name && product.name.toLowerCase().includes(query)) ||
                (product.description && product.description.toLowerCase().includes(query));

            return passesCategory && passesSearch;
        });

    return (
        <section id="products" className="py-20 bg-brand-secondary">
            <div className="container mx-auto px-6">
                {/* Adjust title based on whether a search is active */}
                <h2 className="text-4xl font-bold text-center text-brand-primary mb-2">
                    {query ? `Search Results for "${searchQuery}"` : 'Featured Products'}
                </h2>
                <p className="text-center text-brand-text text-xl mb-12">
                    {query ? `Found ${filteredProducts.length} results` : (selectedCategory === 'All' ? 'Browse All' : selectedCategory)}
                </p>
                
                {status === 'loading' && <p className="text-center text-gray-600">Loading products...</p>}
                
                {status === 'error' && <p className="text-center text-red-500">Failed to load products. Make sure your Java backend is running.</p>}
                
                {status === 'success' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                )}
                
                {status === 'success' && filteredProducts.length === 0 && !query && (
                    <p className="text-center text-gray-500 p-8 border rounded-lg">No products found in this category.</p>
                )}
                
                {status === 'success' && filteredProducts.length === 0 && query && (
                    <p className="text-center text-gray-500 p-8 border rounded-lg">No products match your search query: "{searchQuery}"</p>
                )}
            </div>
        </section>
    );
};

export default ProductList;