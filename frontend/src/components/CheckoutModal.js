import React, { useState } from 'react';
import './CheckoutModal.css';

function CheckoutModal({ onClose, onCheckout, receipt }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCheckout(name, email);
    } catch (err) {
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content receipt" onClick={(e) => e.stopPropagation()}>
          <h2>Order Confirmation</h2>
          <div className="receipt-details">
            <p><strong>Order ID:</strong> {receipt.orderId}</p>
            <p><strong>Name:</strong> {receipt.customerName}</p>
            <p><strong>Email:</strong> {receipt.customerEmail}</p>
            <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
            
            <div className="receipt-items">
              <h3>Items:</h3>
              {receipt.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.subtotal}</span>
                </div>
              ))}
            </div>
            
            <div className="receipt-total">
              <strong>Total:</strong> <span>${receipt.total}</span>
            </div>
            
            <p className="receipt-status">Status: {receipt.status}</p>
          </div>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;
