import { useEffect, useState } from "react";
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

export function Product({ loadCart }) {
    const [products, setProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);

    const images = [image1, image2, image3, image4];
    const thumbnails = [thumb1, thumb2, thumb3, thumb4];

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
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
            await api.post(`/cart/${userId}`, {
                productId: products[0]?._id ?? "",
                quantity,
            });
            if (loadCart) loadCart();
            alert("Added to cart!");
            setQuantity(0);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
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
        <Header />
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
                            alt={products[0]?.name || "Product"}
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
                    {products[0] ? (
                        <>
                            <small className="company">{products[0].category?.toUpperCase() || "PRODUCT"}</small>
                            <h1>{products[0].name}</h1>
                            <p className="description">{products[0].description}</p>
                            <div className="price-box">
                                <span className="price">
                                    ${Number(products[0].price).toFixed(2)}
                                </span>
                            </div>
                            {products[0].list_price != null && (
                                <span className="old-price">${Number(products[0].list_price).toFixed(2)}</span>
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