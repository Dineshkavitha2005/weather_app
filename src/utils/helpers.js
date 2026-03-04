/**
 * Format temperature with degree symbol
 */
export const formatTemp = (temp) => `${Math.round(temp)}°`

/**
 * Format time in HH:MM format
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * Format date for display
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date for 7-day forecast
 */
export const formatDayForForecast = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    weekday: 'short'
  })
}

/**
 * Get weather icon URL from OpenWeather
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
}

/**
 * Get weather-based animation properties
 */
export const getWeatherAnimation = (weatherMain) => {
  const weatherType = weatherMain?.toLowerCase() || 'clear'

  const animations = {
    clear: {
      // Sun - floating upward
      orb1: { y: [0, -80, 0], x: [0, 30, 0], duration: 6 },
      orb2: { y: [0, -60, 0], x: [0, -40, 0], duration: 8 }
    },
    clouds: {
      // Clouds - drifting slowly
      orb1: { y: [0, 30, 0], x: [0, 100, 0], duration: 12 },
      orb2: { y: [0, -30, 0], x: [0, -80, 0], duration: 14 }
    },
    rain: {
      // Rain - falling down
      orb1: { y: [0, 120, 0], x: [0, -50, 0], duration: 10 },
      orb2: { y: [0, 150, 0], x: [0, 40, 0], duration: 12 }
    },
    drizzle: {
      // Light rain - gentle falling
      orb1: { y: [0, 80, 0], x: [0, 30, 0], duration: 8 },
      orb2: { y: [0, 60, 0], x: [0, -20, 0], duration: 10 }
    },
    thunderstorm: {
      // Storm - chaotic, fast movement
      orb1: { y: [0, 150, -50, 0], x: [0, 80, -60, 0], duration: 6 },
      orb2: { y: [0, -100, 120, 0], x: [0, -90, 70, 0], duration: 7 }
    },
    snow: {
      // Snow - slow graceful falling
      orb1: { y: [0, 140, 0], x: [0, 40, 0], duration: 16 },
      orb2: { y: [0, 150, 0], x: [0, -35, 0], duration: 18 }
    },
    mist: {
      // Fog - hovering slowly
      orb1: { y: [0, 20, 0], x: [0, 50, 0], duration: 10 },
      orb2: { y: [0, -20, 0], x: [0, -50, 0], duration: 12 }
    },
    haze: {
      // Haze - slow drifting
      orb1: { y: [0, 50, 0], x: [0, 80, 0], duration: 11 },
      orb2: { y: [0, -40, 0], x: [0, -70, 0], duration: 13 }
    },
    wind: {
      // Wind - horizontal swaying
      orb1: { y: [0, 40, 0], x: [0, 120, 0], duration: 7 },
      orb2: { y: [0, -50, 0], x: [0, -100, 0], duration: 9 }
    }
  }

  return animations[weatherType] || animations.clear
}

/**
 * Get AI prediction based on temp comparison
 */
export const getAIPrediction = (currentTemp, tomorrowTemp) => {
  const diff = tomorrowTemp - currentTemp
  const absDiff = Math.abs(diff)

  if (absDiff < 1) {
    return {
      text: 'Tomorrow will be about the same temperature 🌡️',
      emoji: '🌡️'
    }
  }

  if (diff > 0) {
    if (absDiff > 5) {
      return {
        text: `Tomorrow will be significantly warmer ☀️ (+${Math.round(diff)}°)`,
        emoji: '☀️'
      }
    }
    return {
      text: `Tomorrow will be warmer 🌤️ (+${Math.round(diff)}°)`,
      emoji: '🌤️'
    }
  } else {
    if (absDiff > 5) {
      return {
        text: `Tomorrow will be significantly colder ❄️ (${Math.round(diff)}°)`,
        emoji: '❄️'
      }
    }
    return {
      text: `Tomorrow will be cooler 🌥️ (${Math.round(diff)}°)`,
      emoji: '🌥️'
    }
  }
}

/**
 * Process forecast data into 7-day format
 */
export const process7DayForecast = (forecastData) => {
  const dailyForecasts = {}

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US')
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        dt: item.dt,
        temps: [item.main.temp],
        weather: item.weather[0],
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        wind_speed: item.wind.speed,
        visibility: item.visibility
      }
    } else {
      dailyForecasts[date].temps.push(item.main.temp)
    }
  })

  return Object.values(dailyForecasts).slice(0, 7).map((day) => ({
    ...day,
    temp_min: Math.min(...day.temps),
    temp_max: Math.max(...day.temps),
    temp_avg: Math.round(day.temps.reduce((a, b) => a + b) / day.temps.length)
  }))
}

/**
 * Process forecast data into 24-hour format
 */
export const process24HourForecast = (forecastData) => {
  return forecastData.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).getHours(),
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind_speed: item.wind.speed,
    weather: item.weather[0].main
  }))
}

/**
 * Get weather condition description
 */
export const getWeatherDescription = (condition) => {
  const descriptions = {
    Clear: 'Clear Sky',
    Clouds: 'Cloudy',
    Rain: 'Rainy',
    Drizzle: 'Drizzle',
    Thunderstorm: 'Thunderstorm',
    Snow: 'Snowy',
    Mist: 'Misty',
    Smoke: 'Smoky',
    Haze: 'Hazy',
    Dust: 'Dusty',
    Fog: 'Foggy',
    Sand: 'Sandy',
    Ash: 'Ashy',
    Squall: 'Squall',
    Tornado: 'Tornado'
  }
  return descriptions[condition] || condition
}
