import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getUserIdFromToken } from "../config/api";
import "./Header.css";
import logo from "../images/logo.svg";
import cartIcon from "../images/icon-cart.svg";
import avatarImage from "../images/image-avatar.png";
import deleteIcon from "../images/icon-delete.svg";

export function Header({ cartItems = [], loadCart = [] }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const cartRef = useRef(null);
    const profileRef = useRef(null);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const toggleCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsCartOpen(prev => !prev);
        setIsProfileOpen(false);
    };

    const toggleProfileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsProfileOpen(prev => !prev);
        setIsCartOpen(false);
    };

    const increaseQuantity = async (productId) => {
        const userId = getUserIdFromToken();
        if (!userId) return;

        try {
            await api.post(`/cart/${userId}`, {
                productId,
                quantity: 1,
            });
            loadCart();
        } catch (error) {
            console.error("Increase failed:", error);
        }
    };

    const decreaseQuantity = async (productId) => {
        const userId = getUserIdFromToken();
        if (!userId) return;

        try {
            await api.post(`/cart/decrease/${userId}`, {
                productId,
            });
            loadCart();
        } catch (error) {
            console.error("Decrease failed:", error);
        }
    };

    const removeFromCart = async (productId) => {
        const userId = getUserIdFromToken();
        if (!userId) return;

        try {
            await api.post(`/cart/remove/${userId}`, {
                productId,
            });
            window.location.reload(); // Reload to refresh cart
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsProfileOpen(false);
        navigate("/login");
    };

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
                        <img src={logo} className="logo" alt="Logo" />
                    </Link>

                    <div className="d-flex align-items-center gap-4 ms-auto order-2 order-lg-3">
                        {/* CART */}
                        <div className="cart-container" ref={cartRef}>
                            <img
                                src={cartIcon}
                                className="cart-icon"
                                alt="Cart"
                                onClick={toggleCart}
                                style={{ pointerEvents: 'auto' }}
                            />
                            <span className={`cart-count ${cartCount > 0 ? 'show' : ''}`}>
                                {cartCount}
                            </span>

                            {isCartOpen && (
                                <div className="cart-dropdown">
                                    <div className="cart-header">
                                        <h3>Cart</h3>
                                    </div>
                                    <div className="cart-body">
                                        {cartItems.length === 0 ? (
                                            <p className="empty-cart">Your cart is empty.</p>
                                        ) : (
                                            <>
                                                {cartItems.map((item) => (
                                                    <div key={item.product._id} className="cart-item">
                                                        <img
                                                            src={item.product.image || avatarImage}
                                                            className="cart-item-image"
                                                            alt={item.product.name}
                                                        />
                                                        <div className="cart-item-details">
                                                            <div className="cart-item-name">
                                                                {item.product.name}
                                                            </div>
                                                            <div className="cart-item-price">
                                                                ${item.product.price.toFixed(2)} x {item.quantity}{' '}
                                                                <span className="total">
                                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <button onClick={() => decreaseQuantity(item.product._id)}>-</button>
                                                            <span>{item.quantity}</span>
                                                            <button onClick={() => increaseQuantity(item.product._id)}>+</button>
                                                        </div>
                                                        <button
                                                            className="cart-item-delete"
                                                            onClick={() => removeFromCart(item.product._id)}
                                                        >
                                                            <img src={deleteIcon} alt="Delete" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button className="checkout-btn">Checkout</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PROFILE */}
                        <div className="avatar-container" ref={profileRef}>
                            <img
                                src={avatarImage}
                                className="avatar"
                                alt="Avatar"
                                onClick={toggleProfileMenu}
                                style={{ pointerEvents: 'auto' }}
                            />

                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <img
                                            src={avatarImage}
                                            className="profile-avatar"
                                            alt="Avatar"
                                        />
                                        <div className="profile-info">
                                            <h4>John Doe</h4>
                                            <p>john.doe@example.com</p>
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

                    <div
                        className="collapse navbar-collapse order-3 order-lg-2"
                        id="navbarCollapse"
                    >
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