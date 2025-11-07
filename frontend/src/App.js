import React, { useState, useEffect } from 'react';
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

export default App;
