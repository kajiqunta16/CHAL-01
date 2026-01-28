import { useEffect, useState } from "react";
import { api, getUserIdFromToken } from "../../config/api";
import "./product.css";

export function Product({ cart, loadCart }) {
    const [products, setProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);

    const images = [
        "images/image-product-1.jpg",
        "images/image-product-2.jpg",
        "images/image-product-3.jpg",
        "images/image-product-4.jpg"
    ];

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
            // Assuming you have a product ID - adjust as needed
            await api.post(`/cart/${userId}`, {
                productId: 'YOUR_PRODUCT_ID', // Replace with actual product ID
                quantity
            });
            await loadCart();
            alert('Added to cart!');
            setQuantity(0);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart');
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
        <div className="container product-section">
            <div className="row d-flex align-items-center">
                {/* LEFT: IMAGES */}
                <div className="justify-content-left col-lg-6 product-images">
                    {/* Mobile Carousel */}
                    <div className="mobile-carousel d-lg-none">
                        <button className="carousel-nav prev" onClick={prevImage}>
                            <img src="images/icon-previous.svg" alt="Previous" />
                        </button>
                        <img
                            src={images[currentImageIndex]}
                            className="product-main-mobile"
                            alt="Product"
                        />
                        <button className="carousel-nav next" onClick={nextImage}>
                            <img src="images/icon-next.svg" alt="Next" />
                        </button>
                    </div>

                    {/* Desktop Images */}
                    <div className="desktop-images d-none d-lg-block">
                        <img
                            src={images[currentImageIndex]}
                            className="product-main mb-4"
                            alt="Product"
                        />
                        <div className="d-flex gap-3">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.replace('.jpg', '-thumbnail.jpg')}
                                    className={`thumb ${currentImageIndex === index ? 'active' : ''}`}
                                    onMouseEnter={() => setCurrentImageIndex(index)}
                                    alt={`Thumbnail ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: DETAILS */}
                <div className="justify-content-right col-lg-6 product-details">
                    <small className="company">SNEAKER COMPANY</small>
                    <h1>Fall Limited Edition Sneakers</h1>
                    <p className="description">
                        These low-profile sneakers are your perfect casual wear companion.
                        Featuring a durable rubber outer sole, they'll withstand everything
                        the weather can offer.
                    </p>
                    <div className="price-box">
                        <span className="price">$125.00</span>
                        <span className="discount">50%</span>
                    </div>
                    <span className="old-price">$250.00</span>

                    <div className="cart-actions">
                        <div className="quantity">
                            <button onClick={decrementQuantity}>-</button>
                            <span>{quantity}</span>
                            <button onClick={incrementQuantity}>+</button>
                        </div>
                        <button
                            className="add-to-cart"
                            onClick={addToCart}
                            disabled={loading}
                        >
                            <img src="images/icon-cart.svg" alt="Cart" />
                            {loading ? 'Adding...' : 'Add to cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}