# 🌤️ Weather Forecast App

A modern, fully-featured weather forecast web application built with React, Vite, Tailwind CSS, and Framer Motion. Get real-time weather updates, AI-powered predictions, and beautiful visualizations.

## ✨ Features

- 🔍 **Smart Search**: Search weather by city name with autocomplete suggestions
- 📍 **Geolocation**: Get weather for your current location with one click
- 🌡️ **Current Weather**: Displays temperature, feels-like, min/max, and weather conditions
- 📊 **24-Hour Chart**: Interactive line chart showing temperature trends
- 📅 **7-Day Forecast**: Scrollable forecast cards with detailed daily information
- 🤖 **AI Prediction**: Smart predictions comparing today's and tomorrow's weather
- 💾 **Persistent Storage**: Remember your last searched city
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ✨ **Smooth Animations**: Beautiful transitions using Framer Motion
- 📱 **Fully Responsive**: Perfect on mobile, tablet, and desktop
- 🎨 **Glassmorphism Design**: Modern UI with blurred glass-effect cards
- 🚀 **Fast Performance**: Built with Vite for instant page loads

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Interactive charts
- **Axios** - HTTP client
- **Lucide Icons** - Beautiful icon set
- **OpenWeatherMap API** - Weather data provider

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- OpenWeatherMap API key (already included)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file using the template below:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_OPENWEATHER_API_URL=https://api.openweathermap.org/data/3.0
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
weather/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx          # City search & location button
│   │   ├── WeatherCard.jsx        # Current weather display
│   │   ├── HourlyChart.jsx        # 24-hour temperature chart
│   │   ├── SevenDayForecast.jsx   # 7-day forecast cards
│   │   ├── AIPredictionBox.jsx    # AI weather prediction
│   │   ├── LoadingState.jsx       # Loading skeleton
│   │   ├── ErrorState.jsx         # Error handling UI
│   │   └── Header.jsx             # App header with dark mode
│   ├── utils/
│   │   ├── weatherAPI.js          # API calls & methods
│   │   ├── WeatherContext.jsx     # React Context for state
│   │   └── helpers.js             # Utility functions
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Dependencies
├── .env                          # Environment variables
└── .gitignore                    # Git ignore rules
```

## 🎯 How to Use

### Searching for Weather
1. Type a city name in the search bar
2. Click "Search" or press Enter
3. View current weather and forecasts

### Using Your Location
1. Click the "My Location" button
2. Allow browser location permission when prompted
3. Weather updates automatically for your location

### Switching Themes
- Click the sun/moon icon in the top-right corner
- App switches between light and dark modes

### Understanding the Dashboard

**Weather Card**
- Current temperature and conditions
- Feels-like temperature
- Min/Max temperatures
- Weather metrics: Humidity, Wind, Visibility, Cloud coverage, Sunrise/Sunset

**Hourly Chart**
- 24-hour temperature trend visualization
- Hourly breakdown with temperature and humidity

**7-Day Forecast**
- Scrollable cards for each day
- Max/Min temperatures
- Weather conditions
- Humidity and wind speed

**AI Prediction Box**
- Intelligent comparison between today and tomorrow
- Based on temperature differences
- Emoji indicators for quick understanding

## 🎨 Design Features

### Color Scheme
- **Light Mode**: Gradient from blue to purple with white glass cards
- **Dark Mode**: Deep slate background with semi-transparent dark cards
- **Glassmorphism**: Blurred, semi-transparent cards for modern look

### Typography
- **Headings**: Poppins font (bold, modern)
- **Body Text**: Inter font (clean, readable)
- **Icons**: Lucide React icons

### Animations
- Smooth fade and slide transitions
- Floating and rotating elements
- Interactive hover effects
- Staggered animations for lists

## 🔧 API Reference

All weather data comes from the OpenWeatherMap API. The app uses:

- **Current Weather API**: Real-time weather data
- **Forecast API**: 5-day forecasts with 3-hour intervals
- **Geocoding API**: Convert city names to coordinates
- **Reverse Geocoding**: Get city names from coordinates

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (optimized for phones)
- **Tablet**: 640px - 1024px (medium screens)
- **Desktop**: > 1024px (full experience)

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## ⚙️ Configuration

### Customize Tailwind
Edit `tailwind.config.js` to modify:
- Colors
- Typography
- Spacing
- Breakpoints

### Customize Vite
Edit `vite.config.js` to modify:
- Port number
- Build settings
- Plugin options

## 🔐 Security Notes

- API key is in environment variables (not exposed in code)
- No sensitive data stored in localStorage
- Uses HTTPS for all API calls
- No user tracking or analytics

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)
- [OpenWeatherMap API](https://openweathermap.org/api)

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- --port 3001
```

### API Key Not Working
- Verify `.env` file is in the root directory
- Ensure `VITE_` prefix for environment variables
- Restart dev server after `.env` changes

### Styling Issues
```bash
npm run build
npm run preview
```

### Location Permission Denied
- Check browser privacy settings
- Allow location access for the domain
- Use HTTP (not HTTPS) for localhost testing

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages
```bash
# Add to vite.config.js: base: '/repo-name/'
npm run build
# Deploy dist/ to gh-pages branch
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📄 License

This project is open source and available for personal and commercial use.

## 🙋 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Consult the documentation links

