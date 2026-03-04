import React from 'react'
import { motion } from 'framer-motion'

const LoadingState = () => {
  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1, transition: { duration: 0.6, repeat: Infinity } }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      {/* Search Bar Skeleton */}
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="mb-8 h-12 bg-white/40 dark:bg-slate-700/40 backdrop-blur-lg rounded-xl"
      />

      {/* Main Weather Card Skeleton */}
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-lg rounded-3xl p-8 mb-6 h-80"
      />

      {/* Chart Skeleton */}
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-lg rounded-3xl p-6 mb-6 h-80"
      />

      {/* Forecast Cards Skeleton */}
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-lg rounded-3xl p-6 h-64"
      />

      {/* Loading Text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-center mt-8 text-gray-600 dark:text-gray-400 font-inter"
      >
        Fetching weather data...
      </motion.p>
    </motion.div>
  )
}

export default LoadingState
