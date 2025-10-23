import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

// CRITICAL: Enable credentials for session-based auth
axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:8080/api/users'; 

const AdminUserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useNotification();

    // Function to fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                withCredentials: true // Enable cookies/session
            });
            setUsers(response.data);
            showToast(`Loaded ${response.data.length} users successfully`, 'success');
        } catch (error) {
            showToast('Failed to fetch user data. Make sure you are logged in as admin.', 'error');
            console.error("Admin User Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Toggle admin role for a user
    const handleChangeRole = async (userId, currentIsAdmin) => {
        try {
            const newAdminStatus = !currentIsAdmin;
            const response = await axios.put(
                `${API_URL}/${userId}`,
                { isAdmin: newAdminStatus },
                { withCredentials: true }
            );
            
            showToast(
                `User role changed to ${newAdminStatus ? 'Admin' : 'Customer'}`, 
                'success'
            );
            
            // Refresh the user list
            fetchUsers();
        } catch (error) {
            showToast('Failed to update user role', 'error');
            console.error("Role change error:", error);
        }
    };
    
    // Delete a user
    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`WARNING: Permanently delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/${userId}`, {
                withCredentials: true
            });
            
            showToast(`User "${userName}" deleted successfully`, 'success');
            
            // Refresh the user list
            fetchUsers();
        } catch (error) {
            showToast('Failed to delete user', 'error');
            console.error("Delete error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No users found in the system.</p>
                <p className="text-gray-400 text-sm mt-2">Users will appear here once they register.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-700">
                    User Management 
                    <span className="ml-2 text-sm font-normal text-gray-500">({users.length} total users)</span>
                </h3>
                <button 
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${user.isAdmin 
                                            ? 'bg-indigo-100 text-indigo-800' 
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.isAdmin ? '👑 Admin' : '👤 Customer'}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                    <button 
                                        onClick={() => handleChangeRole(user.id, user.isAdmin)} 
                                        className="text-blue-600 hover:text-blue-900 font-medium transition hover:underline"
                                        title={user.isAdmin ? 'Demote to Customer' : 'Promote to Admin'}
                                    >
                                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id, user.name)} 
                                        className="text-red-600 hover:text-red-900 font-medium transition hover:underline"
                                        title="Delete user permanently"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>💡 Tip: You can promote users to admin or delete accounts directly from here.</p>
            </div>
        </div>
    );
};

export default AdminUserManager;