import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { api } from "../../config/api";
import "./HomePage.css";

export function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get("/products");
                setProducts(response.data);
                setError("");
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || "Failed to load products";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <title>Home Page</title>
            <Header />
            
            <div className="homepage-container">
                <div className="container">
                    <h1 className="page-title">Our Products</h1>
                    
                    {loading && (
                        <div className="loading-message">Loading products...</div>
                    )}
                    
                    {error && (
                        <div className="error-message">{error}</div>
                    )}
                    
                    {!loading && !error && products.length === 0 && (
                        <div className="no-products-message">No products available</div>
                    )}
                    
                    {!loading && !error && products.length > 0 && (
                        <div className="products-grid">
                                {products.map((product) => (
                                    <div key={product._id} className="product-card">
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <p className="product-description">{product.description}</p>
                                            <div className="product-details">
                                                <span className="product-category" onClick={() => navigate(`/product/${product._id}`)}>Explore More</span>
                                            </div>
                                            <div className="product-price">${product.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}