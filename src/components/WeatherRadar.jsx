import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Cloud, Wind, Droplets, Thermometer, ChevronDown } from 'lucide-react'
import { useTranslation } from '../utils/useTranslation'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const WeatherRadar = ({ currentWeather }) => {
  const { t } = useTranslation()
  const [activeRadar, setActiveRadar] = useState('clouds')
  const [showRadarOptions, setShowRadarOptions] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const weatherLayerRef = useRef(null)

  // Default center (London) if no weather data
  const defaultLat = currentWeather?.coord?.lat || 51.5074
  const defaultLon = currentWeather?.coord?.lon || -0.1278
  const cityName = currentWeather?.name || 'Location'

  // OpenWeatherMap API key
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  // Radar layer configurations
  const radarLayers = {
    clouds: {
      name: '☁️ Clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      opacity: 0.6,
      icon: Cloud
    },
    rain: {
      name: '🌧️ Rainfall',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      opacity: 0.6,
      icon: Droplets
    },
    wind: {
      name: '💨 Wind Speed',
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      opacity: 0.6,
      icon: Wind
    },
    temperature: {
      name: '🌡️ Temperature',
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      opacity: 0.6,
      icon: Thermometer
    }
  }

  // Initialize map on mount
  useEffect(() => {
    if (!mapRef.current) return

    // Only initialize once
    if (mapInstanceRef.current) return

    try {
      // Create map instance
      const map = L.map(mapRef.current, {
        scrollWheelZoom: true,
        dragging: true
      }).setView([defaultLat, defaultLon], 8)

      // Add base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        zIndex: 1,
        maxZoom: 19
      }).addTo(map)

      // Add initial weather layer
      const weatherLayer = L.tileLayer(radarLayers[activeRadar].url, {
        attribution: '&copy; OpenWeatherMap',
        zIndex: 2,
        opacity: radarLayers[activeRadar].opacity
      }).addTo(map)

      weatherLayerRef.current = weatherLayer

      // Add marker
      L.marker([defaultLat, defaultLon], {
        draggable: false,
        riseOnHover: true
      })
        .bindPopup(`<div style="text-align: center; font-family: inter;"><p style="font-weight: bold; margin: 0;">${cityName}</p><p style="font-size: 12px; color: #666; margin: 0;">${defaultLat.toFixed(2)}°, ${defaultLon.toFixed(2)}°</p></div>`)
        .addTo(map)

      mapInstanceRef.current = map
      console.log('Map initialized successfully at', [defaultLat, defaultLon])
    } catch (error) {
      console.error('Error initializing map:', error)
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Only run on mount

  // Update weather layer when radar type changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    try {
      const map = mapInstanceRef.current

      // Remove old weather layer
      if (weatherLayerRef.current) {
        map.removeLayer(weatherLayerRef.current)
      }

      // Add new weather layer
      const newWeatherLayer = L.tileLayer(radarLayers[activeRadar].url, {
        attribution: '&copy; OpenWeatherMap',
        zIndex: 2,
        opacity: radarLayers[activeRadar].opacity
      }).addTo(map)

      weatherLayerRef.current = newWeatherLayer
      console.log('Weather layer updated to:', activeRadar)
    } catch (error) {
      console.error('Error updating weather layer:', error)
    }
  }, [activeRadar])

  // Update map center when weather data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !currentWeather) return

    try {
      mapInstanceRef.current.setView([defaultLat, defaultLon], 8)
    } catch (error) {
      console.error('Error updating map center:', error)
    }
  }, [defaultLat, defaultLon, currentWeather])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowRadarOptions(false)
    if (showRadarOptions) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showRadarOptions])

  const currentRadar = radarLayers[activeRadar]
  const CurrentIcon = currentRadar.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto mb-8"
    >
      <div className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-600/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin size={24} className="text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">
                🗺️ Weather Radar Map
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-inter">
                {cityName} - Interactive satellite overlays
              </p>
            </div>
          </div>

          {/* Radar Type Selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRadarOptions(!showRadarOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl font-medium transition hover:shadow-lg"
            >
              <CurrentIcon size={20} />
              <span>{currentRadar.name}</span>
              <ChevronDown size={16} className={`transition ${showRadarOptions ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showRadarOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-slate-700/50 z-50 overflow-hidden"
                >
                  {Object.entries(radarLayers).map(([key, layer]) => (
                    <motion.button
                      key={key}
                      onClick={() => {
                        setActiveRadar(key)
                        setShowRadarOptions(false)
                      }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
                        activeRadar === key
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      <span className="text-lg">{layer.name}</span>
                      {activeRadar === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-5 h-5 rounded-full bg-white flex items-center justify-center"
                        >
                          <span className="text-blue-500 font-bold">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="relative h-96 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-600 bg-gray-100 dark:bg-slate-800"
        />

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-inter">
            💡 <strong>Tips:</strong> Use scroll to zoom in/out. Click the location marker to see coordinates. 
            Switch between different weather overlays to see clouds, rainfall, wind patterns, and temperature distribution.
          </p>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-inter">
          {Object.entries(radarLayers).map(([key, layer]) => (
            <div
              key={key}
              className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-blue-400 transition"
              onClick={() => {
                setActiveRadar(key)
                setShowRadarOptions(false)
              }}
            >
              <p className="font-bold text-gray-900 dark:text-white">{layer.name}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                {key === 'clouds' && 'Cloud coverage'}
                {key === 'rain' && 'Precipitation levels'}
                {key === 'wind' && 'Wind speed patterns'}
                {key === 'temperature' && 'Temperature zones'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherRadar
