import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './context/CartContext'; 
import { NotificationProvider } from './context/NotificationContext'; 

// Import your main components and existing pages
import Header from './Header';
import Hero from './Hero';
import ProductList from './ProductList';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import SignupPage from './pages/SignupPage';

// --- PAGE IMPORTS ---
import NewArrivalsPage from './pages/NewArrivalsPage';
import TopsShirtsPage from './pages/TopsShirtsPage';
import BagsAccessoriesPage from './pages/BagsAccessoriesPage';
import SalePage from './pages/SalePage';
import ProductDetailPage from './pages/ProductDetailPage'; 
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboardPage from './pages/AdminDashboard'; // <--- NEW IMPORT
// -----------------------

// A new component for your homepage content
const HomePage = () => {
    // State for filtering by category (default 'All' for the homepage view)
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // NEW: State for the search bar input, controlled by the Hero component
    const [searchQuery, setSearchQuery] = useState(''); 

    // Handler function to update search query from the Hero component
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };
    
    return (
        <>
            {/* Pass the handler to Hero/Search Bar component */}
            <Hero handleSearchChange={handleSearchChange} />
            
            {/* Pass both the category filter and the search query to the Product List */}
            <ProductList 
                selectedCategory={selectedCategory} 
                searchQuery={searchQuery} // Passing search query to ProductList
            />
        </>
    );
};

function App() {
    return (
        // The NotificationProvider wraps everything so all components can access showToast
        <NotificationProvider> 
            <AuthProvider>
                <CartProvider> 
                    <Router>
                        <div className="bg-white">
                            <Header />
                            <main>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    
                                    {/* Existing Routes */}
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                    <Route path="/cart" element={<CartPage />} />

                                    {/* NEW MANAGEMENT ROUTES */}
                                    <Route path="/admin" element={<AdminDashboardPage />} /> {/* <--- ADMIN ROUTE */}
                                    <Route path="/checkout" element={<CheckoutPage />} /> 
                                    <Route path="/product/:id" element={<ProductDetailPage />} /> 
                                    <Route path="/orders" element={<MyOrdersPage />} /> 

                                    {/* --- CATEGORY SHOP ROUTES --- */}
                                    <Route path="/shop/new" element={<NewArrivalsPage />} />
                                    <Route path="/shop/tops" element={<TopsShirtsPage />} />
                                    <Route path="/shop/bags" element={<BagsAccessoriesPage />} />
                                    <Route path="/shop/sale" element={<SalePage />} />
                                    {/* ---------------------------------- */}
                                </Routes>
                            </main>
                        </div>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </NotificationProvider>
    );
}

export default App;
