require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-commerce';

const products = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    stock: 50
  },
  {
    name: 'Smart Watch',
    price: 199.99,
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    stock: 30
  },
  {
    name: 'Laptop Backpack',
    price: 49.99,
    description: 'Durable water-resistant backpack with padded laptop compartment',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    stock: 100
  },
  {
    name: 'Portable Charger',
    price: 29.99,
    description: '20000mAh fast-charging power bank with dual USB ports',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300',
    stock: 75
  },
  {
    name: 'Bluetooth Speaker',
    price: 59.99,
    description: 'Waterproof portable speaker with 360-degree sound',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
    stock: 60
  },
  {
    name: 'Yoga Mat',
    price: 34.99,
    description: 'Non-slip exercise mat with carrying strap',
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300',
    stock: 80
  },
  {
    name: 'Coffee Maker',
    price: 89.99,
    description: 'Programmable drip coffee maker with thermal carafe',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300',
    stock: 40
  },
  {
    name: 'Desk Lamp',
    price: 39.99,
    description: 'LED desk lamp with adjustable brightness and color temperature',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300',
    stock: 90
  },
  {
    name: 'Water Bottle',
    price: 24.99,
    description: 'Insulated stainless steel bottle keeps drinks cold for 24 hours',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300',
    stock: 120
  },
  {
    name: 'Wireless Mouse',
    price: 19.99,
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
    stock: 100
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
