import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar({ cartCount = 0, loadingCart = false }) {
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-4 right-4 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="max-w-7xl mx-auto flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl"
      >
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              V
            </motion.span>
          </motion.div>
          <div className="leading-tight">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-bold text-lg group-hover:text-white/90 transition-colors"
            >
              Vibe Commerce
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-white/60"
            >
              Mock e-commerce
            </motion.div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className={`relative text-sm font-medium transition-colors px-4 py-2 rounded-lg ${
                location.pathname === "/"
                  ? "text-white bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              Products
              {location.pathname === "/" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          </motion.div>

          {/* Cart link */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/cart"
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                location.pathname === "/cart"
                  ? "bg-white/15 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white/90"
              }`}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: cartCount > 0 ? [0, -10, 10, -10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7m12-7l2 7M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </motion.svg>

              <span className="text-sm font-medium">Cart</span>

              {/* Cart count badge */}
              <motion.span
                key={cartCount}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: cartCount > 0 ? [1, 1.2, 1] : 1, 
                  rotate: 0 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  scale: { duration: 0.3 }
                }}
                className={`ml-1 inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold transition-all relative ${
                  cartCount > 0
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                    : "bg-white/10 text-white/60"
                }`}
                aria-live="polite"
              >
                {loadingCart ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {cartCount}
                    {cartCount > 0 && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/30"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </>
                )}
              </motion.span>
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </motion.header>
  );
}

export default Navbar;
