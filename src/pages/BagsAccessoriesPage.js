import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { API } from '../config';

const API_BASE_URL = API.PRODUCTS;
const categoryId = 4;

const BagsAccessoriesPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/category/${categoryId}`) // ✅ FIXED HERE
            .then(res => {
                console.log("Bags API Response:", res.data); // 🔍 debug
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Bags API Error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6">👜 Bags & Accessories</h1>

            <div className="grid grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default BagsAccessoriesPage;