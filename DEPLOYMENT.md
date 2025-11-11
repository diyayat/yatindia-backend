# Deployment Guide for YAT India Backend

## Hosting Options for Node.js Backend

### ❌ Hostinger Shared Hosting
**Not Supported** - Hostinger shared hosting does NOT support Node.js applications.

### ✅ Recommended Hosting Options

#### 1. **Railway** (Easiest - Recommended)
- **Free tier available** with $5 credit/month
- Automatic deployments from GitHub
- Built-in environment variables management
- Zero configuration needed

**Steps:**
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in Railway dashboard
6. Deploy!

**Environment Variables needed:**
- `MONGODB_URI`
- `PORT` (auto-set by Railway)
- `FRONTEND_URL`
- `CLOUDFLARE_TURNSTILE_SECRET_KEY`
- `ZOHO_SMTP_USER`
- `ZOHO_SMTP_PASS`
- `ZOHO_SMTP_HOST`
- `ZOHO_SMTP_PORT`
- `ZEPTOMAIL_TO_EMAIL`

---

#### 2. **Render** (Free tier available)
- Free tier with some limitations
- Automatic SSL certificates
- Easy GitHub integration

**Steps:**
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new "Web Service"
4. Connect GitHub repository
5. Build command: `npm install`
6. Start command: `node server.js`
7. Add environment variables
8. Deploy!

---

#### 3. **Vercel** (Serverless - Good for APIs)
- Free tier
- Excellent performance
- Automatic scaling

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in backend directory
3. Follow prompts
4. Add environment variables in Vercel dashboard

**Note:** You'll need a `vercel.json` configuration file for serverless functions.

---

#### 4. **Hostinger VPS** (If you prefer Hostinger)
- Requires server management knowledge
- More control but more setup

**Steps:**
1. Purchase Hostinger VPS plan
2. SSH into your server
3. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`
4. Install PM2: `npm install -g pm2`
5. Clone your repository
6. Install dependencies: `npm install`
7. Set up environment variables
8. Start with PM2: `pm2 start server.js --name yatindia-backend`
9. Set PM2 to start on boot: `pm2 startup && pm2 save`
10. Configure nginx as reverse proxy
11. Set up SSL with Let's Encrypt

---

#### 5. **DigitalOcean App Platform**
- Managed platform (easier than VPS)
- $5/month minimum
- Automatic deployments

---

#### 6. **Fly.io**
- Global edge deployment
- Free tier available
- Great for low latency

---

## Quick Deploy Commands

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize and deploy
railway init
railway up
```

### Render
Just connect your GitHub repo through the web interface.

### Vercel
```bash
npm i -g vercel
vercel
```

---

## Environment Variables Checklist

Make sure to set these in your hosting platform:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=https://your-frontend-domain.com
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_secret_key
ZOHO_SMTP_USER=your_email@zoho.com
ZOHO_SMTP_PASS=your_app_password
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=587
ZEPTOMAIL_TO_EMAIL=info@yatindia.com
```

---

## Database Options

Your backend uses MongoDB. Options:
- **MongoDB Atlas** (Free tier available) - Recommended
- **Railway MongoDB** (if using Railway)
- **Render MongoDB** (if using Render)

---

## File Uploads (Resumes)

The `resumes/` directory is used for file uploads. Make sure:
- The directory exists on your server
- It has write permissions
- Consider using cloud storage (AWS S3, Cloudinary) for production

---

## Monitoring & Logs

- **Railway**: Built-in logs dashboard
- **Render**: Logs in dashboard
- **PM2** (VPS): `pm2 logs yatindia-backend`
- **PM2 Monitoring**: `pm2 monit`

---

## Recommended Setup

For easiest deployment: **Railway + MongoDB Atlas**

1. Deploy backend to Railway (free tier)
2. Use MongoDB Atlas for database (free tier)
3. Deploy frontend to Vercel/Netlify (free)
4. Update `FRONTEND_URL` in backend environment variables

---

## Need Help?

Check the hosting platform's documentation:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs


