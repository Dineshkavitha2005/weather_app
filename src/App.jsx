import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import HourlyChart from './components/HourlyChart'
import SevenDayForecast from './components/SevenDayForecast'
import AIPredictionBox from './components/AIPredictionBox'
import WeatherRadar from './components/WeatherRadar'
import SavedLocations from './components/SavedLocations'
import CityCompare from './components/CityCompare'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import ChatBot from './components/ChatBot'
import Login from './components/Login'
import Signup from './components/Signup'
import { WeatherProvider, useWeatherContext } from './utils/WeatherContext'
import { LanguageProvider } from './utils/LanguageContext'
import { AuthProvider, useAuth } from './utils/AuthContext'
import {
  getWeatherByCity,
  getWeatherByCoordinates,
  getCityNameByCoordinates
} from './utils/weatherAPI'
import { process7DayForecast, getWeatherAnimation } from './utils/helpers'

const AppContent = () => {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [sevenDayForecast, setSevenDayForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { saveSearchedCity, lastSearchedCity, isDarkMode } = useWeatherContext()

  // Fetch weather by city
  const handleSearch = async (city) => {
    setLoading(true)
    setError(null)
    try {
      const weather = await getWeatherByCity(city)
      setCurrentWeather(weather)
      saveSearchedCity(weather.name)

      // Fetch forecast data
      const forecastData = await getWeatherByCoordinates(
        weather.coord.lat,
        weather.coord.lon
      )
      setForecast(forecastData)
      setSevenDayForecast(process7DayForecast(forecastData))
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch weather by user location
  const handleLocationClick = async (location) => {
    setLoading(true)
    setError(null)
    try {
      // First get forecast data (which has more detailed info)
      const forecastData = await getWeatherByCoordinates(location.lat, location.lon)
      setForecast(forecastData)
      setSevenDayForecast(process7DayForecast(forecastData))

      // Get city name
      const cityData = await getCityNameByCoordinates(location.lat, location.lon)
      
      // Create a weather object from forecast data
      const currentWeatherData = forecastData.list[0]
      const weatherObj = {
        name: cityData.name || 'Your Location',
        coord: { lat: location.lat, lon: location.lon },
        main: currentWeatherData.main,
        weather: currentWeatherData.weather,
        wind: currentWeatherData.wind,
        clouds: currentWeatherData.clouds,
        visibility: currentWeatherData.visibility,
        sys: {
          country: cityData.country,
          sunrise: forecastData.city.sunrise,
          sunset: forecastData.city.sunset
        }
      }
      
      setCurrentWeather(weatherObj)
      saveSearchedCity(weatherObj.name)
    } catch (err) {
      setError(err.message || 'Failed to fetch location weather')
    } finally {
      setLoading(false)
    }
  }

  // Load last searched city on mount
  useEffect(() => {
    if (lastSearchedCity) {
      handleSearch(lastSearchedCity)
    }
  }, [])

  // Get background gradient based on weather condition
  const getWeatherBackground = () => {
    const weather = currentWeather?.weather[0]?.main?.toLowerCase()
    const isNight = currentWeather?.sys?.sunset && currentWeather?.sys?.sunrise
      ? Date.now() / 1000 > currentWeather.sys.sunset || Date.now() / 1000 < currentWeather.sys.sunrise
      : false

    if (isNight) {
      return {
        gradient: 'from-slate-900 via-indigo-950 to-slate-900',
        darkGradient: 'dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950',
        orb1: 'bg-indigo-600',
        orb2: 'bg-purple-700'
      }
    }

    switch (weather) {
      case 'clear':
        return {
          gradient: 'from-sky-400 via-blue-400 to-cyan-300',
          darkGradient: 'dark:from-slate-900 dark:via-blue-950 dark:to-slate-900',
          orb1: 'bg-yellow-300',
          orb2: 'bg-orange-300'
        }
      case 'clouds':
        return {
          gradient: 'from-slate-400 via-gray-400 to-slate-500',
          darkGradient: 'dark:from-slate-800 dark:via-slate-700 dark:to-slate-800',
          orb1: 'bg-gray-300',
          orb2: 'bg-slate-400'
        }
      case 'rain':
      case 'drizzle':
        return {
          gradient: 'from-slate-500 via-blue-600 to-slate-600',
          darkGradient: 'dark:from-slate-900 dark:via-blue-900 dark:to-slate-900',
          orb1: 'bg-blue-500',
          orb2: 'bg-indigo-500'
        }
      case 'thunderstorm':
        return {
          gradient: 'from-slate-700 via-purple-800 to-slate-800',
          darkGradient: 'dark:from-slate-950 dark:via-purple-950 dark:to-slate-950',
          orb1: 'bg-purple-600',
          orb2: 'bg-yellow-500'
        }
      case 'snow':
        return {
          gradient: 'from-slate-200 via-blue-100 to-white',
          darkGradient: 'dark:from-slate-800 dark:via-slate-700 dark:to-slate-800',
          orb1: 'bg-white',
          orb2: 'bg-blue-200'
        }
      case 'mist':
      case 'fog':
      case 'haze':
        return {
          gradient: 'from-gray-400 via-slate-400 to-gray-500',
          darkGradient: 'dark:from-slate-800 dark:via-gray-800 dark:to-slate-800',
          orb1: 'bg-gray-300',
          orb2: 'bg-slate-300'
        }
      case 'dust':
      case 'sand':
        return {
          gradient: 'from-amber-400 via-orange-400 to-yellow-500',
          darkGradient: 'dark:from-amber-900 dark:via-orange-900 dark:to-yellow-900',
          orb1: 'bg-amber-300',
          orb2: 'bg-orange-400'
        }
      case 'smoke':
      case 'ash':
        return {
          gradient: 'from-gray-500 via-slate-600 to-gray-600',
          darkGradient: 'dark:from-gray-900 dark:via-slate-900 dark:to-gray-900',
          orb1: 'bg-gray-400',
          orb2: 'bg-slate-500'
        }
      default:
        return {
          gradient: 'from-blue-400 via-blue-300 to-purple-400',
          darkGradient: 'dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
          orb1: 'bg-purple-400 dark:bg-purple-600',
          orb2: 'bg-blue-400 dark:bg-blue-600'
        }
    }
  }

  const weatherBg = getWeatherBackground()

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen bg-gradient-to-br ${weatherBg.gradient} ${weatherBg.darkGradient} transition-all duration-1000 relative`}>
        {/* Animated Background Orbs */}
        <motion.div
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {(() => {
            const anim = getWeatherAnimation(currentWeather?.weather[0]?.main)
            return (
              <>
                <motion.div
                  className={`absolute top-0 left-1/4 w-96 h-96 ${weatherBg.orb1} rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 transition-colors duration-1000`}
                  animate={{ y: anim.orb1.y, x: anim.orb1.x }}
                  transition={{ duration: anim.orb1.duration, repeat: Infinity }}
                />
                <motion.div
                  className={`absolute bottom-0 right-1/4 w-96 h-96 ${weatherBg.orb2} rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 transition-colors duration-1000`}
                  animate={{ y: anim.orb2.y, x: anim.orb2.x }}
                  transition={{ duration: anim.orb2.duration, repeat: Infinity }}
                />
              </>
            )
          })()}
        </motion.div>

        {/* Full-width Header */}
        <Header />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          <SearchBar
            onSearch={handleSearch}
            onLocationClick={handleLocationClick}
            isLoading={loading}
          />

          {/* Saved Locations */}
          <SavedLocations 
            currentCity={currentWeather}
            onSelectLocation={handleSearch}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingState key="loading" />
            ) : error ? (
              <ErrorState key="error" error={error} onRetry={() => {
                if (lastSearchedCity) handleSearch(lastSearchedCity)
              }} />
            ) : currentWeather ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WeatherCard weather={currentWeather} forecast={forecast} />

                {forecast && <HourlyChart forecastData={forecast} />}

                {/* Weather Radar Map */}
                <WeatherRadar currentWeather={currentWeather} />

                {sevenDayForecast && <SevenDayForecast forecast={sevenDayForecast} />}

                {sevenDayForecast && sevenDayForecast.length > 1 && (
                  <AIPredictionBox
                    currentWeather={currentWeather}
                    tomorrowWeather={sevenDayForecast[1]}
                  />
                )}

                {/* City Comparison Tool */}
                <CityCompare />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-4"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-6"
                >
                  🌍
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-poppins">
                  Discover Weather <span className="gh-text-gradient">Anywhere</span>
                </h2>
                <p className="text-white/50 text-lg font-inter max-w-md mx-auto mb-8">
                  Search for a city or use your current location to get real-time weather updates
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.querySelector('input')?.focus()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/25"
                  >
                    Search a City
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-white/10 dark:border-[#30363d] mt-16 py-8 bg-white/5 dark:bg-[#010409]/50 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 flex items-center justify-center text-lg">
                  🌤️
                </div>
                <span className="text-white/80 font-semibold">Weather Forecast</span>
              </div>
              <p className="text-white/40 dark:text-gray-500 font-inter text-sm text-center">
                Weather data provided by OpenWeatherMap • Built with React, Vite & Tailwind
              </p>
              <div className="flex items-center gap-4 text-white/40 dark:text-gray-500 text-sm">
                <span>© 2026</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>Made with ❤️</span>
              </div>
            </div>
          </div>
        </motion.footer>

        {/* AI ChatBot */}
        <ChatBot currentWeather={currentWeather} forecast={forecast} />
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </WeatherProvider>
    </AuthProvider>
  )
}

export default App
