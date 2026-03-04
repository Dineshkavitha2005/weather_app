# 🎨 Customization Guide

This guide helps you customize the weather app to match your preferences.

## 🎯 Change Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#your-color-here',
      secondary: '#your-color-here',
    }
  }
}
```

## 🔤 Change Fonts

1. Add fonts to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

2. Update `tailwind.config.js`:
```js
fontFamily: {
  poppins: ['Your Font', 'sans-serif'],
}
```

## 🎭 Change Theme

Edit `index.css` for gradient backgrounds:

```css
body {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

## 📐 Adjust Layout

Modify component sizes in Tailwind classes:
- `text-6xl` → `text-5xl` (smaller text)
- `p-8` → `p-4` (less padding)
- `rounded-3xl` → `rounded-lg` (less rounded)

## ⚡ Animation Speed

In `Framer Motion` components, adjust `transition`:

```js
transition={{ duration: 0.5 }} // Change 0.5 to your value (in seconds)
```

## 🔧 API Configuration

To use a different weather API:

1. Update `.env` with new API credentials
2. Modify functions in `src/utils/weatherAPI.js`
3. Adjust data processing in `src/utils/helpers.js`

## 📱 Mobile-First Design

Modify Tailwind breakpoints in `tailwind.config.js`:

```js
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
}
```

## 🌙 Disable Dark Mode

In `tailwind.config.js`:
```js
darkMode: false, // Was 'class'
```

## 🚀 Performance Optimization

### Image Optimization
Use `next/image` or optimize icons:
```bash
npx @squoosh/cli --webp src/images/*.png
```

### Code Splitting
Vite automatically does this, but you can add lazy loading:
```js
const Component = React.lazy(() => import('./Component'))
```

### Bundle Analysis
```bash
npm install -D rollup-plugin-visualizer
```

## 🔒 Change API Endpoint

In `.env`:
```env
VITE_OPENWEATHER_API_URL=https://your-api-endpoint.com
```

Then update API calls in `weatherAPI.js`.

## 🎯 Add New Features

### Example: Temperature Alerts
1. Create `src/components/TemperatureAlert.jsx`
2. Add state in `App.jsx`
3. Trigger alerts when temp exceeds threshold

### Example: Favorite Cities
1. Add favorites array to Context
2. Create `FavoritesList.jsx` component
3. Save to localStorage

### Example: Weather Notifications
1. Use Browser Notifications API
2. Request permission on first load
3. Trigger on temperature changes

## 🌐 Internationalization

Install i18next:
```bash
npm install i18next react-i18next
```

Create translation files:
```
src/i18n/
├── en.json
├── es.json
├── fr.json
```

## 🎬 Add Weather Videos/GIFs

Add to component props:
```jsx
<video src={weatherVideo} autoPlay muted loop />
```

## 📊 Analytics Integration

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🔔 Push Notifications

Install service worker support:
```bash
npm install workbox-window
```

## 💾 Database Integration

For saving user preferences:
```bash
npm install firebase
# or
npm install supabase
```

## 🧪 Testing

Add testing libraries:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## 📦 Create PWA (Progressive Web App)

Add web app manifest and service worker for offline support.

---

**Need more help? Check the main README.md**
