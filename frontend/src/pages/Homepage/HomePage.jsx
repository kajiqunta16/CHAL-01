import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const cartRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
        setIsProfileOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileOpen(prev => !prev);
        setIsCartOpen(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Logging out...");
        navigate('/login');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                cartRef.current &&
                !cartRef.current.contains(e.target) &&
                profileRef.current &&
                !profileRef.current.contains(e.target)
            ) {
                setIsCartOpen(false);
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="container-fluid bg-white sticky-top border-bottom">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light py-3">

                    <button
                        className="navbar-toggler order-0 me-3"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <Link to="/" className="navbar-brand order-1">
                        <img src="images/logo.svg" className="logo" alt="Logo" />
                    </Link>

                    <div className="d-flex align-items-center gap-4 ms-auto order-2 order-lg-3">

                        {/* CART */}
                        <div className="cart-container" ref={cartRef}>
                            <img
                                src="images/icon-cart.svg"
                                className="cart-icon"
                                alt="Cart"
                                onClick={toggleCart}
                            />
                            <span className="cart-count">0</span>

                            {isCartOpen && (
                                <div className="cart-dropdown">
                                    <div className="cart-header">
                                        <h3>Cart</h3>
                                    </div>
                                    <div className="cart-body">
                                        <p className="empty-cart">Your cart is empty.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PROFILE */}
                        <div className="avatar-container" ref={profileRef}>
                            <img
                                src="images/image-avatar.png"
                                className="avatar"
                                alt="Avatar"
                                onClick={toggleProfileMenu}
                            />

                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <img
                                            src="images/image-avatar.png"
                                            className="profile-avatar"
                                            alt="Avatar"
                                        />
                                        <div className="profile-info">
                                            <h4>{user?.username || 'User'}</h4>
                                            <p>{user?.email || 'user@example.com'}</p>
                                        </div>
                                    </div>

                                    <div className="profile-menu">
                                        <button className="profile-menu-item">
                                            My Orders
                                        </button>
                                        <button
                                            className="profile-menu-item logout"
                                            onClick={logout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* COLLAPSE MENU */}
                    <div
                        className="collapse navbar-collapse order-3 order-lg-2"
                        id="navbarCollapse"
                    >
                        <button
                            className="close-menu d-lg-none"
                            onClick={() => {
                                const collapse = document.getElementById('navbarCollapse');
                                const bsCollapse = window.bootstrap?.Collapse.getInstance(collapse);
                                if (bsCollapse) bsCollapse.hide();
                            }}
                        >
                            <img src="images/icon-close.svg" alt="Close" />
                        </button>

                        <ul className="navbar-nav">
                            <li className="nav-item"><Link className="nav-link" to="/">Collections</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/men">Men</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/women">Women</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                </nav>
            </div>
        </div>
    );
}