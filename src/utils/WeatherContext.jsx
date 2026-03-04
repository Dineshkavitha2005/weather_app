import React, { createContext, useContext, useState, useEffect } from 'react'

const WeatherContext = createContext()

export const WeatherProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [lastSearchedCity, setLastSearchedCity] = useState(
    localStorage.getItem('lastSearchedCity') || ''
  )
  
  // Saved/Favorite locations
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('savedLocations')
    return saved ? JSON.parse(saved) : []
  })

  // Sync saved locations to localStorage
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations))
  }, [savedLocations])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const saveSearchedCity = (city) => {
    setLastSearchedCity(city)
    localStorage.setItem('lastSearchedCity', city)
  }

  // Add a city to saved locations
  const addSavedLocation = (location) => {
    // Check if already exists
    if (!savedLocations.find(loc => loc.name.toLowerCase() === location.name.toLowerCase())) {
      const newLocation = {
        id: Date.now(),
        name: location.name,
        country: location.country || '',
        coord: location.coord || null,
        addedAt: new Date().toISOString()
      }
      setSavedLocations([...savedLocations, newLocation])
      return true
    }
    return false
  }

  // Remove a city from saved locations
  const removeSavedLocation = (locationId) => {
    setSavedLocations(savedLocations.filter(loc => loc.id !== locationId))
  }

  // Check if a city is saved
  const isLocationSaved = (cityName) => {
    return savedLocations.some(loc => loc.name.toLowerCase() === cityName.toLowerCase())
  }

  // Reorder saved locations
  const reorderSavedLocations = (newOrder) => {
    setSavedLocations(newOrder)
  }

  return (
    <WeatherContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        lastSearchedCity,
        saveSearchedCity,
        savedLocations,
        addSavedLocation,
        removeSavedLocation,
        isLocationSaved,
        reorderSavedLocations
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeatherContext = () => {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeatherContext must be used within WeatherProvider')
  }
  return context
}
