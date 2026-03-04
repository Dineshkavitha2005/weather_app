# 🔌 API & Architecture Guide

Complete guide to how data flows through your weather app.

## 🌐 OpenWeatherMap API Reference

### API Endpoints Used

```
1. Current Weather
   GET /data/2.5/weather?q={city}
   Returns: Current temp, condition, wind, etc.

2. Forecast (5-day)
   GET /data/2.5/forecast?lat={lat}&lon={lon}
   Returns: 5-day forecast in 3-hour intervals

3. Geocoding
   GET /geo/1.0/direct?q={city}
   Returns: Coordinates [lat, lon] for cities

4. Reverse Geocoding
   GET /geo/1.0/reverse?lat={lat}&lon={lon}
   Returns: City name for coordinates
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                      │
├─────────────────────────────────────────────────────────────┤
│  Search Bar Input  │  Location Button  │  Dark Mode Toggle  │
└──────────┬──────────────────────┬────────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      APP.JSX (State)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ currentWeather    │ forecast    │ sevenDayForecast  │   │
│  │ loading, error    │ isDarkMode  │ lastSearchedCity  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────┬────────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│               WEATHER API LAYER (weatherAPI.js)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ getWeatherByCity()   │ getWeatherByCoordinates()    │   │
│  │ getCityNameByCoord() │ getCoordinatesByCity()       │   │
│  │ getUserLocation()    │ getWeatherByZip()            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────┬────────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│            OPENWEATHERMAP API (External Service)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • api.openweathermap.org/data/2.5/weather           │   │
│  │ • api.openweathermap.org/data/2.5/forecast          │   │
│  │ • api.openweathermap.org/geo/1.0/direct             │   │
│  │ • api.openweathermap.org/geo/1.0/reverse            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────┬────────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│           HELPERS LAYER (helpers.js - Data Processing)       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ process7DayForecast()  │ process24HourForecast()    │   │
│  │ formatTemp()           │ formatDate()               │   │
│  │ getWeatherIconUrl()    │ getAIPrediction()          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────┬────────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENTS (UI Rendering)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SearchBar    │ WeatherCard  │ HourlyChart          │   │
│  │ SevenDay...  │ AIPrediction │ LoadingState         │   │
│  │ ErrorState   │ Header                              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────┬────────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Rendered DOM)                    │
│         User sees beautiful weather interface! 🌤️            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 State Management Flow

### WeatherContext (Global State)

```js
WeatherContext
├── isDarkMode (boolean)
│   └── Toggles light/dark theme
│
├── lastSearchedCity (string)
│   └── Saved in localStorage
│   └── Loaded on app start
│
├── toggleDarkMode() function
│   └── Switches isDarkMode state
│
└── saveSearchedCity(city) function
    └── Saves to localStorage
    └── Updates lastSearchedCity
```

### Local State (App.jsx)

```js
currentWeather {
  ├── name (city name)
  ├── sys {sunrise, sunset, country}
  ├── coord {lat, lon}
  ├── main {temp, feels_like, temp_min, temp_max, pressure, humidity}
  ├── weather [{main, icon, description}]
  ├── wind {speed, deg}
  ├── clouds {all}
  ├── visibility
  └── ... more fields
}

forecast {
  ├── list: [
  │   ├── dt (timestamp)
  │   ├── main {temp, feels_like, humidity, pressure}
  │   ├── weather [{main, icon}]
  │   ├── wind {speed}
  │   ├── visibility
  │   ├── clouds {all}
  │   └── ... (40 items = 5 days)
  │ ]
  ├── city {
  │   ├── name
  │   ├── sunrise
  │   ├── sunset
  │   └── coord {lat, lon}
  │ }
}

sevenDayForecast: [
  {
    dt,
    temp_min, temp_max, temp_avg,
    weather {main, icon},
    humidity, pressure, wind_speed, visibility
  },
  ... (7 items)
]
```

---

## 🔐 Error Handling

```
API Call
  ├─ Success ✅
  │  └─ Process data with helpers.js
  │     └─ Update state
  │        └─ Components render
  │
  └─ Error ❌
     └─ Catch error
        └─ Extract error message
           └─ Set error state
              └─ Show ErrorState component
                 └─ Show retry button
```

---

## 🚀 Request/Response Examples

### Example 1: Search City

**Request:**
```
User types: "London"
User clicks: Search
```

**Function Called:**
```js
handleSearch("London")
  ↓
getWeatherByCity("London")
  ↓
API Call:
  GET /data/2.5/weather?q=London&appid=KEY&units=metric
```

**API Response:**
```json
{
  "name": "London",
  "main": {"temp": 8.5, "feels_like": 6.2, ...},
  "weather": [{"main": "Cloudy", "icon": "04d"}],
  "wind": {"speed": 4.2},
  "sys": {"sunrise": 1674024000, "sunset": 1674053460},
  "coord": {"lat": 51.5, "lon": -0.13},
  ...
}
```

**Processing:**
```js
setCurrentWeather(weather)
getWeatherByCoordinates(51.5, -0.13)
  ↓
Get forecast data
  ↓
process7DayForecast(forecastData)
  ↓
setSevenDayForecast([...])
```

**Rendering:**
```
Components receive data
  ↓
Format with helpers (formatTemp, formatDate, etc.)
  ↓
Display in UI
```

---

### Example 2: Get User Location

**Request:**
```
User clicks: My Location button
```

**Function Called:**
```js
handleLocationClick()
  ↓
getUserLocation()
  ↓
navigator.geolocation.getCurrentPosition()
```

**Browser Response:**
```json
{
  "coords": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

**Processing:**
```js
getWeatherByCoordinates(37.7749, -122.4194)
  ↓
getCityNameByCoordinates(37.7749, -122.4194)
  ↓
Create weather object from forecast data
  ↓
Set state
```

**Result:** Weather for San Francisco displays

---

## 🔗 API Parameters Explained

### Weather Request
```
/data/2.5/weather?q={city}&appid={key}&units=metric

Parameters:
- q: City name (e.g., "London", "New York")
- appid: Your API key (already set in .env)
- units: "metric" for Celsius, "imperial" for Fahrenheit
```

### Forecast Request
```
/data/2.5/forecast?lat={lat}&lon={lon}&appid={key}&cnt={count}&units=metric

Parameters:
- lat: Latitude
- lon: Longitude
- appid: Your API key
- cnt: Number of items (5-40), each = 3 hours
- units: "metric" or "imperial"
```

### Geocoding Request
```
/geo/1.0/direct?q={city}&limit={limit}&appid={key}

Parameters:
- q: City name
- limit: Max results (1-5)
- appid: Your API key

Returns: [
  {name, country, lat, lon},
  ...
]
```

---

## 📈 Data Processing Pipeline

### Raw API Data → Processed Data

```
Raw Forecast Data:
{
  list: [
    {dt: 1674024000, main: {temp: 8.5}, weather: [{icon: "04d"}]},
    {dt: 1674027600, main: {temp: 9.1}, weather: [{icon: "04d"}]},
    ... (40 total items)
  ]
}

    ↓ process7DayForecast() ↓

Processed 7-Day Data:
[
  {
    dt: 1674024000,
    temp_min: 8.1,
    temp_max: 10.5,
    temp_avg: 9.2,
    weather: {main: "Cloudy", icon: "04d"},
    humidity: 72,
    wind_speed: 4.2
  },
  ... (7 items, one per day)
]
```

---

## 🎯 Component Data Requirements

| Component | Needs | Source |
|-----------|-------|--------|
| WeatherCard | currentWeather | App state |
| HourlyChart | forecast | App state |
| SevenDayForecast | sevenDayForecast | App state |
| AIPredictionBox | currentWeather, sevenDayForecast[1] | App state |
| SearchBar | lastSearchedCity | Context |
| Header | isDarkMode | Context |
| LoadingState | N/A | When loading=true |
| ErrorState | error | When error exists |

---

## 🔄 Update Flow on New Search

```
User Action: Search "Tokyo"
  │
  ├─ SearchBar captures input
  │  └─ onSearch("Tokyo")
  │
  ├─ App.handleSearch("Tokyo")
  │  └─ setLoading(true)
  │  └─ setError(null)
  │
  ├─ getWeatherByCity("Tokyo")
  │  └─ HTTP GET to OpenWeatherMap
  │  └─ Returns weather object
  │
  ├─ setCurrentWeather(weather)
  │
  ├─ getWeatherByCoordinates(lat, lon)
  │  └─ HTTP GET to OpenWeatherMap
  │  └─ Returns forecast object
  │
  ├─ setForecast(forecastData)
  ├─ setSevenDayForecast(processed)
  ├─ saveSearchedCity("Tokyo")
  │
  └─ setLoading(false)
     └─ Components re-render with new data
```

---

## 🛡️ Error Handling Examples

### Network Error
```js
try {
  const data = await getWeatherByCity("InvalidCity12345")
} catch (err) {
  // err.message = "city not found"
  setError("Failed to fetch weather data")
  // ErrorState component displays this
}
```

### Geolocation Denied
```js
try {
  const location = await getUserLocation()
} catch (err) {
  // err.message = "User denied geolocation"
  setError("Location access denied. Please enable location services.")
}
```

---

## 📊 Performance Metrics

### API Call Counts
- **Search**: 2 API calls (weather + forecast)
- **Location**: 2 API calls (forecast + reverse geocode)
- **Auto-load Last City**: 2 API calls

### Response Times (Typical)
- Weather API: 200-500ms
- Forecast API: 300-600ms
- Geocoding: 200-400ms
- **Total**: 700-1600ms (1-2 seconds)

### Caching Strategy
Currently: No caching (fetch fresh data every time)

Potential Optimization:
- Cache weather for 10 minutes
- Cache forecast for 30 minutes
- Use localStorage for offline mode

---

## 🔑 Key Functions Reference

### API Functions (weatherAPI.js)
```js
getWeatherByCity(city)              // Main search function
getWeatherByCoordinates(lat, lon)   // Get forecast
getCoordinatesByCity(city)          // Get lat/lon
getUserLocation()                   // Browser geolocation
getCityNameByCoordinates(lat, lon)  // Reverse geocode
```

### Helper Functions (helpers.js)
```js
formatTemp(temp)                    // "25°"
formatTime(timestamp)               // "14:30"
getWeatherIconUrl(iconCode)         // URL to icon image
process7DayForecast(data)           // Summarize daily
process24HourForecast(data)         // Hourly breakdown
getAIPrediction(temp1, temp2)       // Smart prediction
```

### Context Functions (WeatherContext.jsx)
```js
useWeatherContext()                 // Access context
toggleDarkMode()                    // Switch theme
saveSearchedCity(city)              // Save to localStorage
```

---

## 🚨 Common API Issues

### Issue: 401 Unauthorized
- **Cause**: Invalid or missing API key
- **Solution**: Check .env file, restart dev server

### Issue: 404 City Not Found
- **Cause**: Typo or non-existent city
- **Solution**: Show error message, ask for retry

### Issue: Rate Limited (429)
- **Cause**: Too many requests
- **Solution**: Implement request throttling/debouncing

### Issue: Connection Timeout
- **Cause**: Network issue
- **Solution**: Show retry button, check internet

---

## 📚 API Documentation Links

- [OpenWeatherMap Current Weather](https://openweathermap.org/current)
- [OpenWeatherMap Forecast](https://openweathermap.org/forecast5)
- [OpenWeatherMap Geocoding](https://openweathermap.org/api/geocoding-api)

---

**Understanding the architecture helps you modify and extend the app!** 🚀
