# Deployment Guide

This guide walks you through deploying the frontend to Vercel and the backend to Render. Both are free for small projects and easy to set up.

## Prerequisites

- GitHub account (to push your code)
- MongoDB Atlas account (free tier works fine) or your own MongoDB instance
- Vercel account (free)
- Render account (free)

## Step 1: Prepare Your Code

### Backend Setup

1. **Update your `.env` file** in the server directory:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_atlas_connection_string
   SECRET=your_random_secret_key_here
   BASE_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

2. **Update `package.json`** in server directory:
   ```json
   {
     "scripts": {
       "start": "node index.js"
     }
   }
   ```
   Remove nodemon from start script for production.

### Frontend Setup

1. **Update your `.env` file** in client directory:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **Make sure your build works:**
   ```bash
   cd client
   npm run build
   ```

## Step 2: Deploy Backend to Render

1. **Push your code to GitHub:**
   - Create a new repository on GitHub
   - Push your entire project (or just the server folder)

2. **Go to Render Dashboard:**
   - Sign up/login at [render.com](https://render.com)
   - Click "New +" → "Web Service"

3. **Connect Repository:**
   - Connect your GitHub account
   - Select the repository with your backend code
   - Choose the branch (usually `main` or `master`)

4. **Configure the Service:**
   - **Name**: `real-time-chat-backend` (or whatever you like)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to `server` if you have server in a subfolder)

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" and add:
   - `MONGO_URI` = your MongoDB connection string
   - `SECRET` = your JWT secret (any random string)
   - `BASE_URL` = your Vercel frontend URL (you'll update this after deploying frontend)
   - `NODE_ENV` = `production`
   - `PORT` = `8000` (Render sets this automatically, but good to have)

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete (usually 2-5 minutes)
   - Copy your service URL (looks like `https://your-app.onrender.com`)

7. **Important Notes for Render:**
   - Free tier services spin down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds (this is normal)
   - Consider upgrading to paid tier for always-on service

## Step 3: Deploy Frontend to Vercel

1. **Push Frontend Code:**
   - Make sure your frontend code is in GitHub
   - Update `.env` with your Render backend URL

2. **Go to Vercel:**
   - Sign up/login at [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"

3. **Import Repository:**
   - Connect GitHub if not already connected
   - Select your repository
   - Choose the branch

4. **Configure Project:**
   - **Framework Preset**: Vite (or leave as "Other")
   - **Root Directory**: `client` (if your frontend is in a client folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-app.vercel.app`

7. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update `BASE_URL` environment variable to your Vercel URL
   - Redeploy the backend service

## Step 4: Test Your Deployment

1. **Test Frontend:**
   - Visit your Vercel URL
   - Try registering a new user
   - Check browser console for errors

2. **Test Backend:**
   - Try logging in
   - Send a message
   - Check that Socket.IO is connecting (look for "Socket connected" in console)

3. **Common Issues:**
   - **CORS errors**: Make sure `BASE_URL` in backend matches your Vercel URL exactly
   - **Socket not connecting**: Check that backend URL in frontend `.env` is correct
   - **401 errors**: Check that JWT secret is set correctly
   - **Database errors**: Verify MongoDB connection string is correct

## MongoDB Atlas Setup (if needed)

If you don't have MongoDB set up:

1. **Create Account:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select a region close to you
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"

4. **Whitelist IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Render/Vercel)
   - Or add specific IPs

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use this as your `MONGO_URI`

## Troubleshooting

### Backend Issues

**Service won't start:**
- Check build logs in Render dashboard
- Verify all environment variables are set
- Make sure `package.json` has correct start script

**Database connection fails:**
- Verify MongoDB Atlas IP whitelist includes Render IPs
- Check connection string has correct password
- Make sure database user has proper permissions

**Socket.IO not working:**
- Check that Socket.IO is properly initialized in `index.js`
- Verify CORS settings allow your frontend URL
- Check Render logs for Socket.IO errors

### Frontend Issues

**Build fails:**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Make sure environment variables are set correctly

**API calls fail:**
- Verify `VITE_API_URL` is set correctly
- Check that backend is deployed and running
- Look for CORS errors in browser console

**Socket not connecting:**
- Verify backend URL is correct
- Check that backend is not sleeping (Render free tier)
- Look for connection errors in browser console

## Updating Your Deployment

### Backend Updates:
1. Push changes to GitHub
2. Render automatically detects changes and redeploys
3. Or manually trigger redeploy from Render dashboard

### Frontend Updates:
1. Push changes to GitHub
2. Vercel automatically detects changes and redeploys
3. Or manually trigger redeploy from Vercel dashboard

## Cost

- **Vercel**: Free tier includes unlimited deployments, 100GB bandwidth
- **Render**: Free tier includes 750 hours/month (enough for always-on if you're the only user)
- **MongoDB Atlas**: Free tier includes 512MB storage

All three services have generous free tiers perfect for personal projects and small applications.

