# ⚡ Quick Start Guide

Get your weather app running in 5 minutes!

## 🎯 Option 1: Windows Users

### Step 1: Open Command Prompt
Press `Win + R`, type `cmd`, and press Enter.

### Step 2: Navigate to Project
```bash
cd Downloads\weather
```

### Step 3: Run Setup
```bash
setup.bat
```

This will:
- ✅ Check Node.js installation
- ✅ Install all dependencies
- ✅ Create .env file
- ✅ Start the dev server automatically

### Step 4: Open Browser
Navigate to: **http://localhost:3000**

---

## 🍎 Option 2: Mac/Linux Users

### Step 1: Open Terminal
Press `Cmd + Space`, type `terminal`, and press Enter.

### Step 2: Navigate to Project
```bash
cd ~/Downloads/weather
```

### Step 3: Make Script Executable
```bash
chmod +x setup.sh
```

### Step 4: Run Setup
```bash
./setup.sh
```

### Step 5: Open Browser
Navigate to: **http://localhost:3000**

---

## 📝 Manual Setup (All Platforms)

If the setup scripts don't work, follow these steps:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Wait for Message
Look for:
```
  ➜  Local:   http://localhost:3000/
```

### Step 4: Click or Copy URL
Open the URL in your browser.

---

## 🧪 Test the App

### ✅ Search Function
1. Type "London" in search bar
2. Click Search button
3. Should see London weather

### ✅ Location Function
1. Click "My Location" button
2. Allow location permission
3. Should see your current weather

### ✅ Dark Mode
1. Click moon icon in top-right
2. Theme should switch to dark
3. Click sun icon to switch back

### ✅ 7-Day Forecast
1. Scroll down to forecast cards
2. Swipe left/right on mobile
3. Cards should show daily predictions

---

## 📱 Mobile Testing

### On Your Phone
1. Find your computer's IP address:
   - Windows: `ipconfig` → look for IPv4 Address
   - Mac/Linux: `ifconfig` → look for inet

2. Replace localhost with IP:
   - Instead of: `http://localhost:3000`
   - Use: `http://YOUR_IP:3000`

3. Open in phone browser

---

## 🆘 Common Issues

### "Port 3000 Already in Use"
```bash
npm run dev -- --port 3001
```
Then open: `http://localhost:3001`

### "Cannot find module 'react'"
```bash
npm install
npm run dev
```

### "API not working"
1. Check internet connection
2. Verify `.env` file exists
3. Restart dev server

### "Dark mode not working"
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)

---

## 📦 Build for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized `dist/` folder.

To preview the production build:
```bash
npm run preview
```

---

## 🚀 Next Steps

1. ✅ Customize colors in `tailwind.config.js`
2. ✅ Add your own features
3. ✅ Deploy to Vercel/Netlify
4. ✅ Share with friends!

---

## 📚 File Guide

Here's what each file does:

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `.env` | API keys (don't share!) |
| `tailwind.config.js` | Styling configuration |
| `src/App.jsx` | Main app component |
| `src/components/` | All UI components |
| `src/utils/` | Helper functions & API calls |

---

## 💡 Tips

- **Faster loading**: Close unused browser tabs
- **Better animations**: Use Chrome browser
- **Mobile testing**: Rotate your phone to test responsive design
- **Code changes**: App auto-refreshes when you save files
- **Need help?**: Check README.md or CUSTOMIZATION.md

---

## 🎉 You're Ready!

Your weather app is now running. Start by searching for your city or using geolocation. Enjoy! 🌤️

---

**Questions?** Check these files:
- General info → `README.md`
- Customization → `CUSTOMIZATION.md`
- Troubleshooting → `README.md` (Troubleshooting section)
