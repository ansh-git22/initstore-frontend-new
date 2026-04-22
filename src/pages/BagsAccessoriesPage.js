import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { API } from '../config';

const API_BASE_URL = API.PRODUCTS;
const categoryId = 4;

const BagsAccessoriesPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // ✅ FIXED: Using /category/id/4 instead of /category/4
        axios.get(`${API_BASE_URL}/category/id/${categoryId}`)
            .then(res => {
                console.log("Bags API Response:", res.data);
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Bags API Error:", err);
                setError("Failed to load Bags & Accessories.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container mx-auto px-6 py-12 text-center text-xl">Loading Bags & Accessories...</div>;

    if (error) return <div className="container mx-auto px-6 py-12 text-red-500 text-center text-xl">{error}</div>;

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-4">👜 Bags & Accessories</h1>
            <p className="text-lg text-gray-600 mb-8">
                Browse our collection of bags and accessories for every occasion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <p className="col-span-full text-center text-gray-500 p-8 border rounded-lg">
                        No products found in Bags & Accessories.
                    </p>
                )}
            </div>
        </div>
    );
};

export default BagsAccessoriesPage;