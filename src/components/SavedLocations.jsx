import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Star, 
  X, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Heart,
  Trash2
} from 'lucide-react'
import { useWeatherContext } from '../utils/WeatherContext'
import { useTranslation } from '../utils/useTranslation'

const SavedLocations = ({ currentCity, onSelectLocation, onSaveCurrentLocation }) => {
  const { t } = useTranslation()
  const { 
    savedLocations, 
    removeSavedLocation, 
    isLocationSaved,
    addSavedLocation 
  } = useWeatherContext()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)

  const handleSaveCurrentCity = () => {
    if (currentCity && !isLocationSaved(currentCity.name)) {
      addSavedLocation({
        name: currentCity.name,
        country: currentCity.sys?.country || '',
        coord: currentCity.coord
      })
    }
  }

  const handleRemoveLocation = (locationId) => {
    removeSavedLocation(locationId)
    setShowConfirmDelete(null)
  }

  const isCurrent = (locationName) => {
    return currentCity?.name?.toLowerCase() === locationName.toLowerCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-6"
    >
      {/* Header */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/50 dark:hover:bg-slate-700/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white">
              <Star size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white font-poppins">
                Saved Locations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                {savedLocations.length} {savedLocations.length === 1 ? 'city' : 'cities'} saved
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Save Current Location Button */}
            {currentCity && !isLocationSaved(currentCity.name) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSaveCurrentCity()
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-sm font-medium shadow-lg transition"
              >
                <Heart size={16} />
                <span className="hidden sm:inline">Save {currentCity.name}</span>
                <span className="sm:hidden">Save</span>
              </motion.button>
            )}
            
            {/* Already Saved Indicator */}
            {currentCity && isLocationSaved(currentCity.name) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium">
                <Heart size={16} className="fill-current" />
                <span className="hidden sm:inline">Saved</span>
              </div>
            )}
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
            </motion.div>
          </div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 border-t border-gray-200 dark:border-slate-700">
                {savedLocations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="text-4xl mb-3">📍</div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 font-inter">
                      No saved locations yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Search for a city and click "Save" to add it to your favorites
                    </p>
                  </motion.div>
                ) : (
                  <div className="pt-4 grid gap-2">
                    {savedLocations.map((location, index) => (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative group flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${
                          isCurrent(location.name)
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-500'
                            : 'bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 border-2 border-transparent'
                        }`}
                        onClick={() => onSelectLocation(location.name)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isCurrent(location.name)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                          }`}>
                            <MapPin size={16} />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              isCurrent(location.name)
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {location.name}
                              {location.country && (
                                <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                                  , {location.country}
                                </span>
                              )}
                            </p>
                            {isCurrent(location.name) && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                Currently viewing
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <AnimatePresence>
                          {showConfirmDelete === location.id ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleRemoveLocation(location.id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(null)}
                                className="px-3 py-1 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-200 text-sm rounded-lg transition"
                              >
                                Cancel
                              </button>
                            </motion.div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowConfirmDelete(location.id)
                              }}
                              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Quick Add Popular Cities */}
                {savedLocations.length < 5 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wide">
                      Quick Add Popular Cities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Tokyo', 'London', 'New York', 'Paris', 'Mumbai', 'Sydney'].map((city) => {
                        const isSaved = savedLocations.some(
                          loc => loc.name.toLowerCase() === city.toLowerCase()
                        )
                        if (isSaved) return null
                        return (
                          <motion.button
                            key={city}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              addSavedLocation({ name: city, country: '', coord: null })
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition"
                          >
                            <Plus size={14} />
                            {city}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Access Bar (when collapsed and has saved locations) */}
      {!isExpanded && savedLocations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {savedLocations.slice(0, 5).map((location) => (
            <motion.button
              key={location.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectLocation(location.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shadow-md ${
                isCurrent(location.name)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 dark:bg-slate-700/80 backdrop-blur text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-600'
              }`}
            >
              <MapPin size={14} />
              {location.name}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default SavedLocations
