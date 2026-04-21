import React, { useState } from 'react';
import { SearchIcon } from './Icons'; // Relying only on this import

const Hero = ({ handleSearchChange }) => { // 1. Accept the handler prop
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        const query = e.target.value;
        setInputValue(query);
        
        // 2. Call the handler to update the global search state in App.js
        handleSearchChange(query);
    };

    return (
        <section id="home" className="bg-gradient-to-br from-brand-secondary via-white to-blue-50">
            <div className="container mx-auto px-6 py-24 text-center animate-fade-in">
                
                {/* Marketing Text */}
                <h2 className="text-5xl md:text-6xl font-extrabold text-brand-primary mb-4">Effortless Style, Delivered.</h2>
                <p className="text-brand-text text-lg mb-8 max-w-2xl mx-auto">Explore our curated collection of premium bags and apparel.</p>
                
                {/* --- Search Bar Integration --- */}
                <div className="flex justify-center mb-10">
                    <div className="w-full max-w-xl flex items-center bg-white border border-gray-300 rounded-full shadow-lg overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search thousands of products..."
                            value={inputValue}
                            onChange={handleChange}
                            className="flex-grow py-3 px-6 text-lg focus:outline-none"
                            aria-label="Search products"
                        />
                        <div className="p-3">
                            {/* Uses the imported SearchIcon */}
                            <SearchIcon className="text-brand-primary" />
                        </div>
                    </div>
                </div>
                {/* --- End Search Bar --- */}

                {/* Original Shop Button (Moved down) */}
                <a href="#products" className="bg-brand-accent text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent-hover transition-transform transform hover:scale-105 shadow-lg">Shop Collection</a>
            </div>
        </section>
    );
};

export default Hero;
