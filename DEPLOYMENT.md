# 🚀 Deployment Guide

Complete guide to deploy your weather app to production.

## 🌐 Deployment Platforms

### 1. Vercel (Recommended - Easiest)

**Why Vercel?**
- Built by Vite creators
- Automatic deployments from Git
- Free tier very generous
- Zero-config setup

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Next.js" framework or "Other"
   - Set project name, output directory (dist/)

4. **Environment Variables**
   - Vercel dashboard → Project → Settings → Environment Variables
   - Add `VITE_OPENWEATHER_API_KEY` with your API key
   - Redeploy

5. **Auto-Deployments**
   - Connect GitHub repository
   - Automatic deployment on push

**Verification:**
- You'll get a URL like: `https://your-app.vercel.app`
- Test search and location features

---

### 2. Netlify

**Steps:**

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI** (Optional)
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or Manual Deployment**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Create new site from Git
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy Site"

4. **Set Environment Variables**
   - Site settings → Environment
   - Add variables with `VITE_` prefix
   - Trigger redeploy

**Result:** Your app deployed on Netlify's CDN

---

### 3. GitHub Pages

**Setup:**

1. **Update vite.config.js**
   ```js
   export default {
     base: '/weather-app/', // if repo is weather-app
     // base: '/', // if using user/org pages
   }
   ```

2. **Create deploy script** (package.json)
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable Pages**
   - GitHub repo → Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Click Save

**Your site:** `https://username.github.io/weather-app`

---

### 4. AWS (More Complex)

**Using S3 + CloudFront:**

1. **Build**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - AWS Console → S3 → Create bucket
   - Name: your-weather-app
   - Unblock public access
   - Upload dist/ files
   - Enable static website hosting

3. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Configure cache behavior
   - Deploy

4. **Add Environment Variables**
   - AWS Secrets Manager
   - Or hardcode in .env during build

**Cost:** ~$1-5/month

---

### 5. Docker (Container)

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

**Build & Run:**
```bash
docker build -t weather-app .
docker run -p 80:80 weather-app
```

---

### 6. Railway.app

**Simple & Fast:**

1. Push code to GitHub
2. Connect Railway to GitHub
3. Select repository
4. Set environment variables
5. Auto-deployed!

---

## ⚙️ Pre-Deployment Checklist

Before deploying, verify:

- [ ] `npm run build` runs without errors
- [ ] `npm run preview` shows working app
- [ ] Search functionality works
- [ ] Location button works
- [ ] Dark mode toggles
- [ ] Forecast displays
- [ ] No console errors
- [ ] API key is set in .env
- [ ] Mobile responsive works
- [ ] Images load correctly

---

## 🔐 Environment Variables Setup

### Vercel
```
Settings → Environment Variables
Add: VITE_OPENWEATHER_API_KEY
Value: your_api_key_here
Environments: Production
```

### Netlify
```
Site settings → Environment
Add: VITE_OPENWEATHER_API_KEY
Value: your_api_key_here
```

### GitHub Pages
```
Settings → Secrets and variables → Actions
Add: VITE_OPENWEATHER_API_KEY
Value: your_api_key_here
```

---

## 📊 Performance Optimization

### Before Deployment

1. **Minify & Bundle**
   ```bash
   npm run build
   ```
   Creates optimized dist/ folder

2. **Check Bundle Size**
   ```bash
   npm install -g vite-plugin-visualizer
   npm run build
   ```

3. **Image Optimization**
   - OpenWeatherMap icons are already optimized
   - No large images in project

4. **Code Splitting**
   - Vite automatically code-splits
   - No additional setup needed

### After Deployment

1. **Enable Compression** (CDN)
   - Vercel/Netlify do this automatically
   - GZip compression enabled

2. **Enable Caching**
   - Set cache headers for static files
   - Usually automatic on CDNs

3. **Monitor Performance**
   - Use Lighthouse CI
   - Check PageSpeed Insights

---

## 🔍 Testing Production Build

### Locally
```bash
npm run build
npm run preview
# Open http://localhost:5173
```

### Check Functionality
- [ ] Search: Try "Paris"
- [ ] Location: Check "My Location"
- [ ] Charts: Verify display
- [ ] Dark mode: Toggle theme
- [ ] Forecast: Scroll cards
- [ ] Responsive: Resize window

### Check Performance
- Open DevTools (F12)
- Network tab: Check load time
- Console: No errors
- Performance tab: Run audit

---

## 🚨 Troubleshooting Deployment

### "API key not found"
**Problem:** Environment variables not set
**Solution:** 
- Check platform's env var settings
- Use exact name: `VITE_OPENWEATHER_API_KEY`
- Redeploy after adding variables

### "Blank page on load"
**Problem:** Build failed or incorrect base path
**Solution:**
- Check build logs
- Verify dist/ folder created
- Check vite.config.js base path

### "404 on page refresh"
**Problem:** SPA routing not configured
**Solution:**
- Add redirect rules to index.html
- For Vercel/Netlify: Automatic
- For static hosts: Create _redirects file

**_redirects file:**
```
/*  /index.html  200
```

### "Styles not loading"
**Problem:** CSS path issues
**Solution:**
- Check vite.config.js base path
- Clear browser cache
- Verify dist/assets/ folder

---

## 📈 Monitoring & Analytics

### Add Google Analytics
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Monitor Errors
- Sentry or similar service
- Automatic error reporting
- Real-time alerting

### Performance Monitoring
- Web Vitals
- Lighthouse scores
- User experience metrics

---

## 🔄 Continuous Deployment

### GitHub Actions (Auto Deploy)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 💰 Cost Comparison

| Platform | Cost | Good For |
|----------|------|----------|
| Vercel | Free tier generous | Most projects |
| Netlify | Free tier great | Static sites |
| GitHub Pages | Always free | Side projects |
| AWS | Pay-as-you-go (~$5/mo) | Scaling |
| Railway | Free tier, then $5/mo | Quick setup |
| Docker | Depends on host | Enterprise |

---

## 🌍 Custom Domain

### Add Custom Domain to Vercel
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides steps)
4. Wait 24-48 hours for DNS propagation

### Add Custom Domain to Netlify
1. Netlify Dashboard → Domain management
2. Add custom domain
3. Update DNS or use Netlify nameservers
4. Automatic HTTPS certificate

### Domain Providers
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare (free DNS)

---

## 🔒 HTTPS & Security

- ✅ Vercel: Automatic HTTPS
- ✅ Netlify: Automatic HTTPS
- ✅ GitHub Pages: Automatic HTTPS
- ✅ AWS + CloudFront: Set in CloudFront
- ✅ All modern platforms: Default HTTPS

---

## 📱 Mobile App (Optional)

### Convert to Mobile App
1. Use Capacitor or Cordova
2. Wrap web app in native container
3. Deploy to App Store / Play Store

**Simple Alternative:**
- Create PWA (Progressive Web App)
- "Add to Home Screen" on mobile
- Works offline with Service Workers

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Visit live URL
- [ ] Test search functionality
- [ ] Test location button
- [ ] Verify API is working
- [ ] Check dark mode
- [ ] Test on mobile
- [ ] Check console for errors
- [ ] Verify HTTPS works
- [ ] Share with friends!

---

## 🎯 Which Platform to Choose?

**Choose Vercel if:**
- First time deploying
- Want easiest setup
- Need production-ready infrastructure

**Choose Netlify if:**
- Prefer alternative to Vercel
- Want good free tier
- Building static site

**Choose GitHub Pages if:**
- Project is open-source
- Don't want to pay
- Repository is on GitHub

**Choose AWS if:**
- Need enterprise features
- Expect high traffic
- Need custom configuration

**Choose Docker if:**
- Deploying to own server
- Need containerization
- Multiple environments

---

## 🚀 One-Click Deployment

Most platforms offer one-click deploy:

**Vercel:**
```
https://vercel.com/new/clone?repository-url=https://github.com/username/weather-app
```

**Netlify:**
```
https://app.netlify.com/start
```

---

## 📚 Additional Resources

- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Netlify Deployment](https://docs.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [AWS Deployment](https://aws.amazon.com/getting-started/)

---

**Your weather app is ready to go live!** 🌍

Choose a platform above and deploy in minutes. Recommend starting with **Vercel** for easiest experience.
