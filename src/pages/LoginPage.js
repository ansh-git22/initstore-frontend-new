import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { useNotification } from '../context/NotificationContext'; // Use notification for errors
import { LoginIcon } from '../Icons';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login } = useAuth(); 
    const { showToast } = useNotification(); // Use notification for errors
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Bundle credentials to pass to AuthContext
        const credentials = { email, password };

        // CRITICAL: AuthContext handles the API call and returns the user object on success
        const loggedInUser = await login(credentials); 

        if (loggedInUser && loggedInUser.isAdmin) {
            // FIX: Redirect Admin users to the Dashboard
            showToast(`Welcome, Admin ${loggedInUser.name}!`, 'info');
            navigate('/admin'); 
        } else if (loggedInUser) {
            // Redirect regular users to the home store
            showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
            navigate('/'); 
        } else {
            // Failure notification
            showToast("Login failed. Please check your credentials.", 'error'); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-secondary p-4">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl flex overflow-hidden">
                <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-brand-primary p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent via-brand-primary to-blue-900 animate-gradient-xy"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold mb-4 animate-fade-in-down">Welcome Back!</h2>
                        <p className="animate-fade-in-up">Sign in to access your account, view your order history, and enjoy a seamless shopping experience.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-brand-primary text-center mb-4">Login to Initstore</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm text-brand-accent hover:underline">Forgot your password?</a>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-transform transform hover:scale-105"
                            >
                                <LoginIcon /> <span className="ml-2">Sign In</span>
                            </button>
                        </div>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Not a member? <Link to="/signup" className="font-medium text-brand-accent hover:underline">Sign up now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
