import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity) => {
        const numQuantity = Math.max(1, Number(quantity)); // Ensure quantity is >= 1

        setCartItems(prevItems => {
            const exists = prevItems.find(item => item.id === product.id);
            if (exists) {
                // If product exists, update quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + numQuantity }
                        : item
                );
            } else {
                // Otherwise, add new item
                // Ensure price is safely stored for calculation later
                const safePrice = product.price ? parseFloat(product.price) : 0;
                return [...prevItems, { ...product, quantity: numQuantity, price: safePrice }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };
    
    // NEW FUNCTION: Clears the entire cart array
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate total items
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const contextValue = { 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart, // <-- EXPOSED THE NEW FUNCTION
        totalItems 
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
