import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
<<<<<<< HEAD
import { useNotification } from '../context/NotificationContext';

import { API } from '../config';

const API_URL = `${API.AUTH}/signup`;// <-- Import Toast Hook
=======
import { useNotification } from '../context/NotificationContext'; // <-- Import Toast Hook

const API_URL = 'https://initstore-backend-4.onrender.com/api/auth/signup';

>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
const SignupPage = () => {
    const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
    const { showToast } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send sign-up request to Spring Boot backend
            await axios.post(API_URL, credentials);

            // Success response
            showToast("Registration successful! Please log in.", 'success');
            
            // Redirect user to login page after successful registration
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Registration failed:", error);

            // Handle specific backend errors (e.g., email already in use)
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "Registration failed. Please try again.";
            
            showToast(errorMessage, 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-brand-primary text-center mb-6">Create Account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            onChange={handleChange}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="Ansh Singh"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={handleChange}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={handleChange}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-medium text-brand-primary hover:text-brand-accent">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
