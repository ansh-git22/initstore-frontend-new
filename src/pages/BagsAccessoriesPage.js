import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import ProductCard from '../components/ProductCard';

import { API } from '../config';

const API_BASE_URL = API.PRODUCTS;


// ✅ Your Bags category ID
const categoryId = 4;
=======
import ProductCard from '../components/ProductCard'; // Assuming ProductCard is now standalone

const API_BASE_URL = 'https://initstore-backend-4.onrender.com/api/products'; 
const categoryName = 'Bags & Accessories'; // Moved to top level, outside component
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763

const BagsAccessoriesPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD

    useEffect(() => {
        axios.get(`${API_BASE_URL}/category/id/${categoryId}`)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
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
=======
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
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
                )}
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default BagsAccessoriesPage;
=======
export default BagsAccessoriesPage;
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
