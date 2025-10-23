import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // Assuming ProductCard is now standalone

const API_BASE_URL = 'http://localhost:8080/api/products'; 
const categoryName = 'Bags & Accessories'; // Moved to top level, outside component

const BagsAccessoriesPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        // Fetch by category name
        axios.get(`${API_BASE_URL}/category/${encodeURIComponent(categoryName)}`)
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Error fetching ${categoryName}:`, err);
                setError(`Failed to load ${categoryName} products.`);
                setLoading(false);
            });
    }, []); // Removed categoryName from dependency array since it's a static constant

    if (loading) {
        return <div className="container mx-auto px-6 py-12 text-center text-xl">Loading Bags & Accessories...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-6 py-12 text-red-500 text-center text-xl">{error}</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-4">👜 Bags & Accessories</h1>
            <p className="text-lg text-gray-600 mb-8">
                Find the perfect bag to complete your look, from totes to backpacks and stylish add-ons.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} /> 
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 p-8 border rounded-lg">
                        No products found in the Bags & Accessories category. (Check your database name: '{categoryName}')
                    </p>
                )}
            </div>
        </div>
    );
};

export default BagsAccessoriesPage;
