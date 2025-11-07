# Vibe Commerce - Mock E-Commerce Cart

A full-stack shopping cart application built for Vibe Commerce screening assignment.

## 🚀 Features

- **Product Catalog**: Browse 10 mock products with images, prices, and descriptions
- **Shopping Cart**: Add, remove, and update item quantities
- **Real-time Cart Updates**: Cart count updates immediately in header
- **Checkout Flow**: Mock checkout with customer information form
- **Order Receipt**: Display order confirmation with details and timestamp
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: User-friendly error messages throughout the app
- **Database Persistence**: Cart data stored in MongoDB

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **dotenv** for environment configuration

### Frontend
- **React** (Create React App)
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for responsive styling

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vibe-commerce-cart
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/vibe-commerce
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibe-commerce

# Seed the database with mock products
npm run seed

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Products

#### GET `/api/products`
Get all products

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Product Name",
    "price": 29.99,
    "description": "Product description",
    "category": "Electronics",
    "image": "image_url",
    "stock": 100
  }
]
```

### Cart

#### GET `/api/cart`
Get cart items with total

**Response:**
```json
{
  "cart": [
    {
      "_id": "cart_item_id",
      "productId": {
        "_id": "product_id",
        "name": "Product Name",
        "price": 29.99
      },
      "quantity": 2
    }
  ],
  "total": "59.98"
}
```

#### POST `/api/cart`
Add item to cart

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

#### PUT `/api/cart/:id`
Update cart item quantity

**Request Body:**
```json
{
  "quantity": 3
}
```

#### DELETE `/api/cart/:id`
Remove item from cart

### Checkout

#### POST `/api/checkout`
Process checkout and get receipt

**Request Body:**
```json
{
  "cartItems": [...],
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Checkout successful",
  "receipt": {
    "orderId": "ORD-1234567890",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "items": [...],
    "total": "59.98",
    "timestamp": "2025-01-07T13:00:00.000Z",
    "status": "completed"
  }
}
```

## 📁 Project Structure

```
vibe-commerce-cart/
├── backend/
│   ├── models/
│   │   ├── Product.js        # Product schema
│   │   └── Cart.js           # Cart schema
│   ├── routes/
│   │   ├── products.js       # Product routes
│   │   ├── cart.js           # Cart routes
│   │   └── checkout.js       # Checkout routes
│   ├── server.js             # Express server
│   ├── seed.js               # Database seeder
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Products.js         # Product listing
│   │   │   ├── Products.css
│   │   │   ├── Cart.js             # Cart view
│   │   │   ├── Cart.css
│   │   │   ├── CheckoutModal.js    # Checkout form & receipt
│   │   │   └── CheckoutModal.css
│   │   ├── services/
│   │   │   └── api.js              # API client
│   │   ├── App.js                  # Main app component
│   │   └── App.css
│   └── package.json
│
└── README.md
```

## 🎨 Features Implemented

### Required Features ✅
- ✅ Backend REST APIs (GET products, POST/DELETE/GET cart, POST checkout)
- ✅ 10 mock products with details
- ✅ React frontend with products grid
- ✅ Add to cart functionality
- ✅ Cart view with items, quantities, and total
- ✅ Remove and update cart items
- ✅ Checkout form with name and email
- ✅ Receipt modal with order details
- ✅ Responsive design

### Bonus Features ✅
- ✅ MongoDB database persistence
- ✅ Error handling on frontend and backend
- ✅ Mock user ID for cart association
- ✅ Real-time cart count in header
- ✅ Loading states
- ✅ Input validation
- ✅ Clean, modern UI design

## 🧪 Testing the Application

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Browse products** on the home page
3. **Add items to cart** by clicking "Add to Cart"
4. **View cart** by clicking "Cart" in the header
5. **Update quantities** using +/- buttons
6. **Remove items** using "Remove" button
7. **Proceed to checkout** and fill in the form
8. **View receipt** after successful checkout

## 🔍 MongoDB Note

If you don't have MongoDB installed locally, you can:

1. **Install MongoDB locally**: Follow instructions at [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Use MongoDB Atlas** (free tier): 
   - Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get connection string
   - Update `.env` file with the connection string

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file has correct MongoDB URI
- Ensure port 5000 is not in use

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Clear browser cache and reload

### Database seed fails
- Check MongoDB connection
- Verify MongoDB service is running
- Check console logs for specific errors

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vibe-commerce
```

### Frontend (optional)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment Notes

- Backend can be deployed to Heroku, Railway, or any Node.js hosting
- Frontend can be deployed to Vercel, Netlify, or GitHub Pages
- Use MongoDB Atlas for production database
- Update CORS settings for production domains
- Set environment variables on hosting platform

## 👨‍💻 Author

Created for Vibe Commerce coding assignment

## 📄 License

MIT License - feel free to use this project for learning purposes
