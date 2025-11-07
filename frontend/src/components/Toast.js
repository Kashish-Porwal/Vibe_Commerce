import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function Toast({ message, type = "success", onClose, visible }) {
  const icons = {
    success: (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    ),
    error: (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.div>
    ),
    info: (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>
    ),
  };

  const styles = {
    success: "bg-green-500/20 border-green-500/50 text-green-200",
    error: "bg-red-500/20 border-red-500/50 text-red-200",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-200",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.8 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 z-50"
        >
          <motion.div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${styles[type]}`}
            whileHover={{ scale: 1.02 }}
          >
            {icons[type]}
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="font-semibold text-sm"
            >
              {message}
            </motion.p>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;

