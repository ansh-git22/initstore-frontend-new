import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './context/CartContext'; 
// Import icons, including any necessary for mobile menu (e.g., MenuIcon, XIcon)
import { BagIcon, ShirtIcon, TagIcon, CartIcon, UserIcon, LoginIcon, LogoutIcon } from './Icons'; 

// --- TEMPORARY ICONS for Mobile Menu (If not in Icons.js) ---
const MenuIcon = (props) => (<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>);
const XIcon = (props) => (<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>);
// -----------------------------------------------------------

// Categories array must be defined or imported here if not defined globally
const CATEGORIES = [
    { name: 'New Arrivals', link: '/shop/new', icon: TagIcon, image: 'https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg?semt=ais_hybrid&w=740&q=80', description: 'Fresh styles for the season' },
    { name: 'Tops & Shirts', link: '/shop/tops', icon: ShirtIcon, image: 'https://t3.ftcdn.net/jpg/16/52/65/90/360_F_1652659051_VVaYrvs4orSfyW94wk1uCSs8ePoXr0ac.jpg', description: 'Tees, blouses, and button-ups' },
    { name: 'Bags & Accessories', link: '/shop/bags', icon: BagIcon, image: 'https://cdn.grabon.in/gograbon/indulge/wp-content/uploads/2021/11/Types-of-bags-1.jpg', description: 'Totes, backpacks, and more' },
    { name: 'Sale', link: '/shop/sale', icon: TagIcon, image: 'https://media.istockphoto.com/id/498301640/vector/big-sale-banner.jpg?s=612x612&w=0&k=20&c=fppPOZ3LZCyvtDUiy6tR52xDWofX52Fdu3a7Ltc_fVY=', description: 'Limited-time discounts' },
];

// --- MEGAMENU COMPONENT (Now serves as Desktop MegaMenu AND Mobile Full Menu) ---
const MegaMenu = ({ isOpen, isMobile, setMenuOpen, user, logout }) => { // Added user, logout props
    // Desktop MegaMenu classes (appears below header, full width, hides on small screens)
    const desktopClasses = !isMobile 
        ? (isOpen 
            ? 'visible opacity-100 translate-y-0' 
            : 'invisible opacity-0 -translate-y-4') 
        : 'hidden'; // Hide the DESKTOP menu entirely on mobile

    // Mobile Full-Screen Menu classes (covers viewport, appears only on small screens)
    const mobileClasses = isMobile && isOpen
        ? 'translate-x-0'
        : 'translate-x-full';
    
    // Determine the wrapper style based on whether it's mobile or desktop
    const wrapperClasses = isMobile 
        ? `fixed inset-0 bg-white z-40 p-6 transition-transform duration-300 ${mobileClasses} md:hidden`
        : `absolute left-0 w-full z-20 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${desktopClasses}`;

    // Function to close the menu after clicking a link
    const handleLinkClick = () => setMenuOpen(false);

    // If it's a desktop menu and is closed, we don't render it at all to avoid z-index issues
    if (!isMobile && !isOpen) return null;

    return (
        <div className={wrapperClasses} onMouseLeave={!isMobile ? handleLinkClick : undefined}>
            <div className="container mx-auto">
                
                {/* Mobile Header (Only visible on small screens) */}
                {isMobile && (
                    <div className="flex justify-between items-center pb-6 border-b mb-6">
                        <h2 className="text-2xl font-bold text-brand-primary">Shop Categories</h2>
                        <button onClick={handleLinkClick} className="text-gray-500 hover:text-brand-accent">
                            <XIcon className="w-8 h-8" />
                        </button>
                    </div>
                )}
                
                {/* Menu Content: 4-Column Grid on Desktop, 1-Column List on Mobile */}
                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
                    {CATEGORIES.map((category) => (
                        <Link 
                            key={category.name}
                            to={category.link}
                            onClick={handleLinkClick}
                            className={`group block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 
                                ${isMobile ? 'flex items-center space-x-4 bg-gray-50 p-4 border border-gray-200' : ''}`}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                // CRITICAL FIX: Removed 'rounded-full' on desktop, ensured proper object fit
                                className={`h-16 w-16 object-cover transition-transform duration-500 ${isMobile ? 'rounded-full' : 'w-full h-48 rounded-lg group-hover:scale-105'}`}
                            />
                            <div className={isMobile ? 'flex-grow' : 'absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4'}>
                                {/* Show icons and text clearly on both views */}
                                <h3 className={`font-bold leading-tight ${isMobile ? 'text-lg text-brand-primary' : 'text-xl text-white'}`}>
                                    {category.name}
                                </h3>
                                {!isMobile && <p className="text-sm text-gray-200">{category.description}</p>}
                            </div>
                            {/* Desktop hover effect indicator */}
                            {!isMobile && <div className="absolute inset-0 border-4 border-transparent group-hover:border-brand-accent transition-all duration-300 pointer-events-none"></div>}
                        </Link>
                    ))}
                </div>

                {/* Additional Mobile Navigation & Auth Links (Visible on small screens) */}
                {isMobile && (
                    <div className="mt-8 pt-4 border-t space-y-4">
                        <Link to="/" onClick={handleLinkClick} className="block text-lg font-medium text-brand-text hover:text-brand-accent">Home</Link>
                        
                        {/* --- AUTHENTICATION LINKS (FIX for Mobile) --- */}
                        {user ? (
                            <>
                                <Link to="/orders" onClick={handleLinkClick} className="block text-lg font-medium text-brand-text hover:text-brand-accent">My Orders</Link>
                                <button onClick={() => { logout(); handleLinkClick(); }} className="w-full text-left text-lg font-medium text-red-500 hover:text-red-700 transition">Logout ({user.name})</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={handleLinkClick} className="block text-lg font-medium text-brand-text hover:text-brand-accent">Login</Link>
                                <Link to="/signup" onClick={handleLinkClick} className="block text-lg font-medium bg-brand-primary text-white py-2 px-4 rounded-lg text-center hover:bg-opacity-90 transition">Sign Up</Link>
                            </>
                        )}
                        {/* --- END AUTH FIX --- */}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- HEADER COMPONENT ---
const Header = () => {
    // This state is for the desktop mega menu (hover)
    const [isDesktopMenuOpen, setDesktopMenuOpen] = useState(false);
    // This state is for the mobile full-screen menu (click)
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); 
    
    const { user, logout } = useAuth();
    const { totalItems } = useCart(); 

    // Mobile Hamburger/Close Button
    const MobileMenuButton = (
        <button 
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-brand-primary hover:text-brand-accent focus:outline-none md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
            {isMobileMenuOpen ? <XIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
        </button>
    );

    return (
        <div className="relative"> 
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    
                    {/* Left side: Logo and Desktop Nav */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-3xl font-extrabold text-brand-primary tracking-tight">initstore</Link>
                        
                        {/* Desktop Navigation (Visible on md and up) */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-brand-text hover:text-brand-accent transition-colors">Home</Link>
                            {/* Desktop MegaMenu Button */}
                            <button 
                                onMouseEnter={() => setDesktopMenuOpen(true)} 
                                className="text-brand-text hover:text-brand-accent transition-colors py-4"
                            >
                                Shop
                            </button>
                        </nav>
                    </div>

                    {/* Right side: Cart, Auth, and Mobile Button */}
                    <div className="flex items-center space-x-4">
                        
                        {/* Mobile Menu Button (Pushed to the right of the header on mobile) */}
                        <div className="md:hidden">
                            {MobileMenuButton}
                        </div>
                        
                        {/* Cart Icon (Always visible) */}
                        <Link to="/cart" className="group text-gray-500 hover:text-brand-accent relative transition duration-300">
                            <CartIcon />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        
                        {/* Desktop Auth Links (Hidden on small screens) */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link to="/orders" className="text-brand-text hover:text-brand-accent transition-colors flex items-center">
                                        <span className="ml-2">My Orders</span>
                                    </Link>
                                    <span className="text-brand-text">Welcome, {user.name}!</span>
                                    <button onClick={logout} className="text-brand-text hover:text-brand-accent transition-colors flex items-center">
                                        <LogoutIcon /> <span className="ml-2">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-brand-text hover:text-brand-accent transition-colors flex items-center"><UserIcon /> <span className="ml-2">Login</span></Link>
                                    <Link to="/signup" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition flex items-center"><LoginIcon /> <span className="ml-2">Sign Up</span></Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Renders the MegaMenu for Desktop (hover) */}
            <MegaMenu isOpen={isDesktopMenuOpen} isMobile={false} setMenuOpen={setDesktopMenuOpen} user={user} logout={logout} />
            
            {/* Renders the MegaMenu logic as a full-screen Mobile Nav (click) */}
            <MegaMenu isOpen={isMobileMenuOpen} isMobile={true} setMenuOpen={setMobileMenuOpen} user={user} logout={logout} />
        </div>
    );
};

export default Header;
