import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

const ErrorState = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-red-400/20 dark:bg-red-500/20 backdrop-blur-lg rounded-3xl p-8 border border-red-200 dark:border-red-600 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertCircle size={32} className="text-red-600 dark:text-red-400 flex-shrink-0" />
          </motion.div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2 font-poppins">
              Something went wrong
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4 font-inter">
              {error}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-poppins font-medium transition"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center mt-8 text-white/70 font-inter text-sm"
      >
        Make sure you have an internet connection and try again
      </motion.p>
    </motion.div>
  )
}

export default ErrorState
