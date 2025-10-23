import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast'; // <--- IMPORTING THE VISUAL COMPONENT

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [toast, setToast] = useState(null); // { message, type }

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        setToast({ message, type });

        // Auto-dismiss the toast after the duration
        setTimeout(() => {
            setToast(null);
        }, duration);
    }, []);

    // Provider value includes the function to trigger a toast
    const contextValue = { showToast };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            {/* RENDER THE TOAST GLOBALLY if toast state is not null */}
            {toast && <Toast message={toast.message} type={toast.type} />}
        </NotificationContext.Provider>
    );
};
