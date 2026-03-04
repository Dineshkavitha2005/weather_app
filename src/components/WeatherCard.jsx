import React from 'react'
import { motion } from 'framer-motion'
import { Cloud, Droplets, Wind, Eye, Sun, Moon } from 'lucide-react'
import { getWeatherIconUrl, formatTime } from '../utils/helpers'

const WeatherCard = ({ weather, forecast }) => {
  if (!weather) return null

  const sunrise = formatTime(weather.sys.sunrise)
  const sunset = formatTime(weather.sys.sunset)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Main Weather Card */}
      <div className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-lg rounded-3xl p-8 mb-6 shadow-xl border border-white/20 dark:border-slate-600/20 hover:shadow-2xl transition">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          {/* Left: Temperature & Location */}
          <div className="flex items-center mb-6 sm:mb-0">
            <div className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white mr-4">
              {Math.round(weather.main.temp)}°
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-poppins">
                {weather.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-inter capitalize">
                {weather.weather[0].main}
              </p>
            </div>
          </div>

          {/* Right: Weather Icon */}
          <motion.img
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            src={getWeatherIconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].main}
            className="w-32 h-32 drop-shadow-lg"
          />
        </div>

        {/* Feels Like & Conditions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-slate-600">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-inter">Feels Like</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(weather.main.feels_like)}°
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-inter">Min / Max</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°
            </p>
          </div>
          <div className="text-center col-span-2 sm:col-span-1">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-inter">Pressure</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.main.pressure} hPa
            </p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Humidity */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-2xl p-4 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-inter">Humidity</span>
              <Droplets size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.main.humidity}%
            </p>
          </motion.div>

          {/* Wind Speed */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-teal-400/20 to-green-400/20 dark:from-teal-500/20 dark:to-green-500/20 rounded-2xl p-4 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-inter">Wind</span>
              <Wind size={18} className="text-teal-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(weather.wind.speed)} m/s
            </p>
          </motion.div>

          {/* Visibility */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-amber-500/20 dark:to-orange-500/20 rounded-2xl p-4 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-inter">Visibility</span>
              <Eye size={18} className="text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(weather.visibility / 1000).toFixed(1)} km
            </p>
          </motion.div>

          {/* Cloud Coverage */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-400/20 to-slate-400/20 dark:from-gray-500/20 dark:to-slate-500/20 rounded-2xl p-4 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-inter">Clouds</span>
              <Cloud size={18} className="text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.clouds.all}%
            </p>
          </motion.div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-300/20 to-orange-300/20 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-2xl p-4 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-inter">Sunrise</span>
              <Sun size={18} className="text-yellow-500" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {sunrise}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-indigo-300/20 to-purple-300/20 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl p-4 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-inter">Sunset</span>
              <Moon size={18} className="text-indigo-500" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {sunset}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherCard
