import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getUserIdFromToken } from "../../config/api";
import { Header } from "../../components/Header";

import image1 from "../../images/image-product-1.jpg";
import image2 from "../../images/image-product-2.jpg";
import image3 from "../../images/image-product-3.jpg";
import image4 from "../../images/image-product-4.jpg";

import thumb1 from "../../images/image-product-1-thumbnail.jpg";
import thumb2 from "../../images/image-product-2-thumbnail.jpg";
import thumb3 from "../../images/image-product-3-thumbnail.jpg";
import thumb4 from "../../images/image-product-4-thumbnail.jpg";

import prevIcon from "../../images/icon-previous.svg";
import nextIcon from "../../images/icon-next.svg";
import cartIcon from "../../images/icon-cart.svg";

import "./product.css";

export function Product({ loadCart, cartItems }) {
    const { productId } = useParams(); // ✅ ONLY place it should exist

    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);

    const images = [image1, image2, image3, image4];
    const thumbnails = [thumb1, thumb2, thumb3, thumb4];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    const addToCart = async () => {
        if (quantity === 0) {
            alert('Please select a quantity');
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            alert('Please login first');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/cart/${userId}`, {
                productId: product._id,
                quantity: quantity,
            });

            console.log('Cart response:', response.data);

            if (loadCart) loadCart();
            alert("Added to cart!");
            setQuantity(0);
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data || error);
            alert(error.response?.data?.error || "Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => (prev > 0 ? prev - 1 : 0));
    };

    return (
        <>
            <title>Product Page</title>
            <Header cartItems={cartItems} loadCart={loadCart} />
            <div className="container product-section">
                <div className="row d-flex align-items-center">
                    {/* LEFT: IMAGES */}
                    <div className="justify-content-left col-lg-6 product-images">
                        {/* Mobile Carousel */}
                        <div className="mobile-carousel d-lg-none">
                            <button type="button" className="carousel-nav prev" onClick={prevImage}>
                                <img src={prevIcon} alt="Previous" />
                            </button>
                            <img
                                src={images[currentImageIndex]}
                                className="product-main-mobile"
                                alt="Product"
                            />
                            <button type="button" className="carousel-nav next" onClick={nextImage}>
                                <img src={nextIcon} alt="Next" />
                            </button>
                        </div>

                        {/* Desktop Images */}
                        <div className="desktop-images d-none d-lg-block">
                            <img
                                src={images[currentImageIndex]}
                                className="product-main mb-4"
                                alt={product?.name || "Product"}
                            />
                            <div className="d-flex gap-3">
                                {thumbnails.map((thumb, index) => (
                                    <img
                                        key={index}
                                        src={thumb}
                                        className={`thumb ${currentImageIndex === index ? "active" : ""}`}
                                        onMouseEnter={() => setCurrentImageIndex(index)}
                                        alt={`Thumbnail ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="justify-content-right col-lg-6 product-details">
                        {product ? (
                            <>
                                <small className="company">{product?.category?.toUpperCase()}</small>
                                <h1>{product.name}</h1>
                                <p className="description">{product.description}</p>
                                <div className="price-box">
                                    <span className="price">
                                        ${product?.price?.toFixed(2)}
                                    </span>
                                </div>
                                {product.list_price != null && (
                                    <span className="old-price">${Number(product.list_price).toFixed(2)}</span>
                                )}
                            </>
                        ) : (
                            <p className="description">Loading product details...</p>
                        )}

                        <div className="cart-actions">
                            <div className="quantity">
                                <button type="button" onClick={decrementQuantity}>-</button>
                                <span>{quantity}</span>
                                <button type="button" onClick={incrementQuantity}>+</button>
                            </div>
                            <button
                                type="button"
                                className="add-to-cart"
                                onClick={addToCart}
                                disabled={loading}
                            >
                                <img src={cartIcon} alt="Cart" />
                                {loading ? "Adding..." : "Add to cart"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}