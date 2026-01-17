# 🎬 ReelFlow - Complete TikTok-Style Video App

## 📋 Project Overview

ReelFlow is a **production-ready, full-stack TikTok-style short video sharing platform** built with modern web technologies. The application features vertical video scrolling, autoplay, user authentication, video uploads, and social interactions.

### ✨ Key Features

✅ **User Authentication**
- JWT-based secure authentication
- bcrypt password hashing
- Protected routes with middleware
- Session management with localStorage

✅ **Video Management**
- Upload videos (max 60 seconds, 50MB)
- Drag-and-drop upload interface
- Real-time upload progress
- Video validation (format, size, duration)

✅ **TikTok-Style Feed**
- Full-screen vertical video scrolling
- Scroll-snap for smooth transitions
- Auto-play videos on scroll
- Pause when out of view
- Infinite scroll with pagination

✅ **Social Features**
- Like/unlike videos
- Animated like button
- View counter
- Video captions
- User profiles

✅ **Modern UI/UX**
- Mobile-first responsive design
- Dark theme (TikTok-inspired)
- Glass morphism effects
- Smooth animations
- Toast notifications

---

## 🏗️ Technical Architecture

### Backend Stack

```
Node.js + Express.js
├── MongoDB + Mongoose (Database)
├── JWT (Authentication)
├── Bcrypt (Password Hashing)
├── Multer (File Upload)
└── CORS (Cross-Origin)
```

### Frontend Stack

```
Pure TypeScript (No Framework)
├── Tailwind CSS (Styling)
├── HTML5 Video API
├── ES6 Modules
└── Vite (Build Tool)
```

### Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   ├── videoController.js   # Video CRUD
│   │   │   └── userController.js    # User management
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── upload.js            # Multer config
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Video.js             # Video schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth/*
│   │   │   ├── videoRoutes.js       # /api/videos/*
│   │   │   └── userRoutes.js        # /api/users/*
│   │   ├── seed.js                  # Sample data seeder
│   │   └── server.js                # Express app
│   ├── uploads/                      # Video storage
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── pages/
│   │   ├── login.html               # Login page
│   │   ├── signup.html              # Signup page
│   │   ├── feed.html                # Video feed
│   │   └── upload.html              # Upload page
│   ├── js/
│   │   ├── api.js                   # API client
│   │   ├── auth.js                  # Auth helpers
│   │   ├── config.js                # Configuration
│   │   ├── utils.js                 # Utilities
│   │   ├── feed.js                  # Feed logic
│   │   ├── login.js                 # Login handler
│   │   ├── signup.js                # Signup handler
│   │   └── upload.js                # Upload handler
│   ├── css/
│   │   └── styles.css               # Custom styles
│   ├── index.html                    # Landing page
│   └── package.json
│
└── Documentation/
    ├── PROJECT_README.md
    ├── DEPLOYMENT.md
    ├── QUICKSTART.md
    └── COMPLETE_SETUP_GUIDE.md (this file)
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have:
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **MongoDB** v5 or higher (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Install MongoDB

#### Option A: Local MongoDB (Linux/macOS)

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string (looks like: `mongodb+srv://...`)

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (ALREADY DONE ✅)
npm install

# The .env file has been created with default values
# If using MongoDB Atlas, update MONGODB_URI in .env:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelflow

# Start the backend server
npm run dev

# Server will run on http://localhost:5000
```

### Step 3: Seed Database (Optional but Recommended)

```bash
# In the backend directory, run:
npm run seed

# This creates:
# - 5 test users (alice_creator, bob_videos, charlie_reels, diana_shorts, emma_clips)
# - 15 sample videos with random likes and views
#
# Test credentials:
# Email: alice_creator@example.com
# Password: password123
```

### Step 4: Frontend Setup

```bash
# Open a new terminal window
cd frontend

# Install dependencies (ALREADY DONE ✅)
npm install

# Start the development server
npm run dev

# Frontend will run on http://localhost:5173
```

### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the ReelFlow landing page!

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: (same as register)
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "..."
  }
}
```

### Video Endpoints

#### Upload Video (Protected)
```http
POST /api/videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- video: <file> (max 50MB, max 60 seconds)
- caption: "My awesome video!"

Response:
{
  "success": true,
  "video": {
    "_id": "...",
    "videoUrl": "/uploads/...",
    "caption": "My awesome video!",
    "userId": "...",
    "likes": [],
    "views": 0,
    "createdAt": "..."
  }
}
```

#### Get Video Feed (Protected)
```http
GET /api/videos/feed?page=1&limit=10
Authorization: Bearer <token>

Response:
{
  "success": true,
  "videos": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalVideos": 50,
  "hasMore": true
}
```

#### Like/Unlike Video (Protected)
```http
POST /api/videos/:videoId/like
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Video liked successfully",
  "isLiked": true,
  "likeCount": 42
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/:userId

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "username": "johndoe",
    "bio": "...",
    "createdAt": "..."
  }
}
```

---

## 💾 Database Schemas

### User Schema

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Never returned in queries
  },
  profilePicture: String,
  bio: {
    type: String,
    maxlength: 200
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Video Schema

```javascript
{
  videoUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    maxlength: 500
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  duration: Number,  // in seconds
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 🎨 Frontend Pages

### 1. Landing Page (`/index.html`)
- Hero section with call-to-action
- Features showcase (6 key features)
- "How it works" section (3 steps)
- Responsive navigation
- Links to login/signup

### 2. Login Page (`/pages/login.html`)
- Email and password fields
- Password visibility toggle
- Form validation
- Error handling
- "Remember me" option

### 3. Signup Page (`/pages/signup.html`)
- Username, email, and password fields
- Real-time validation
- Password strength indicator
- Terms acceptance
- Link to login page

### 4. Video Feed (`/pages/feed.html`)
- Full-screen vertical videos
- Scroll-snap behavior
- Auto-play on scroll
- Like button with animation
- Video info overlay (username, caption, stats)
- Infinite scroll
- Top navigation bar
- Bottom navigation (Home, Upload, Profile)

### 5. Upload Page (`/pages/upload.html`)
- Drag-and-drop zone
- File browser button
- Video preview
- Caption input (500 char max)
- File validation
- Upload progress bar
- Tips and guidelines

---

## 🔒 Security Features

### 1. Password Security
- **bcrypt hashing** with 10 salt rounds
- Passwords never stored in plain text
- Passwords never returned in API responses
- Minimum length validation (6 characters)

### 2. JWT Authentication
- Secure token generation with secret key
- Token expiration (7 days default)
- Bearer token in Authorization header
- Middleware protection for sensitive routes

### 3. Input Validation
- Email format validation
- Username length limits (3-30 chars)
- Password strength requirements
- File type validation (video formats only)
- File size limits (50MB max)
- Video duration limits (60 seconds max)

### 4. CORS Configuration
- Whitelist specific origins
- Credentials support enabled
- Configurable via environment variables

---

## 🌐 Deployment Guide

### Backend Deployment (Render.com)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up for free

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the `backend` folder as root directory

3. **Configure Service**
   - Name: `reelflow-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-secure-secret-key>
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-url.vercel.app
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your backend URL

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your Git repository
   - Select the `frontend` folder as root directory

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Update API URL**
   - Before deploying, update `frontend/js/config.js`:
   ```javascript
   export const CONFIG = {
       API_URL: 'https://your-backend-url.onrender.com/api',
       // ...
   };
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (1-2 minutes)
   - Your app is live!

### MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster (M0 - 512MB)

2. **Configure Network Access**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)

3. **Create Database User**
   - Go to "Database Access"
   - Add new user with password
   - Grant "Read and write to any database" permission

4. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your user password
   - Replace `<dbname>` with `reelflow`

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User can register with valid credentials
- [ ] Duplicate username/email is rejected
- [ ] User can login with correct credentials
- [ ] Invalid credentials show error
- [ ] JWT token is stored in localStorage
- [ ] Protected routes redirect to login when not authenticated

#### Video Upload
- [ ] User can upload video (MP4, WebM, MOV)
- [ ] Invalid file types are rejected
- [ ] Files over 50MB are rejected
- [ ] Videos over 60 seconds are rejected
- [ ] Upload progress is displayed
- [ ] Caption can be added (optional)
- [ ] Successful upload redirects to feed

#### Video Feed
- [ ] Videos load on page load
- [ ] Scroll-snap works correctly
- [ ] Videos auto-play when in view
- [ ] Videos pause when out of view
- [ ] Like button works (toggle on/off)
- [ ] Like count updates correctly
- [ ] Infinite scroll loads more videos
- [ ] Video info is displayed (username, caption, stats)

#### Responsive Design
- [ ] Landing page looks good on mobile
- [ ] Login/signup pages are mobile-friendly
- [ ] Video feed adapts to screen size
- [ ] Upload page works on mobile
- [ ] Navigation menu works on all devices

### API Testing with curl

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get feed (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/videos/feed \
  -H "Authorization: Bearer TOKEN"

# Like video (replace VIDEO_ID and TOKEN)
curl -X POST http://localhost:5000/api/videos/VIDEO_ID/like \
  -H "Authorization: Bearer TOKEN"
```

---

## 🎯 Usage Examples

### Example 1: Create Account and Upload Video

1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill in registration form:
   - Username: myusername
   - Email: myemail@example.com
   - Password: securepass123
4. Click "Create Account"
5. You'll be redirected to the feed
6. Click the "+" button in bottom navigation
7. Drag and drop a video file
8. Add a caption: "My first video!"
9. Click "Upload Video"
10. Video will appear in your feed

### Example 2: Browse and Like Videos

1. Login to your account
2. Feed page loads automatically
3. Scroll down to see more videos
4. Videos will auto-play as they come into view
5. Click the heart icon to like a video
6. Like count increases and icon turns red
7. Click again to unlike

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "Cannot connect to MongoDB"
```
Solution:
1. Check if MongoDB is running: `systemctl status mongod`
2. Verify MONGODB_URI in .env file
3. For Atlas, check network access settings
```

**Problem:** "JWT must be provided"
```
Solution:
1. Ensure you're sending Authorization header
2. Format: "Authorization: Bearer <token>"
3. Check if token is expired (default: 7 days)
```

**Problem:** "File too large"
```
Solution:
1. Check MAX_FILE_SIZE in .env (default: 50MB)
2. Compress video before uploading
3. Use shorter video duration
```

### Frontend Issues

**Problem:** "Network Error" when calling API
```
Solution:
1. Verify backend is running on http://localhost:5000
2. Check CORS settings in backend
3. Update API_URL in frontend/js/config.js
```

**Problem:** "Videos not auto-playing"
```
Solution:
1. Check browser autoplay policy (may require user interaction)
2. Try muting videos by default
3. Clear browser cache
```

**Problem:** "Login/Signup not working"
```
Solution:
1. Check browser console for errors
2. Verify form validation rules
3. Test API endpoints with curl
4. Check backend logs
```

---

## 📝 Environment Variables Reference

### Backend (.env)

```bash
# Server Configuration
PORT=5000                          # Server port
NODE_ENV=development               # Environment (development/production)

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/reelflow  # Database connection string
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/reelflow

# JWT Configuration
JWT_SECRET=your-super-secret-key   # Secret key for JWT signing (CHANGE THIS!)
JWT_EXPIRE=7d                      # Token expiration time

# CORS Configuration
CLIENT_URL=http://localhost:3000   # Frontend URL for CORS

# File Upload Configuration
MAX_FILE_SIZE=52428800             # Max file size in bytes (50MB)
```

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set proper CORS_ORIGIN (specific domain, not *)
- [ ] Add rate limiting for API endpoints
- [ ] Implement proper error logging (e.g., Sentry)
- [ ] Set up database backups
- [ ] Add video compression/optimization
- [ ] Implement CDN for video delivery
- [ ] Add monitoring and analytics
- [ ] Test on multiple devices and browsers
- [ ] Set up CI/CD pipeline
- [ ] Review and update security headers

---

## 🎓 Learning Resources

### Technologies Used

- **Node.js**: [Official Docs](https://nodejs.org/docs/)
- **Express.js**: [Express Guide](https://expressjs.com/en/guide/routing.html)
- **MongoDB**: [MongoDB Manual](https://docs.mongodb.com/manual/)
- **Mongoose**: [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- **JWT**: [JWT.io](https://jwt.io/introduction)
- **Tailwind CSS**: [Tailwind Docs](https://tailwindcss.com/docs)
- **Vite**: [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 Contributing

Want to improve ReelFlow? Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

If you need help:

1. Check the [QUICKSTART.md](./QUICKSTART.md) for common issues
2. Review the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
3. Read the [PROJECT_README.md](./PROJECT_README.md) for detailed documentation

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 🎉 Conclusion

You now have a **complete, production-ready TikTok-style video sharing platform**!

### What's Working:
✅ Full backend API with authentication
✅ Complete frontend with all pages
✅ Database schemas and models
✅ Video upload and storage
✅ TikTok-style video feed
✅ Like system and social features
✅ Responsive design
✅ Security best practices

### Ready to Deploy:
🚀 Backend can be deployed to Render, Railway, or Heroku
🚀 Frontend can be deployed to Vercel or Netlify
🚀 Database can use MongoDB Atlas (free tier available)

### Quick Commands:

```bash
# Backend
cd backend
npm install        # ✅ Already done
npm run dev        # Start backend server
npm run seed       # Seed database with test data

# Frontend
cd frontend
npm install        # ✅ Already done
npm run dev        # Start frontend server

# Access
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# API:      http://localhost:5000/api
```

**Happy coding! 🎬**
