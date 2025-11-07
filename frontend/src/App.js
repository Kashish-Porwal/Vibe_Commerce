/*import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './components/Products';
import Cart from './components/Cart';
import { getCart } from './services/api';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const data = await getCart();
      const count = data.cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">
              <h1>Vibe Commerce</h1>
            </Link>
            <nav>
              <Link to="/" className="nav-link">Products</Link>
              <Link to="/cart" className="nav-link cart-link">
                Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Products onCartUpdate={fetchCartCount} />} />
            <Route path="/cart" element={<Cart onCartUpdate={fetchCartCount} />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Vibe Commerce. Mock E-Commerce Cart Assignment.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;*/
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Products from "./components/Products";
import Cart from "./components/Cart";
import AnimatedBackground from "./components/AnimatedBackground";
import { getCart } from "./services/api";
import "./App.css";
import "./index.css";

function AppContent() {
  const [cartCount, setCartCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const location = useLocation();

  const fetchCartCount = async () => {
    try {
      setLoadingCart(true);
      const data = await getCart();
      const count = data?.cart?.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      setCartCount(count || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <Navbar cartCount={cartCount} loadingCart={loadingCart} />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route
                path="/"
                element={<Products onCartUpdate={fetchCartCount} />}
              />
              <Route
                path="/cart"
                element={<Cart onCartUpdate={fetchCartCount} />}
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

