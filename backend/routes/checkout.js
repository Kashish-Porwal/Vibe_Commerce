const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// POST /api/checkout - Process checkout
router.post('/', async (req, res) => {
  try {
    const { cartItems, name, email } = req.body;
    const userId = req.body.userId || 'guest-user';

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    // Create mock receipt
    const receipt = {
      orderId: `ORD-${Date.now()}`,
      customerName: name,
      customerEmail: email,
      items: cartItems.map(item => ({
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        subtotal: (item.productId.price * item.quantity).toFixed(2)
      })),
      total: total.toFixed(2),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Clear cart after checkout
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      message: 'Checkout successful',
      receipt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing checkout', error: error.message });
  }
});

module.exports = router;
