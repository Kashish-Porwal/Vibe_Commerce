#!/bin/bash

echo "🧪 Testing Vibe Commerce API Endpoints"
echo "========================================"

# Start backend server in background
cd backend
node server.js &
SERVER_PID=$!
echo "Started backend server (PID: $SERVER_PID)"

# Wait for server to start
sleep 3

BASE_URL="http://localhost:5001/api"

echo ""
echo "1️⃣ Testing GET /api/products"
curl -s "$BASE_URL/products" | head -c 200
echo "... ✅"

echo ""
echo ""
echo "2️⃣ Testing POST /api/cart (Add item)"
RESPONSE=$(curl -s -X POST "$BASE_URL/cart" \
  -H "Content-Type: application/json" \
  -d '{"productId":"test_id","quantity":1}')
echo "$RESPONSE" | head -c 200
echo "..."

echo ""
echo ""
echo "3️⃣ Testing GET /api/cart"
curl -s "$BASE_URL/cart" | head -c 200
echo "... ✅"

echo ""
echo ""
echo "4️⃣ Testing health check"
curl -s "$BASE_URL/../" | head -c 100
echo " ✅"

# Cleanup
echo ""
echo ""
echo "🧹 Cleaning up..."
kill $SERVER_PID
echo "✅ Tests completed!"
