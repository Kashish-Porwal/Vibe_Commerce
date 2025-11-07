/*import React, { useState, useEffect } from 'react';
import { getProducts, addToCart } from '../services/api';
import './Products.css';

function Products({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
      onCartUpdate();
      setTimeout(() => setAddingToCart(null), 500);
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
      console.error('Error adding to cart:', err);
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-category">{product.category}</p>
              <div className="product-footer">
                <span className="product-price">₹{product.price.toFixed(2)}</span>
                <button
                  className={`add-to-cart-btn ${addingToCart === product._id ? 'adding' : ''}`}
                  onClick={() => handleAddToCart(product._id)}
                  disabled={addingToCart === product._id}
                >
                  {addingToCart === product._id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;*/


// src/components/Products.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, addToCart } from "../services/api";
import Toast from "./Toast";
import LoadingSpinner from "./LoadingSpinner";

export default function Products({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await getProducts();
        const items = Array.isArray(res) ? res : [];
        if (mounted) setProducts(items);
      } catch (err) {
        console.error("Failed to fetch products", err);
        if (mounted) setError("Failed to load products. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => (mounted = false);
  }, []);

  async function handleAddToCart(product) {
    try {
      setAddingId(product._id);
      setError(null);
      setSuccessId(null);
      
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      await addToCart(product._id, 1);
      
      // Show success animation
      setSuccessId(product._id);
      setToast({
        visible: true,
        message: `${product.name} added to cart!`,
        type: "success"
      });
      
      if (typeof onCartUpdate === "function") onCartUpdate();
      
      // Hide success state after animation
      setTimeout(() => {
        setSuccessId(null);
        setAddingId(null);
      }, 1500);
      
      // Auto-hide toast
      setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 3000);
    } catch (err) {
      console.error("Add to cart failed", err);
      setError("Failed to add item to cart. Please try again.");
      setToast({
        visible: true,
        message: "Failed to add item to cart. Please try again.",
        type: "error"
      });
      setAddingId(null);
      setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 3000);
    }
  }

  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren"
      } 
    },
  };

  const card = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.9,
      rotateX: 15,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      } 
    },
  };

  const shimmerVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <section className="w-full relative">
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
        className="mb-8 flex items-center justify-between"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
          >
            Our Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-white/60 mt-1"
          >
            Discover amazing products
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.5, 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"
        >
          <motion.p
            key={products.length}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-sm text-white/80 font-medium"
          >
            {loading ? "Loading…" : `${products.length} items`}
          </motion.p>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 backdrop-blur-sm"
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

      {loading ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              variants={card}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 h-[400px]"
            >
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          variants={container} 
          initial="hidden" 
          animate="visible" 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {products.map((p, index) => (
              <motion.div
                key={p._id}
                variants={card}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.4
                }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer"
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-violet-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  initial={false}
                />
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <motion.img
                    src={p.image ?? (p.images?.[0] ?? "/placeholder.png")}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15, rotate: 2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  
                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, x: 5 }}
                    className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20 cursor-pointer"
                  >
                    <motion.span
                      className="text-xs font-medium text-white/90"
                      whileHover={{ color: "#fff" }}
                    >
                      {p.category}
                    </motion.span>
                  </motion.div>

                  {/* Stock Badge */}
                  {p.stock > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="absolute top-3 right-3 px-2 py-1 bg-green-500/20 backdrop-blur-md rounded-full border border-green-500/30 cursor-pointer"
                    >
                      <motion.span
                        className="text-xs font-medium text-green-300 flex items-center gap-1"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <motion.div
                          className="w-1.5 h-1.5 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        In Stock
                      </motion.span>
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-white transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2 flex-1">
                    {p.description ?? ""}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <div>
                      <motion.div 
                        className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        ₹{(p.price ?? 0).toFixed(2)}
                      </motion.div>
                      <div className="text-xs text-white/50 mt-0.5">
                        {p.stock ?? 0} available
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleAddToCart(p)}
                      disabled={addingId === p._id || successId === p._id}
                      whileHover={addingId !== p._id && successId !== p._id ? { 
                        scale: 1.05,
                        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)"
                      } : {}}
                      whileTap={addingId !== p._id && successId !== p._id ? { scale: 0.95 } : {}}
                      className={`relative px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group
                        ${addingId === p._id 
                          ? "bg-white/10 cursor-wait text-white/60" 
                          : successId === p._id
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                    >
                      {/* Ripple effect on click */}
                      {addingId !== p._id && successId !== p._id && (
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-xl"
                          initial={{ scale: 0, opacity: 0.5 }}
                          whileTap={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                      <AnimatePresence mode="wait">
                        {addingId === p._id ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <LoadingSpinner size="sm" />
                            <span>Adding...</span>
                          </motion.span>
                        ) : successId === p._id ? (
                          <motion.span
                            key="success"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="flex items-center gap-2"
                          >
                            <motion.svg
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5 }}
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5 }}
                              />
                            </motion.svg>
                            <span>Added!</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <motion.svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              whileHover={{ rotate: 90 }}
                              transition={{ duration: 0.3 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </motion.svg>
                            <span>Add to Cart</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
