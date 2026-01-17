# 🚀 ReelFlow Installation Guide

## Complete Step-by-Step Installation Instructions

---

## 📋 Prerequisites

Before starting, ensure you have installed:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** - Choose one:
  - Local: [Download](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **Code Editor** (VS Code recommended)

### Verify Prerequisites

```bash
# Check Node.js version (should be v18+)
node --version

# Check npm version
npm --version

# Check MongoDB (if local)
mongod --version

# Check Git
git --version
```

---

## 📦 Installation Steps

### Step 1: Clone or Download Project

```bash
# If using Git
git clone <your-repository-url>
cd reelflow

# Or download and extract ZIP, then navigate to folder
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies (this may take 1-2 minutes)
npm install

# You should see something like:
# added 150 packages in 45s
```

**Create Environment File:**

```bash
# Copy example environment file
cp .env.example .env

# On Windows:
copy .env.example .env
```

**Edit `.env` file** with your settings:

```env
# Open backend/.env and update:
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reelflow
JWT_SECRET=change_this_to_random_32_character_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=52428800
```

**Generate Secure JWT Secret:**

```bash
# Run this command to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and paste it as JWT_SECRET in .env
```

**Create uploads directory:**

```bash
mkdir uploads
# This folder will store uploaded videos
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd ../frontend

# Install dependencies
npm install

# You should see something like:
# added 50 packages in 20s
```

**No configuration needed for frontend in development!**
(It's already set to use `http://localhost:5000/api`)

### Step 4: Start MongoDB

**Option A: Local MongoDB**

```bash
# Start MongoDB service
mongod

# On Windows, you might need:
# "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# On macOS with Homebrew:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP (allow from anywhere: 0.0.0.0/0)
6. Get connection string
7. Update `MONGODB_URI` in `backend/.env`

Example Atlas URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/reelflow
```

---

## 🚀 Running the Application

### Start Backend Server

Open a new terminal window:

```bash
# Navigate to backend folder
cd backend

# Start development server (auto-reloads on changes)
npm run dev

# You should see:
# ✅ MongoDB Connected: ...
# 🚀 Server running on port 5000
# 📝 Environment: development
# 🌐 CORS enabled for: http://localhost:3000
```

**Backend is now running at:** `http://localhost:5000`

### Start Frontend Server

Open another terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Start development server
npm run dev

# You should see:
# VITE v5.0.8  ready in 500 ms
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
```

**Frontend is now running at:** `http://localhost:3000`

---

## ✅ Verify Installation

### 1. Check Backend Health

Open browser or use curl:

```bash
curl http://localhost:5000/api/health

# Should return:
# {
#   "success": true,
#   "message": "Server is running",
#   "timestamp": "..."
# }
```

### 2. Open Frontend

Navigate to: `http://localhost:3000`

You should see:
- ✅ Beautiful landing page
- ✅ ReelFlow logo and branding
- ✅ Sign Up / Login buttons
- ✅ Feature sections
- ✅ No error messages

### 3. Test User Registration

1. Click "Sign Up" button
2. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
3. Click "Create Account"
4. Should redirect to video feed

### 4. Test Video Upload

1. Click upload button (+ icon in top right)
2. Drag and drop a video file (or click to select)
3. Add a caption
4. Click "Upload Video"
5. Should see success message
6. Redirect to feed to see your video

---

## 🛠️ Troubleshooting

### Backend Won't Start

**Issue: Port 5000 already in use**
```bash
# Find and kill process on port 5000
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

**Issue: MongoDB connection failed**
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ping')"

# Or start MongoDB:
mongod

# Check connection string in .env
```

**Issue: Module not found**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Start

**Issue: Port 3000 already in use**
```bash
# Kill process on port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

**Issue: Cannot connect to backend**
- Check backend is running on port 5000
- Check `API_BASE_URL` in `frontend/js/config.ts`
- Verify CORS settings in backend `.env`

### CORS Errors

**Issue: CORS policy blocking requests**

Update `backend/.env`:
```env
CLIENT_URL=http://localhost:3000
```

Restart backend server.

### Upload Fails

**Issue: Video won't upload**

Check:
1. ✅ `backend/uploads/` folder exists
2. ✅ Video is under 50MB
3. ✅ Video format is MP4, MOV, AVI, MKV, or WEBM
4. ✅ Backend console for error messages

Create uploads folder:
```bash
cd backend
mkdir uploads
chmod 755 uploads
```

### Videos Don't Play

**Issue: Videos load but don't play**

1. Check video format (MP4 works best)
2. Open browser console for errors
3. Verify video file exists in `backend/uploads/`
4. Check backend is serving static files

---

## 📱 Testing on Mobile

### Option 1: Same Network

```bash
# Find your computer's IP address

# On macOS:
ipconfig getifaddr en0

# On Linux:
hostname -I

# On Windows:
ipconfig

# Update frontend to use your IP:
# Edit frontend/js/config.ts
export const API_BASE_URL = 'http://YOUR_IP:5000/api';

# Update backend .env:
CLIENT_URL=http://YOUR_IP:3000

# Restart both servers
# Access from phone: http://YOUR_IP:3000
```

### Option 2: Ngrok (Tunneling)

```bash
# Install ngrok
npm install -g ngrok

# Tunnel backend
ngrok http 5000

# Tunnel frontend
ngrok http 3000

# Update API_BASE_URL to ngrok URLs
```

---

## 🔧 Development Commands

### Backend Commands

```bash
cd backend

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Check for errors
npm run lint  # (if configured)
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Commands

```bash
# Connect to MongoDB
mongo

# Or MongoDB shell:
mongosh

# Show databases
show dbs

# Use reelflow database
use reelflow

# Show collections
show collections

# Find all users
db.users.find()

# Find all videos
db.videos.find()

# Count videos
db.videos.countDocuments()
```

---

## 📚 Next Steps

After successful installation:

1. ✅ Read [REELFLOW_README.md](./REELFLOW_README.md) for full documentation
2. ✅ Check [API.md](./API.md) for API reference
3. ✅ Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. ✅ Explore the code and customize
5. ✅ Start building features

---

## 🎯 Common Development Tasks

### Add Sample Videos

```bash
# Create some test accounts and upload videos
# Or use the upload page to add videos manually
```

### View Logs

```bash
# Backend logs (in terminal running npm run dev)
# Frontend logs (in browser console, press F12)
```

### Reset Database

```bash
# Connect to MongoDB
mongosh

# Drop database
use reelflow
db.dropDatabase()

# Restart backend - database will be recreated
```

### Update Dependencies

```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

---

## 💡 Tips for Development

1. **Keep both servers running** in separate terminals
2. **Use browser DevTools** (F12) to debug frontend
3. **Check terminal logs** for backend errors
4. **Use MongoDB Compass** to visualize database
5. **Test on multiple browsers** (Chrome, Firefox, Safari)
6. **Test responsive design** (mobile view in DevTools)

---

## ✅ Installation Checklist

Before considering installation complete, verify:

- [ ] Node.js v18+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] `.env` file configured
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check endpoint works
- [ ] Frontend loads in browser
- [ ] Can register new user
- [ ] Can login
- [ ] Can upload video
- [ ] Can see video feed
- [ ] Can like videos

---

## 🆘 Still Having Issues?

1. **Check error messages** carefully
2. **Review this guide** from the start
3. **Verify all prerequisites** are installed
4. **Check file permissions** (especially uploads folder)
5. **Restart everything** (MongoDB, backend, frontend)
6. **Check firewall/antivirus** settings
7. **Try a different port** if conflicts exist

---

## 📞 Getting Help

- Check documentation files
- Review error messages
- Check GitHub issues
- Create new issue with:
  - Error message
  - Steps to reproduce
  - Your environment (OS, Node version, etc.)

---

**Congratulations! 🎉**

If you've completed all steps successfully, your ReelFlow application is now running!

Open `http://localhost:3000` and start exploring! 🚀

---

*Installation Guide - Last Updated: January 2024*
