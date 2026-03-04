import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { getAIPrediction } from '../utils/helpers'

const AIPredictionBox = ({ currentWeather, tomorrowWeather }) => {
  if (!currentWeather || !tomorrowWeather) return null

  const prediction = getAIPrediction(currentWeather.main.temp, tomorrowWeather.temp_avg)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gradient-to-r from-purple-400/40 to-pink-400/40 dark:from-purple-600/40 dark:to-pink-600/40 backdrop-blur-lg rounded-3xl p-6 mb-6 shadow-xl border border-white/30 dark:border-slate-600/30"
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex-shrink-0"
        >
          <Sparkles size={32} className="text-purple-600 dark:text-purple-400" />
        </motion.div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-poppins flex items-center gap-2">
            AI Weather Prediction
          </h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-800 dark:text-gray-200 font-inter leading-relaxed"
          >
            {prediction.text}
          </motion.p>

          {/* Confidence Meter */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-4 h-2 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-full"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-inter">
            Based on current weather patterns
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default AIPredictionBox
