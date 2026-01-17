# Reelify - Deployment Guide

Complete deployment guide for the TikTok-like video sharing platform.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Production Checklist](#production-checklist)

---

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) installed locally OR MongoDB Atlas account
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (edit `.env` file)
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/reelify
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   MAX_FILE_SIZE=52428800
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Start backend server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # OR Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API URL** (in `frontend/js/config.js`)
   ```javascript
   export const CONFIG = {
       API_URL: 'http://localhost:5000/api',
       // ... rest of config
   };
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

5. **Access the application**
   Open browser to `http://localhost:5173`

---

## Backend Deployment

### Option 1: Deploy to Render.com (Recommended)

1. **Create account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `backend` directory
   - Configure:
     - **Name**: `reelify-api`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (or paid for production)

3. **Set Environment Variables** in Render dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<generate_strong_random_string>
   JWT_EXPIRE=7d
   CLIENT_URL=<your_frontend_url>
   MAX_FILE_SIZE=52428800
   ```

4. **Deploy** - Render will automatically deploy your backend

5. **Note your backend URL** (e.g., `https://reelify-api.onrender.com`)

### Option 2: Deploy to Railway.app

1. **Create account** at [railway.app](https://railway.app)

2. **New Project** → **Deploy from GitHub**
   - Select repository
   - Choose `backend` directory
   - Railway auto-detects Node.js

3. **Add Environment Variables** in Variables tab

4. **Deploy** - Railway handles the rest

### Option 3: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   cd backend
   heroku create reelify-api
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=<your_mongodb_uri>
   heroku config:set JWT_SECRET=<your_secret>
   heroku config:set CLIENT_URL=<your_frontend_url>
   heroku config:set MAX_FILE_SIZE=52428800
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Update API URL** in `frontend/js/config.js`:
   ```javascript
   export const CONFIG = {
       API_URL: 'https://your-backend-url.com/api',
       // ... rest of config
   };
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

   Or connect via Vercel dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Deploy

### Option 2: Deploy to Netlify

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

   Or via Netlify dashboard:
   - Drag and drop `dist` folder
   - Or connect GitHub repository

### Option 3: Deploy to GitHub Pages

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Install gh-pages
   npm install -g gh-pages

   # Deploy
   gh-pages -d dist
   ```

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `production` or `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/reelify` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_key_min_32_chars` |
| `JWT_EXPIRE` | JWT expiration time | `7d` (7 days) |
| `CLIENT_URL` | Frontend URL (for CORS) | `https://reelify.vercel.app` |
| `MAX_FILE_SIZE` | Max video file size in bytes | `52428800` (50MB) |

### Frontend Configuration

Update `frontend/js/config.js`:

```javascript
export const CONFIG = {
    API_URL: 'https://your-backend-url.com/api', // Your deployed backend URL
    // ... rest remains same
};
```

---

## Database Setup

### MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select cloud provider and region
   - Click "Create Cluster"

3. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set role to "Read and write to any database"
   - Save

5. **Get Connection String**
   - Go to "Databases"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `reelify`

   Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/reelify?retryWrites=true&w=majority
   ```

6. **Use in your app**
   - Add connection string to backend `.env` file
   - Or set as environment variable in your deployment platform

### Local MongoDB

If running MongoDB locally:

1. **Install MongoDB**
   - macOS: `brew install mongodb-community`
   - Ubuntu: `sudo apt-get install mongodb`
   - Windows: Download from mongodb.com

2. **Start MongoDB**
   ```bash
   mongod
   ```

3. **Connection String**
   ```
   mongodb://localhost:27017/reelify
   ```

---

## Production Checklist

### Security
- [ ] Change JWT_SECRET to strong random string (min 32 characters)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set up rate limiting for API endpoints
- [ ] Configure CORS properly (whitelist specific origins)
- [ ] Validate and sanitize all user inputs
- [ ] Keep dependencies updated

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for video files (optional: use AWS S3 + CloudFront)
- [ ] Add database indexes for common queries
- [ ] Implement caching where appropriate
- [ ] Optimize video file sizes
- [ ] Use lazy loading for images and videos

### Monitoring
- [ ] Set up error logging (e.g., Sentry)
- [ ] Monitor server health and uptime
- [ ] Track API response times
- [ ] Set up database backups
- [ ] Monitor storage usage

### Testing
- [ ] Test all API endpoints
- [ ] Test video upload functionality
- [ ] Test authentication flow
- [ ] Test on multiple devices and browsers
- [ ] Test with slow network connections
- [ ] Load testing with multiple concurrent users

### Backup
- [ ] Set up automated database backups
- [ ] Back up uploaded video files
- [ ] Document recovery procedures

---

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as register
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": { ... }
}
```

### Video Endpoints

#### Upload Video
```http
POST /videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- video: <video_file>
- caption: "My awesome video"

Response:
{
  "success": true,
  "data": {
    "video": { ... }
  }
}
```

#### Get Feed
```http
GET /videos/feed?page=1&limit=10
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "videos": [ ... ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalVideos": 50
    }
  }
}
```

#### Toggle Like
```http
POST /videos/:videoId/like
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "liked": true,
    "likes": 10
  }
}
```

### User Endpoints

#### Get User Profile
```http
GET /users/:userId

Response:
{
  "success": true,
  "user": { ... }
}
```

---

## Troubleshooting

### Common Issues

**1. CORS Error**
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `backend/src/server.js`

**2. Video Upload Fails**
- Check file size limit (max 50MB)
- Ensure `uploads` directory exists and has write permissions
- Verify video format is supported (MP4, MOV, WebM)

**3. MongoDB Connection Error**
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

**4. JWT Authentication Error**
- Check JWT_SECRET is set correctly
- Ensure token is being sent in Authorization header
- Verify token hasn't expired

**5. Videos Not Playing**
- Check video URL is accessible
- Verify CORS headers allow video streaming
- Ensure video file exists on server

### Getting Help

- Check browser console for frontend errors
- Check server logs for backend errors
- Verify all environment variables are set correctly
- Test API endpoints with Postman or curl

---

## Maintenance

### Regular Tasks
- Monitor disk space for uploaded videos
- Clean up old/unused videos periodically
- Update dependencies monthly
- Review and rotate JWT secrets quarterly
- Monitor and optimize database performance
- Check server logs for errors

### Scaling Considerations
- Use cloud storage (S3, Cloudinary) for videos
- Implement video transcoding for multiple qualities
- Add database read replicas
- Use load balancer for multiple backend instances
- Implement caching layer (Redis)
- Add job queue for video processing

---

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Submit a pull request
- Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
