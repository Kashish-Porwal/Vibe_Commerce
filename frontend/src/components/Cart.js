import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItem, checkout } from '../services/api';
import CheckoutModal from './CheckoutModal';
import './Cart.css';

function Cart({ onCartUpdate }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data.cart);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await fetchCart();
      onCartUpdate();
    } catch (err) {
      setError('Failed to remove item. Please try again.');
      console.error('Error removing item:', err);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(itemId, newQuantity);
      await fetchCart();
      onCartUpdate();
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      console.error('Error updating quantity:', err);
    }
  };

  const handleCheckout = async (name, email) => {
    try {
      const response = await checkout(cart, name, email);
      setReceipt(response.receipt);
      await fetchCart();
      onCartUpdate();
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error('Error during checkout:', err);
      throw err;
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchCart}>Retry</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.productId.image} alt={item.productId.name} />
            <div className="item-details">
              <h3>{item.productId.name}</h3>
              <p className="item-price">${item.productId.price.toFixed(2)}</p>
            </div>
            <div className="item-controls">
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                Remove
              </button>
            </div>
            <div className="item-subtotal">
              ${(item.productId.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ${total}</h3>
        <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
          Proceed to Checkout
        </button>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onCheckout={handleCheckout}
        />
      )}

      {receipt && (
        <CheckoutModal
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}

export default Cart;
