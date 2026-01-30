import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { api, getUserIdFromToken } from './config/api'
import { HomePage } from './pages/Homepage/HomePage.jsx'
import { LoginPage } from './pages/Login/LoginPage.jsx'
import { RegisterPage } from './pages/Register/RegisterPage.jsx'
import { Product } from './pages/Product/product.jsx'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const loadCart = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const response = await api.get(`/cart/${userId}`);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadCart();
  }, [isAuthenticated]);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/product/:productId"
        element={
          <ProtectedRoute>
            <Product loadCart={loadCart} cartItems={cartItems} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage loadCart={loadCart} cartItems={cartItems} />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App