# 🏗️ Component Architecture Guide

Understanding the component structure helps you add new features easily.

## 📊 Component Hierarchy

```
App (main container)
├── Header
│   └── Dark Mode Toggle
├── SearchBar
│   ├── Input Field
│   ├── Location Button
│   └── Search Button
├── LoadingState / ErrorState (conditional)
└── Main Content (when data loaded)
    ├── WeatherCard
    │   ├── Current Temp
    │   ├── Weather Icon
    │   └── Detailed Stats
    ├── HourlyChart
    │   ├── Line Chart
    │   └── Hourly Grid
    ├── SevenDayForecast
    │   └── Forecast Cards (scrollable)
    └── AIPredictionBox

WeatherContext (global state)
├── isDarkMode
├── lastSearchedCity
└── Helper functions
```

## 🔄 Data Flow

```
User Input (Search/Location)
    ↓
App.jsx (state management)
    ↓
weatherAPI.js (fetch data)
    ↓
helpers.js (process data)
    ↓
Components (display data)
    ↓
Browser (render UI)
```

## 🧩 Component Breakdown

### SearchBar Component
**Purpose**: Get user input or location

**Props**:
- `onSearch` - callback when user searches
- `onLocationClick` - callback for location button
- `isLoading` - show loading state

**State**:
- `query` - current search input
- `locationLoading` - geolocation loading state

**Key Functions**:
- `handleSubmit` - process search
- `handleLocationClick` - get user location

```jsx
<SearchBar 
  onSearch={(city) => handleSearch(city)}
  onLocationClick={(location) => handleLocationClick(location)}
  isLoading={loading}
/>
```

---

### WeatherCard Component
**Purpose**: Display current weather information

**Props**:
- `weather` - current weather object
- `forecast` - forecast data (optional)

**Displays**:
- Current temperature
- Weather icon
- Feels-like, min/max temps
- Humidity, wind, visibility, clouds
- Sunrise/sunset times

**Features**:
- Animated weather icon
- Gradient stat boxes
- Hover effects

```jsx
<WeatherCard 
  weather={currentWeather}
  forecast={forecast}
/>
```

---

### HourlyChart Component
**Purpose**: Show 24-hour temperature trend

**Props**:
- `forecastData` - 5-day forecast data

**Displays**:
- Line chart with temperature
- Hourly breakdown grid
- Humidity percentages

**Key Lib**:
- Recharts for visualization

```jsx
<HourlyChart forecastData={forecast} />
```

---

### SevenDayForecast Component
**Purpose**: Display 7-day forecast

**Props**:
- `forecast` - processed 7-day forecast array

**Displays**:
- Scrollable forecast cards
- Max/min temperatures
- Weather icons
- Humidity and wind speed

**Features**:
- Horizontal scroll on mobile
- Hover animations
- Staggered entrance animation

```jsx
<SevenDayForecast forecast={sevenDayForecast} />
```

---

### AIPredictionBox Component
**Purpose**: Show intelligent weather prediction

**Props**:
- `currentWeather` - today's weather
- `tomorrowWeather` - tomorrow's forecast

**Logic**:
- Compares temperatures
- Generates smart message
- Shows emoji indicator

**Functions Used**:
- `getAIPrediction()` from helpers.js

```jsx
<AIPredictionBox 
  currentWeather={currentWeather}
  tomorrowWeather={sevenDayForecast[1]}
/>
```

---

### LoadingState Component
**Purpose**: Show loading skeleton

**Features**:
- Animated skeleton screens
- Pulse animation
- Loading text

**No Props Required**

```jsx
<LoadingState />
```

---

### ErrorState Component
**Purpose**: Display errors gracefully

**Props**:
- `error` - error message
- `onRetry` - retry callback

**Features**:
- Error icon
- Error message
- Retry button

```jsx
<ErrorState 
  error={error}
  onRetry={() => handleSearch(lastSearchedCity)}
/>
```

---

### Header Component
**Purpose**: App header with dark mode toggle

**Features**:
- Logo and title
- Dark mode button
- Smooth animations

**Uses Context**:
- `isDarkMode` state
- `toggleDarkMode` function

```jsx
<Header />
```

---

## 🛠️ Utility Functions

### `weatherAPI.js`
API calls to OpenWeatherMap:

```js
getWeatherByCity(city)           // Search by city name
getWeatherByCoordinates(lat, lon) // Search by GPS
getWeatherByZip(zip, country)    // Search by zip code
getCoordinatesByCity(city)       // Geocode city name
getUserLocation()                // Get browser geolocation
getCityNameByCoordinates(lat, lon) // Reverse geocode
```

### `helpers.js`
Data processing:

```js
formatTemp(temp)                 // Format temperature
formatTime(timestamp)            // Convert Unix to HH:MM
formatDate(timestamp)            // Format date
getWeatherIconUrl(iconCode)      // Get weather icon URL
getAIPrediction(temp1, temp2)    // Generate prediction
process7DayForecast(data)        // Process 7-day data
process24HourForecast(data)      // Process hourly data
getWeatherDescription(condition) // Human-readable weather
```

### `WeatherContext.jsx`
Global state management:

```js
isDarkMode                       // Dark mode toggle
toggleDarkMode()                 // Switch theme
lastSearchedCity                 // Saved city
saveSearchedCity(city)           // Save to localStorage
```

---

## 🎨 Styling Patterns

### Glassmorphism Card
```jsx
className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-600/20"
```

### Gradient Stat Box
```jsx
className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-2xl p-4 backdrop-blur"
```

### Responsive Grid
```jsx
className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
```

### Button Styles
```jsx
className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium transition"
```

---

## ✨ Animation Patterns

### Fade In
```jsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.5 }}
```

### Slide Up
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

### Hover Scale
```jsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Floating Animation
```jsx
animate={{ y: [0, -10, 0] }}
transition={{ duration: 3, repeat: Infinity }}
```

---

## 🔧 Adding New Components

### Step 1: Create Component File
```jsx
// src/components/MyComponent.jsx
import React from 'react'
import { motion } from 'framer-motion'

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component content */}
    </motion.div>
  )
}

export default MyComponent
```

### Step 2: Import in App.jsx
```jsx
import MyComponent from './components/MyComponent'
```

### Step 3: Use Component
```jsx
<MyComponent prop1={value1} prop2={value2} />
```

---

## 📋 Component Checklist

When creating new components:

- ✅ Use meaningful prop names
- ✅ Add PropTypes or TypeScript
- ✅ Include Framer Motion animations
- ✅ Make it responsive (mobile-first)
- ✅ Support dark mode
- ✅ Add error handling
- ✅ Document props in comments
- ✅ Use consistent styling patterns
- ✅ Test on mobile devices
- ✅ Keep components small & focused

---

## 🔗 Related Files

- Component examples: `src/components/`
- Styling: `tailwind.config.js`
- API: `src/utils/weatherAPI.js`
- State: `src/utils/WeatherContext.jsx`

---

**Happy building!** 🚀
