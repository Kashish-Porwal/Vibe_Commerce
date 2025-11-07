import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600"
          />
          
          <div className="p-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-center text-white mb-2"
            >
              Order Confirmed!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-white/70 mb-8"
            >
              Thank you for your purchase
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Order ID</p>
                  <p className="text-white font-semibold">{receipt.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Date</p>
                  <p className="text-white font-semibold">{new Date(receipt.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Name</p>
                  <p className="text-white font-semibold">{receipt.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Email</p>
                  <p className="text-white font-semibold">{receipt.customerEmail}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Items:</h3>
                <div className="space-y-2">
                  {receipt.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                    >
                      <span className="text-white">{item.name} × {item.quantity}</span>
                      <span className="text-white font-semibold">₹{item.subtotal}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-between items-center pt-4 border-t border-white/10"
              >
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  ₹{receipt.total}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="pt-4"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Status: {receipt.status}
                </span>
              </motion.div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg transition-all"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Backdrop animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: 20 }}
        transition={{ 
          type: "spring", 
          duration: 0.6,
          stiffness: 200,
          damping: 20
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/30 to-purple-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="p-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-3xl font-bold text-white mb-6 text-center"
          >
            Checkout
          </motion.h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <motion.label
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                htmlFor="name"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Full Name
              </motion.label>
              <motion.input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                whileFocus={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.5)" }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <motion.label
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Email
              </motion.label>
              <motion.input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                whileFocus={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.5)" }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 pt-4"
            >
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  'Complete Order'
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CheckoutModal;
