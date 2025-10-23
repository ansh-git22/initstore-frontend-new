// src/pages/SalePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = 'http://localhost:8080/api/products'; 

const SalePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetches products where isSale is TRUE
        axios.get(`${API_BASE_URL}/sale`) 
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching sale items:", err);
                setError("Failed to load sale products. Check if backend is running.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container mx-auto px-6 py-12 text-center text-xl">Loading Sale Items...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-6 py-12 text-red-500 text-center text-xl">{error}</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-4">🏷️ Sale & Clearance</h1>
            <p className="text-lg text-gray-600 mb-8">
                Don't miss out! Get our best styles at limited-time discounts.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} /> 
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 p-8 border rounded-lg">
                        There are no items currently on sale.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SalePage;