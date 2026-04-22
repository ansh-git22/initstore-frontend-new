import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { API } from '../config';

const API_BASE_URL = API.PRODUCTS;

// ✅ Change this to match EXACTLY what is saved in your database
// Open https://initstore-backend-5.onrender.com/api/products in browser
// Find a shirt product and copy the exact category.name value here
const CATEGORY_NAME = 'Tops & Shirts';

const TopsShirtsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/category/${encodeURIComponent(CATEGORY_NAME)}`)
            .then(response => {
                console.log("Tops & Shirts API Response:", response.data); // 🔍 debug
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Error fetching ${CATEGORY_NAME}:`, err);
                setError(`Failed to load ${CATEGORY_NAME} products.`);
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
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 p-8 border rounded-lg">
                        No products found in Tops & Shirts. 
                        <br />
                        <span className="text-sm text-gray-400">
                            Check that the category name in your DB matches: "{CATEGORY_NAME}"
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default TopsShirtsPage;