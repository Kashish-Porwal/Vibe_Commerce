const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart - Get cart with populated products and total
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest-user';
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    res.json({
      cart: cart.items,
      total: total.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.body.userId || 'guest-user';

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.status(201).json({ message: 'Item added to cart', cart: cart.items });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.query.userId || 'guest-user';

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({ message: 'Item removed from cart', cart: cart.items });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
});

// PUT /api/cart/:id - Update item quantity
router.put('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { quantity } = req.body;
    const userId = req.query.userId || 'guest-user';

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.productId');

    res.json({ message: 'Cart updated', cart: cart.items });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
});

module.exports = router;
