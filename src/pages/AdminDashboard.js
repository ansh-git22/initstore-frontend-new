import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import AdminProductManager from '../components/AdminProductManager';
import AdminUserManager from '../components/AdminUserManager'; 
import AdminOrderManager from '../components/AdminOrderManager'; 

const AdminDashboardPage = () => {
    // FIX: All hooks MUST be called unconditionally at the top level
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('products'); // MOVED HOOK UP

    // 1. Authorization Check (Early return now happens after the hook is called)
    if (!user || !user.isAdmin) {
        return (
            <div className="container mx-auto px-6 py-20 text-center min-h-screen">
                <h1 className="text-4xl font-extrabold text-red-600 mb-4">Access Denied</h1>
                <p className="text-xl text-gray-600">You must be logged in as an Administrator to view this page.</p>
            </div>
        );
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'products':
                return <AdminProductManager />;
            case 'users':
                return <AdminUserManager />; 
            case 'orders':
                return <AdminOrderManager />; 
            default:
                return <AdminProductManager />;
        }
    };

    const navItems = [
        { id: 'products', name: 'Products', icon: '📦' },
        { id: 'users', name: 'Users', icon: '👤' },
        { id: 'orders', name: 'Orders', icon: '🛒' },
    ];

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen bg-gray-50">
            <h1 className="text-4xl font-extrabold text-brand-primary mb-8 border-b pb-4">
                ⚙️ Admin Dashboard
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- Sidebar Navigation --- */}
                <div className="lg:w-1/5 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2">Management Areas</h2> 
                    <nav className="space-y-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full text-left flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors 
                                    ${activeSection === item.id 
                                        ? 'bg-brand-primary text-white font-semibold shadow-md' 
                                        : 'text-brand-text hover:bg-gray-100'}`
                                }
                            >
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* --- Main Content Area --- */}
                <div className="lg:w-4/5 bg-white p-8 rounded-xl shadow-2xl">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
