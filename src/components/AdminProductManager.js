import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatINR } from '../utils/formatCurrency';
import { useNotification } from '../context/NotificationContext';
import AddProductForm from './AddProductForm';

const API_URL = 'https://initstore-backend-4.onrender.com/api/products'; 

const AdminProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { showToast } = useNotification();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
        } catch (error) {
            showToast('Failed to fetch products for admin panel.', 'error');
            console.error("Admin Product Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            return;
        }

        setIsDeleting(productId);
        try {
            await axios.delete(`${API_URL}/${productId}`);
            showToast(`${productName} deleted successfully.`, 'success');
            fetchProducts();
        } catch (error) {
            showToast('Deletion failed. Check console.', 'error');
            console.error("Admin Product Delete Error:", error);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = () => {
        fetchProducts();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-700">
                    Product Management 
                    <span className="ml-2 text-sm font-normal text-gray-500">({products.length} products)</span>
                </h3>
                <button 
                    onClick={() => {
                        console.log("Opening form...");
                        setShowAddForm(true);
                    }} 
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition shadow-md"
                >
                    + Add New Product
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NAME</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CATEGORY</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PRICE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STATUS</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {product.category?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {formatINR(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${product.isNew ? 'bg-blue-100 text-blue-800' : 
                                          product.isSale ? 'bg-red-100 text-red-800' : 
                                          'bg-gray-100 text-gray-600'}`}>
                                        {product.isNew ? 'New' : (product.isSale ? 'Sale' : 'Standard')}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                    <button 
                                        onClick={() => handleEdit(product)} 
                                        className="text-indigo-600 hover:text-indigo-900 font-medium hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product.id, product.name)} 
                                        disabled={isDeleting === product.id}
                                        className="text-red-600 hover:text-red-900 font-medium disabled:text-gray-400 hover:underline"
                                    >
                                        {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CRITICAL: This renders the modal when showAddForm is true */}
            {(showAddForm || editingProduct) && (
                <AddProductForm
                    onClose={handleCloseForm}
                    onSuccess={handleFormSuccess}
                    editProduct={editingProduct}
                />
            )}

            {/* Debug info - remove this after testing */}
            {console.log("showAddForm:", showAddForm)}
            {console.log("editingProduct:", editingProduct)}
        </div>
    );
};

export default AdminProductManager;