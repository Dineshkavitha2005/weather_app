import React from 'react'
import { motion } from 'framer-motion'
import { getWeatherIconUrl, formatDayForForecast } from '../utils/helpers'

const SevenDayForecast = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-lg rounded-3xl p-6 mb-6 shadow-xl border border-white/20 dark:border-slate-600/20"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-poppins">
        7-Day Forecast
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
      >
        {forecast.slice(0, 7).map((day, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-white/40 to-transparent dark:from-slate-600/40 dark:to-transparent rounded-2xl p-3 backdrop-blur border border-white/20 dark:border-slate-600/20 hover:shadow-lg transition"
          >
            {/* Day Name */}
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 font-inter mb-2 text-center">
              {formatDayForForecast(day.dt)}
            </p>

            {/* Weather Icon */}
            <div className="flex justify-center mb-2">
              <img
                src={getWeatherIconUrl(day.weather.icon)}
                alt={day.weather.main}
                className="w-14 h-14 drop-shadow-lg"
              />
            </div>

            {/* Weather Condition */}
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2 capitalize">
              {day.weather.main}
            </p>

            {/* Temperature Range */}
            <div className="flex justify-between items-center mb-2 border-t border-white/20 dark:border-slate-600/20 pt-2">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">Max</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(day.temp_max)}°
                </p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">Min</p>
                <p className="text-lg font-bold text-gray-600 dark:text-gray-300">
                  {Math.round(day.temp_min)}°
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>💧</span>
                <span>{day.humidity}%</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>💨</span>
                <span>{Math.round(day.wind_speed)} m/s</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default SevenDayForecast
