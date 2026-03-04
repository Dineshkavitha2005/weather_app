import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GitCompare, 
  Search, 
  X, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  Gauge,
  Cloud,
  Sunrise,
  Sunset,
  ArrowRight,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { getWeatherByCity } from '../utils/weatherAPI'
import { useWeatherContext } from '../utils/WeatherContext'

const CityCompare = () => {
  const { isDarkMode, savedLocations } = useWeatherContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const [city1, setCity1] = useState('')
  const [city2, setCity2] = useState('')
  const [weather1, setWeather1] = useState(null)
  const [weather2, setWeather2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuggestions1, setShowSuggestions1] = useState(false)
  const [showSuggestions2, setShowSuggestions2] = useState(false)

  const popularCities = ['Mumbai', 'Delhi', 'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai']

  const fetchComparison = async () => {
    if (!city1.trim() || !city2.trim()) {
      setError('Please enter both cities to compare')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [data1, data2] = await Promise.all([
        getWeatherByCity(city1),
        getWeatherByCity(city2)
      ])
      setWeather1(data1)
      setWeather2(data2)
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const swapCities = () => {
    setCity1(city2)
    setCity2(city1)
    setWeather1(weather2)
    setWeather2(weather1)
  }

  const clearComparison = () => {
    setCity1('')
    setCity2('')
    setWeather1(null)
    setWeather2(null)
    setError(null)
  }

  // Prepare chart data
  const getBarChartData = () => {
    if (!weather1 || !weather2) return []

    return [
      {
        name: 'Temp (°C)',
        [weather1.name]: Math.round(weather1.main.temp),
        [weather2.name]: Math.round(weather2.main.temp)
      },
      {
        name: 'Feels Like',
        [weather1.name]: Math.round(weather1.main.feels_like),
        [weather2.name]: Math.round(weather2.main.feels_like)
      },
      {
        name: 'Humidity (%)',
        [weather1.name]: weather1.main.humidity,
        [weather2.name]: weather2.main.humidity
      },
      {
        name: 'Wind (km/h)',
        [weather1.name]: Math.round(weather1.wind.speed * 3.6),
        [weather2.name]: Math.round(weather2.wind.speed * 3.6)
      },
      {
        name: 'Clouds (%)',
        [weather1.name]: weather1.clouds.all,
        [weather2.name]: weather2.clouds.all
      }
    ]
  }

  const getRadarChartData = () => {
    if (!weather1 || !weather2) return []

    // Normalize values to 0-100 scale for radar chart
    const normalize = (value, min, max) => ((value - min) / (max - min)) * 100

    return [
      {
        metric: 'Temperature',
        [weather1.name]: normalize(weather1.main.temp, -20, 50),
        [weather2.name]: normalize(weather2.main.temp, -20, 50),
        fullMark: 100
      },
      {
        metric: 'Humidity',
        [weather1.name]: weather1.main.humidity,
        [weather2.name]: weather2.main.humidity,
        fullMark: 100
      },
      {
        metric: 'Wind Speed',
        [weather1.name]: normalize(weather1.wind.speed * 3.6, 0, 100),
        [weather2.name]: normalize(weather2.wind.speed * 3.6, 0, 100),
        fullMark: 100
      },
      {
        metric: 'Pressure',
        [weather1.name]: normalize(weather1.main.pressure, 950, 1050),
        [weather2.name]: normalize(weather2.main.pressure, 950, 1050),
        fullMark: 100
      },
      {
        metric: 'Cloudiness',
        [weather1.name]: weather1.clouds.all,
        [weather2.name]: weather2.clouds.all,
        fullMark: 100
      },
      {
        metric: 'Visibility',
        [weather1.name]: normalize(weather1.visibility || 10000, 0, 10000),
        [weather2.name]: normalize(weather2.visibility || 10000, 0, 10000),
        fullMark: 100
      }
    ]
  }

  const ComparisonCard = ({ label, value1, value2, unit, icon: Icon }) => {
    const diff = value1 - value2
    const winner = diff > 0 ? 1 : diff < 0 ? 2 : 0

    return (
      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon size={18} className="text-blue-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className={`text-center flex-1 ${winner === 1 ? 'text-green-600 dark:text-green-400' : ''}`}>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value1}{unit}
            </p>
            {winner === 1 && <span className="text-xs">Higher</span>}
          </div>
          <div className="px-3">
            <span className={`text-sm font-medium ${
              diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {diff > 0 ? '+' : ''}{diff.toFixed(1)}
            </span>
          </div>
          <div className={`text-center flex-1 ${winner === 2 ? 'text-green-600 dark:text-green-400' : ''}`}>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value2}{unit}
            </p>
            {winner === 2 && <span className="text-xs">Higher</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto mb-8"
    >
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
        {/* Header */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/50 dark:hover:bg-slate-700/50 transition"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
              <GitCompare size={24} />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-poppins">
                Compare Cities
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                Side-by-side weather comparison with charts
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={24} className="text-gray-500 dark:text-gray-400" />
          </motion.div>
        </motion.button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-gray-200 dark:border-slate-700">
                {/* City Input Section */}
                <div className="pt-6 flex flex-col md:flex-row items-center gap-4">
                  {/* City 1 Input */}
                  <div className="flex-1 w-full relative">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={city1}
                        onChange={(e) => setCity1(e.target.value)}
                        onFocus={() => setShowSuggestions1(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions1(false), 200)}
                        placeholder="First city (e.g., Mumbai)"
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border-2 border-transparent focus:border-purple-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
                      />
                    </div>
                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                      {showSuggestions1 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                        >
                          {savedLocations.length > 0 && (
                            <div className="p-2 border-b border-gray-200 dark:border-slate-700">
                              <p className="text-xs text-gray-500 px-2 mb-1">Saved Locations</p>
                              {savedLocations.slice(0, 3).map(loc => (
                                <button
                                  key={loc.id}
                                  onClick={() => { setCity1(loc.name); setShowSuggestions1(false) }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {loc.name}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="p-2">
                            <p className="text-xs text-gray-500 px-2 mb-1">Popular Cities</p>
                            {popularCities.slice(0, 4).map(city => (
                              <button
                                key={city}
                                onClick={() => { setCity1(city); setShowSuggestions1(false) }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                              >
                                {city}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Swap Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swapCities}
                    className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                  >
                    <RefreshCw size={20} className="text-gray-600 dark:text-gray-400" />
                  </motion.button>

                  {/* City 2 Input */}
                  <div className="flex-1 w-full relative">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={city2}
                        onChange={(e) => setCity2(e.target.value)}
                        onFocus={() => setShowSuggestions2(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions2(false), 200)}
                        placeholder="Second city (e.g., Delhi)"
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
                      />
                    </div>
                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                      {showSuggestions2 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                        >
                          {savedLocations.length > 0 && (
                            <div className="p-2 border-b border-gray-200 dark:border-slate-700">
                              <p className="text-xs text-gray-500 px-2 mb-1">Saved Locations</p>
                              {savedLocations.slice(0, 3).map(loc => (
                                <button
                                  key={loc.id}
                                  onClick={() => { setCity2(loc.name); setShowSuggestions2(false) }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {loc.name}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="p-2">
                            <p className="text-xs text-gray-500 px-2 mb-1">Popular Cities</p>
                            {popularCities.slice(4).map(city => (
                              <button
                                key={city}
                                onClick={() => { setCity2(city); setShowSuggestions2(false) }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                              >
                                {city}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchComparison}
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw size={20} />
                      </motion.div>
                    ) : (
                      <>
                        <GitCompare size={20} />
                        Compare
                      </>
                    )}
                  </motion.button>
                  {(weather1 || weather2) && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearComparison}
                      className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition"
                    >
                      Clear
                    </motion.button>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Comparison Results */}
                <AnimatePresence>
                  {weather1 && weather2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 space-y-6"
                    >
                      {/* City Headers */}
                      <div className="grid grid-cols-2 gap-4">
                        {[weather1, weather2].map((weather, idx) => (
                          <motion.div
                            key={weather.name}
                            initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-4 rounded-2xl ${
                              idx === 0 
                                ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-300/30' 
                                : 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-300/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt={weather.weather[0].description}
                                className="w-16 h-16"
                              />
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {weather.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                  {weather.weather[0].description}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  {Math.round(weather.main.temp)}°C
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Comparison Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ComparisonCard
                          label="Temperature"
                          value1={Math.round(weather1.main.temp)}
                          value2={Math.round(weather2.main.temp)}
                          unit="°C"
                          icon={Thermometer}
                        />
                        <ComparisonCard
                          label="Feels Like"
                          value1={Math.round(weather1.main.feels_like)}
                          value2={Math.round(weather2.main.feels_like)}
                          unit="°C"
                          icon={Thermometer}
                        />
                        <ComparisonCard
                          label="Humidity"
                          value1={weather1.main.humidity}
                          value2={weather2.main.humidity}
                          unit="%"
                          icon={Droplets}
                        />
                        <ComparisonCard
                          label="Wind Speed"
                          value1={Math.round(weather1.wind.speed * 3.6)}
                          value2={Math.round(weather2.wind.speed * 3.6)}
                          unit=" km/h"
                          icon={Wind}
                        />
                        <ComparisonCard
                          label="Pressure"
                          value1={weather1.main.pressure}
                          value2={weather2.main.pressure}
                          unit=" hPa"
                          icon={Gauge}
                        />
                        <ComparisonCard
                          label="Cloudiness"
                          value1={weather1.clouds.all}
                          value2={weather2.clouds.all}
                          unit="%"
                          icon={Cloud}
                        />
                      </div>

                      {/* Bar Chart */}
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          📊 Comparison Bar Chart
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={getBarChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                              }}
                            />
                            <Legend />
                            <Bar dataKey={weather1.name} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey={weather2.name} fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Radar Chart */}
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          🎯 Overall Comparison Radar
                        </h4>
                        <ResponsiveContainer width="100%" height={350}>
                          <RadarChart data={getRadarChartData()}>
                            <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                            <PolarAngleAxis 
                              dataKey="metric" 
                              tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]}
                              tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563', fontSize: 10 }}
                            />
                            <Radar
                              name={weather1.name}
                              dataKey={weather1.name}
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.3}
                            />
                            <Radar
                              name={weather2.name}
                              dataKey={weather2.name}
                              stroke="#6366f1"
                              fill="#6366f1"
                              fillOpacity={0.3}
                            />
                            <Legend />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                border: 'none',
                                borderRadius: '12px'
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Summary */}
                      <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          📝 Quick Summary
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {weather1.main.temp > weather2.main.temp 
                            ? `${weather1.name} is ${(weather1.main.temp - weather2.main.temp).toFixed(1)}°C warmer than ${weather2.name}.`
                            : `${weather2.name} is ${(weather2.main.temp - weather1.main.temp).toFixed(1)}°C warmer than ${weather1.name}.`
                          }
                          {' '}
                          {weather1.main.humidity > weather2.main.humidity
                            ? `${weather1.name} has higher humidity (${weather1.main.humidity}% vs ${weather2.main.humidity}%).`
                            : `${weather2.name} has higher humidity (${weather2.main.humidity}% vs ${weather1.main.humidity}%).`
                          }
                          {' '}
                          {weather1.wind.speed > weather2.wind.speed
                            ? `Winds are stronger in ${weather1.name}.`
                            : `Winds are stronger in ${weather2.name}.`
                          }
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CityCompare
