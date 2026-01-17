# ⚡ Quick Reference Card - ReelFlow

## 🚀 Start Commands

```bash
# Backend
cd backend
npm run dev        # Start server (port 5000)
npm run seed       # Add test data

# Frontend
cd frontend
npm run dev        # Start dev server (port 5173)
```

## 🔗 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## 🔑 Test Credentials (After Seeding)

```
Email: alice_creator@example.com
Password: password123
```

## 📋 API Endpoints

```
POST   /api/auth/register         Register user
POST   /api/auth/login            Login
GET    /api/auth/me               Get current user

POST   /api/videos/upload         Upload video
GET    /api/videos/feed           Get videos
POST   /api/videos/:id/like       Like video

GET    /api/users/:id             Get user profile
```

## 🗂️ File Structure

```
backend/
├── src/
│   ├── controllers/    # Business logic
│   ├── models/         # DB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & upload
│   └── server.js       # Entry point
└── .env               # Config ✅

frontend/
├── pages/             # HTML pages
├── js/                # JavaScript
└── index.html         # Landing page
```

## 🔧 Environment Variables

```bash
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reelflow
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

## 📦 Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT auth
- multer - File upload
- cors - CORS handling

### Frontend
- vite - Build tool
- typescript - Type safety
- tailwindcss - Styling

## 🎯 Key Features

✅ JWT Authentication
✅ Video Upload (50MB, 60s max)
✅ TikTok-style Feed
✅ Auto-play on Scroll
✅ Like System
✅ Infinite Scroll
✅ Responsive Design

## 🐛 Common Issues

**MongoDB not running**
```bash
# Ubuntu
sudo systemctl start mongodb

# macOS
brew services start mongodb-community
```

**Port already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Cannot find module**
```bash
cd backend && npm install
cd frontend && npm install
```

## 📚 Documentation

- START_HERE.md - Getting started
- COMPLETE_SETUP_GUIDE.md - Full guide
- DEPLOYMENT.md - Deploy instructions

## 💡 Tips

1. Run seed script for test data
2. Check browser console for errors
3. Use MongoDB Atlas for cloud DB
4. Test API with curl or Postman
5. Keep backend running while developing

---

**Need help? Check START_HERE.md**
