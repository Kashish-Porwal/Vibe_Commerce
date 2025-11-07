# 🚀 Quick Start Guide

## Prerequisites Check
- ✅ Node.js installed
- ✅ MongoDB running locally
- ✅ Two terminal windows ready

## Start the Application

### Terminal 1 - Backend (Port 5001)
```bash
cd backend
npm install      # If not done yet
npm run seed     # Seed database (first time only)
npm run dev      # Start backend server
```

You should see:
```
Server is running on port 5001
MongoDB connected successfully
```

### Terminal 2 - Frontend (Port 3000)
```bash
cd frontend
npm install      # If not done yet
npm start        # Start React app
```

Browser will automatically open at `http://localhost:3000`

## 🎯 Test the Features

1. **Browse Products** - See 10 mock products on homepage
2. **Add to Cart** - Click "Add to Cart" button
3. **View Cart** - Click "Cart" in header
4. **Update Quantity** - Use +/- buttons
5. **Remove Items** - Click "Remove" button
6. **Checkout** - Fill form with name and email
7. **View Receipt** - See order confirmation

## 🔧 Troubleshooting

### MongoDB not running?
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### Port conflicts?
Backend uses port 5001, frontend uses 3000. If conflicts exist, update:
- `backend/.env` - Change PORT value
- `frontend/.env` - Change REACT_APP_API_URL

### Need to reseed database?
```bash
cd backend
npm run seed
```

## 📦 What's Included

- ✅ Full REST API with 5 endpoints
- ✅ 10 mock products (seeded)
- ✅ MongoDB database persistence
- ✅ React frontend with routing
- ✅ Responsive design (mobile-friendly)
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation

## 🎨 Key Features

- Real-time cart count in header
- Smooth animations and transitions
- Professional UI/UX design
- Mock checkout with receipt
- Complete CRUD operations for cart

## 📚 Next Steps

- Check `README.md` for detailed documentation
- Review API endpoints in README
- Explore the codebase structure
- Customize styling in CSS files

---

**Note:** Make sure MongoDB is running before starting the backend!
