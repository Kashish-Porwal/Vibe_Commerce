import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCart, removeFromCart, updateCartItem, checkout } from "../services/api";
import CheckoutModal from "./CheckoutModal";
import Toast from "./Toast";
import LoadingSpinner from "./LoadingSpinner";

export default function Cart({ onCartUpdate }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      setLoading(true);
      setError(null);
      const res = await getCart();
      const items = res?.cart ?? [];
      const cartTotal = parseFloat(res?.total ?? 0);
      setCart(items);
      setTotal(cartTotal);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(itemId) {
    try {
      setRemovingId(itemId);
      setError(null);
      const item = cart.find(i => i._id === itemId);
      const productName = item?.productId?.name || "Item";
      
      await removeFromCart(itemId);
      await fetchCart();
      
      setToast({
        visible: true,
        message: `${productName} removed from cart`,
        type: "info"
      });
      
      if (typeof onCartUpdate === "function") onCartUpdate();
      
      setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 3000);
    } catch (err) {
      console.error("Failed to remove item", err);
      setError("Failed to remove item. Please try again.");
      setToast({
        visible: true,
        message: "Failed to remove item. Please try again.",
        type: "error"
      });
      setRemovingId(null);
      setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 3000);
    }
  }

  async function handleQuantityChange(itemId, newQuantity) {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingId(itemId);
      setError(null);
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
      await updateCartItem(itemId, newQuantity);
      await fetchCart();
      
      if (typeof onCartUpdate === "function") onCartUpdate();
    } catch (err) {
      console.error("Failed to update quantity", err);
      setError("Failed to update quantity. Please try again.");
      setToast({
        visible: true,
        message: "Failed to update quantity. Please try again.",
        type: "error"
      });
      setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 3000);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCheckout(name, email) {
    try {
      setError(null);
      const response = await checkout(cart, name, email);
      setReceipt(response.receipt);
      await fetchCart();
      if (typeof onCartUpdate === "function") onCartUpdate();
      setShowCheckout(false);
    } catch (err) {
      console.error("Checkout failed", err);
      setError("Checkout failed. Please try again.");
      throw err;
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <LoadingSpinner size="xl" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-lg mt-4"
        >
          Loading cart…
        </motion.p>
      </motion.div>
    );
  }

  if (error && !cart.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center justify-center py-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="p-6 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 mb-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </motion.div>
        <motion.button
          onClick={fetchCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg transition-all"
        >
          Retry
        </motion.button>
      </motion.div>
    );
  }

  if (!cart.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col items-center justify-center py-20"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-8xl mb-6"
        >
          🛒
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Your cart is empty
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/70 mb-6"
        >
          Add items to your cart and they will appear here.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = "/"}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg transition-all"
        >
          Start Shopping
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
    >
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          staggerChildren: 0.1
        }}
        className="mb-6"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent mb-2"
        >
          Shopping Cart
        </motion.h2>
        <motion.p
          key={cart.length}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white/60"
        >
          {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
        </motion.p>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {cart.map((item, index) => {
            const product = item.productId || {};
            const itemTotal = (product.price || 0) * (item.quantity || 0);
            
            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ 
                  opacity: 0, 
                  x: -100, 
                  scale: 0.8,
                  rotate: -10,
                  transition: { duration: 0.4, ease: "easeIn" } 
                }}
                transition={{ 
                  layout: { duration: 0.4, ease: "easeInOut" },
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-2xl p-6"
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-violet-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  initial={false}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Product Image */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10"
                  >
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                      {product.name || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-white/60 mb-2">Category: {product.category || "N/A"}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-white/90">
                        ₹{(product.price || 0).toFixed(2)}
                      </span>
                      <span className="text-sm text-white/50">each</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-1 bg-white/10 rounded-xl border border-white/20 p-1"
                    >
                      <motion.button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={updatingId === item._id || item.quantity <= 1}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-lg hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold relative"
                      >
                        {updatingId === item._id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <motion.span
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            −
                          </motion.span>
                        )}
                      </motion.button>
                      <motion.span
                        key={item.quantity}
                        initial={{ scale: 1.3, color: "#fff" }}
                        animate={{ scale: 1, color: "#fff" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="px-4 py-2 text-white font-bold text-lg min-w-[3rem] text-center"
                      >
                        {updatingId === item._id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          item.quantity
                        )}
                      </motion.span>
                      <motion.button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={updatingId === item._id}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-lg hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold"
                      >
                        {updatingId === item._id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <motion.span
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            +
                          </motion.span>
                        )}
                      </motion.button>
                    </motion.div>

                    {/* Item Total */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-right min-w-[100px]"
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        ₹{itemTotal.toFixed(2)}
                      </div>
                      <div className="text-xs text-white/50 mt-0.5">
                        {item.quantity} × ₹{(product.price || 0).toFixed(2)}
                      </div>
                    </motion.div>

                    {/* Remove Button */}
                    <motion.button
                      onClick={() => handleRemove(item._id)}
                      disabled={removingId === item._id}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {removingId === item._id ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center justify-center"
                          >
                            <LoadingSpinner size="sm" className="text-red-300" />
                          </motion.div>
                        ) : (
                          <motion.svg
                            key="icon"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="w-5 h-5 text-red-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cart Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: 0.3,
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
        className="mt-8 pt-6 border-t border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-6 relative overflow-hidden"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-violet-500/20 to-purple-500/0 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-semibold text-white">Total:</span>
          <motion.span
            key={total}
            initial={{ scale: 1.2, color: "#fff" }}
            animate={{ 
              scale: 1,
              color: ["#fff", "#a78bfa", "#fff"]
            }}
            transition={{ 
              scale: { type: "spring", stiffness: 200, damping: 15 },
              color: { duration: 0.5 }
            }}
            className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
          >
            ₹{total.toFixed(2)}
          </motion.span>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <motion.button
            onClick={() => window.location.href = "/"}
            whileHover={{ 
              scale: 1.05,
              x: -5
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all overflow-hidden group"
          >
            <motion.span
              className="flex items-center gap-2 relative z-10"
              whileHover={{ x: -3 }}
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [-3, 0, -3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </motion.svg>
              Continue Shopping
            </motion.span>
          </motion.button>
          <motion.button
            onClick={() => setShowCheckout(true)}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 40px rgba(99, 102, 241, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden group"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-violet-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
              Proceed to Checkout
            </span>
          </motion.button>
    </div>
      </motion.div>

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
    </motion.div>
  );
}

