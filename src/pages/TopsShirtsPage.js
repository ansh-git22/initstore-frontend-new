import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { formatINR } from '../utils/formatCurrency'; 

import { API } from '../config';

const API_BASE_URL = API.PRODUCTS;// <-- CRITICAL FIX: The import that makes INR available

// Use your Spring Boot API base URL (usually 8080)

const TopsShirtsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // The API path for this category is /api/products/category/Tops & Shirts
        const categoryName = 'Tops & Shirts'; 
        
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
    }, []);

    if (loading) {
        return <div className="container mx-auto px-6 py-12 text-center text-xl">Loading Tops & Shirts...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-6 py-12 text-red-500 text-center text-xl">{error}</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-4">👕 Tops & Shirts</h1>
            <p className="text-lg text-gray-600 mb-8">
                Browse our collection of tees, blouses, button-ups, and more for every occasion.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        // Render ProductCard for each fetched product (it handles INR formatting internally)
                        <ProductCard key={product.id} product={product} /> 
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 p-8 border rounded-lg">
                        No products found in the Tops & Shirts category.
                    </p>
                )}
            </div>
        </div>
    );
};

export default TopsShirtsPage;
