import React from 'react';

// The visual component for the pop-up notification
const Toast = ({ message, type }) => {
    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-2xl text-white font-semibold z-[9999] transition-all duration-500 transform opacity-100 translate-y-0";
    
    const colorClasses = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
    };

    return (
        <div className={`${baseClasses} ${colorClasses[type] || colorClasses.info}`}>
            {message}
        </div>
    );
};

export default Toast;
