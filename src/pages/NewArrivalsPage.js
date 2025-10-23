import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // Assuming ProductCard is now standalone

const API_BASE_URL = 'http://localhost:8080/api/products'; 

const NewArrivalsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetches products where isNew is TRUE
        axios.get(`${API_BASE_URL}/new`) 
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching new arrivals:", err);
                setError("Failed to load new products. Check if backend is running.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container mx-auto px-6 py-12 text-center text-xl">Loading new arrivals...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-6 py-12 text-red-500 text-center text-xl">{error}</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-4">✨ New Arrivals</h1>
            <p className="text-lg text-gray-600 mb-8">
                The latest looks and fresh styles, just landed! Be the first to snag them.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} /> 
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 p-8 border rounded-lg">
                        No new products are currently available. (Make sure you set 'isNew' to true in Postman)
                    </p>
                )}
            </div>
        </div>
    );
};

export default NewArrivalsPage;
