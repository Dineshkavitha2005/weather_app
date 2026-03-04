import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Mic, MicOff } from 'lucide-react'
import { useWeatherContext } from '../utils/WeatherContext'
import { useLanguage } from '../utils/LanguageContext'
import { getUserLocation, getCoordinatesByCity } from '../utils/weatherAPI'
import { translations } from '../utils/translations'

const SearchBar = ({ onSearch, onLocationClick, isLoading }) => {
  const [query, setQuery] = useState('')
  const { lastSearchedCity } = useWeatherContext()
  const { currentLanguage } = useLanguage()
  const [locationLoading, setLocationLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const recognitionRef = useRef(null)

  // Check voice support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setVoiceSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
        // Auto-search after voice input
        setTimeout(() => {
          onSearch(transcript)
          setQuery('')
        }, 500)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions.')
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onSearch])

  // Fetch city suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        return
      }

      try {
        const results = await getCoordinatesByCity(query)
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (error) {
        setSuggestions([])
      }
    }

    const timeoutId = setTimeout(() => {
      fetchSuggestions()
    }, 300) // Debounce: wait 300ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      setQuery('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    const cityName = `${suggestion.name}${suggestion.state ? ', ' + suggestion.state : ''}, ${suggestion.country}`
    onSearch(suggestion.name)
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const handleVoiceSearch = () => {
    if (!voiceSupported) {
      alert('Voice input is not supported in your browser. Please try Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        setIsListening(true)
        recognitionRef.current?.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setIsListening(false)
      }
    }
  }

  const handleLocationClick = async () => {
    setLocationLoading(true)
    try {
      const location = await getUserLocation()
      onLocationClick(location)
    } catch (error) {
      alert('Could not access your location. Please enable location services.')
    } finally {
      setLocationLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mb-8 px-4"
      ref={searchRef}
    >
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder={isListening ? translations[currentLanguage]?.listeningPlaceholder : translations[currentLanguage]?.searchPlaceholder}
              autoComplete="off"
              className="w-full px-4 py-3 pl-10 pr-12 rounded-xl bg-white/70 dark:bg-slate-700/70 backdrop-blur-md border border-white/20 dark:border-slate-600/20 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300 transition placeholder-gray-600 dark:placeholder-gray-400 font-inter text-gray-900 dark:text-white"
            />
            <Search size={18} className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-300" />
            
            {/* Voice Search Button */}
            {voiceSupported && (
              <motion.button
                type="button"
                onClick={handleVoiceSearch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute right-3 top-2.5 p-1 rounded-full transition ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                title={isListening ? "Stop listening" : "Voice search"}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <MicOff size={18} />
                  </motion.div>
                ) : (
                  <Mic size={18} />
                )}
              </motion.button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 dark:border-slate-600/20 overflow-hidden max-h-64 overflow-y-auto"
              >
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <motion.div
                    key={`${suggestion.lat}-${suggestion.lon}`}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-3 cursor-pointer transition ${
                      index === selectedIndex
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'hover:bg-blue-50 dark:hover:bg-slate-600/50'
                    } ${index !== suggestions.length - 1 ? 'border-b border-gray-200 dark:border-slate-600' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium font-inter">
                          {suggestion.name}
                          {suggestion.state && `, ${suggestion.state}`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                          {suggestion.country}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLocationClick}
          disabled={isLoading || locationLoading}
          className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-poppins font-medium transition disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          <MapPin size={18} />
          <span className="hidden sm:inline">My Location</span>
          <span className="sm:hidden">Location</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-poppins font-medium transition disabled:opacity-50"
        >
          <span className="hidden sm:inline">Search</span>
          <Search size={18} className="sm:hidden" />
        </motion.button>
      </form>

      {lastSearchedCity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400 font-inter"
        >
          Last searched: <span className="font-medium text-gray-900 dark:text-white">{lastSearchedCity}</span>
        </motion.div>
      )}
    </motion.div>
  )
}

export default SearchBar
