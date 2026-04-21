export const formatINR = (price) => {
    if (price === undefined || price === null) {
        return 'N/A';
    }
    // Use the native JavaScript Intl API for correct Indian Rupee formatting (e.g., ₹ 1,23,456.00)
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR' 
    }).format(parseFloat(price));
};
