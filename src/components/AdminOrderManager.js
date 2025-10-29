import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatINR } from '../utils/formatCurrency';
import { useNotification } from '../context/NotificationContext';

const API_URL = 'https://initstore-backend-4.onrender.com/api/orders'; 
const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(null);
    const { showToast } = useNotification();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setOrders(response.data);
        } catch (error) {
            showToast('Failed to fetch orders for admin panel.', 'error');
            console.error("Admin Order Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // FIXED: Use the correct endpoint for status update
    const handleStatusChange = async (orderId, newStatus) => {
        setIsUpdating(orderId);
        
        try {
            // CORRECTED: Use the proper status update endpoint
            await axios.put(
                `${API_URL}/${orderId}/status`, 
                JSON.stringify(newStatus),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            showToast(`Order #${orderId} status updated to ${newStatus}.`, 'success');
            fetchOrders();
        } catch (error) {
            showToast('Status update failed. Check console.', 'error');
            console.error("Order Status Update Error:", error);
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No orders found.</p>
                <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers place them.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-700">
                    Order Management 
                    <span className="ml-2 text-sm font-normal text-gray-500">({orders.length} total orders)</span>
                </h3>
                <button 
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    🔄 Refresh
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.userName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                    <div className="truncate" title={order.itemsSummary}>
                                        {order.itemsSummary}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                    <div className="truncate" title={order.shippingAddress}>
                                        {order.shippingAddress}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {formatINR(order.totalAmount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                    {formatDate(order.orderDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        disabled={isUpdating === order.id || order.status === 'Cancelled' || order.status === 'Delivered'}
                                        className="p-2 border rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    {isUpdating === order.id && (
                                        <span className="text-xs text-blue-500 ml-2">Updating...</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>💡 Tip: Update order status to keep customers informed about their deliveries.</p>
            </div>
        </div>
    );
};

export default AdminOrderManager;