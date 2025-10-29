import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const API_URL = 'https://initstore-backend-4.onrender.com/api/products';
const CATEGORIES_URL = 'https://initstore-backend-4.onrender.com/api/categories';

const AddProductForm = ({ onClose, onSuccess, editProduct = null }) => {
    const { showToast } = useNotification();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryId: '',
        rating: 4.0,
        isNew: false,
        isSale: false
    });

    useEffect(() => {
        console.log("AddProductForm mounted!");
        fetchCategories();
        
        if (editProduct) {
            setFormData({
                name: editProduct.name || '',
                description: editProduct.description || '',
                price: editProduct.price || '',
                imageUrl: editProduct.imageUrl || '',
                categoryId: editProduct.category?.id || '',
                rating: editProduct.rating || 4.0,
                isNew: editProduct.isNew || false,
                isSale: editProduct.isSale || false
            });
        }
    }, [editProduct]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(CATEGORIES_URL);
            setCategories(response.data);
        } catch (error) {
            showToast('Failed to load categories', 'error');
            console.error('Category fetch error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.categoryId) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setLoading(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                rating: parseFloat(formData.rating),
                category: { id: parseInt(formData.categoryId) }
            };

            if (editProduct) {
                await axios.put(`${API_URL}/${editProduct.id}`, productData);
                showToast(`${formData.name} updated successfully!`, 'success');
            } else {
                await axios.post(API_URL, productData);
                showToast(`${formData.name} added successfully!`, 'success');
            }

            onSuccess();
            onClose();
        } catch (error) {
            showToast(editProduct ? 'Update failed' : 'Failed to add product', 'error');
            console.error('Product save error:', error);
        } finally {
            setLoading(false);
        }
    };

    console.log("AddProductForm rendering modal!");

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
            style={{ zIndex: 9999 }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Vintage Denim Jacket"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Detailed product description..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="299.99"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating (1-5)
                        </label>
                        <input
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            step="0.1"
                            min="1"
                            max="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isNew"
                                checked={formData.isNew}
                                onChange={handleChange}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Mark as New</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isSale"
                                checked={formData.isSale}
                                onChange={handleChange}
                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Mark as Sale</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Saving...' : (editProduct ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;