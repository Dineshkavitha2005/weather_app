import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org'

// Weather API instance
const weatherAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric'
  }
})

/**
 * Get current weather by city name
 */
export const getWeatherByCity = async (city) => {
  try {
    const response = await weatherAPI.get('/data/2.5/weather', {
      params: { q: city }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather')
  }
}

/**
 * Get weather and forecast by coordinates
 */
export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await weatherAPI.get('/data/2.5/forecast', {
      params: { lat, lon, cnt: 40 } // 40 = 5 days * 8 (3-hour intervals)
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather')
  }
}

/**
 * Get weather by zip code
 */
export const getWeatherByZip = async (zip, country = '') => {
  try {
    const query = country ? `${zip},${country}` : zip
    const response = await weatherAPI.get('/data/2.5/weather', {
      params: { zip: query }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather')
  }
}

/**
 * Get city coordinates using geocoding API
 */
export const getCoordinatesByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/geo/1.0/direct`, {
      params: {
        q: city,
        limit: 5,
        appid: API_KEY
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to geocode city')
  }
}

/**
 * Get user's location using geolocation API
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      }
    )
  })
}

/**
 * Get reverse geocoding (lat, lon -> city name)
 */
export const getCityNameByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/geo/1.0/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: API_KEY
      }
    })
    return response.data[0]
  } catch (error) {
    throw new Error('Failed to get city name')
  }
}
