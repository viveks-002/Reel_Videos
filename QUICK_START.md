# ReelFlow Quick Start Guide

Get your TikTok-like video platform running in 5 minutes!

## 🚀 Quick Setup

### Prerequisites
- Node.js v18+ installed
- MongoDB installed (or MongoDB Atlas account)
- Git

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd reelflow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment (1 minute)

#### Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reelflow
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=52428800
```

### Step 3: Start MongoDB (30 seconds)

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Use your Atlas connection string in `MONGODB_URI`

### Step 4: Start Servers (1 minute)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open App! 🎉

Open your browser to: `http://localhost:3000`

---

## 📱 First Steps in the App

1. **Sign Up** - Create your account
2. **Upload** - Share your first video
3. **Scroll** - Discover amazing content
4. **Like** - Show some love ❤️

---

## 🎬 Testing the App

### Create Test Account
```
Username: testuser
Email: test@example.com
Password: test123
```

### Upload Test Video
- Use any short MP4 video (max 60 seconds)
- Add a fun caption
- Click upload

### Test Features
- ✅ Vertical scroll (mouse wheel or swipe)
- ✅ Auto-play when video is visible
- ✅ Like/unlike videos
- ✅ View counts
- ✅ Keyboard navigation (↑ ↓ arrows)

---

## 🛠 Common Commands

### Backend Commands
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Check if backend is running
curl http://localhost:5000/api/health
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
reelflow/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & validation
│   │   └── server.js          # App entry point
│   └── uploads/               # Uploaded videos
│
└── frontend/                  # Vanilla TypeScript frontend
    ├── js/                    # TypeScript modules
    │   ├── api.ts            # API service
    │   ├── auth.ts           # Auth logic
    │   ├── feed.ts           # Video feed
    │   └── upload.ts         # Upload logic
    └── pages/                # HTML pages
        ├── feed.html         # Main feed
        ├── login.html        # Login
        ├── signup.html       # Sign up
        └── upload.html       # Upload
```

---

## 🔧 Configuration

### Backend Ports
- Default: `5000`
- Change in: `backend/.env` → `PORT`

### Frontend Ports
- Default: `3000`
- Change in: `frontend/vite.config.js` → `server.port`

### API URL
- Update in: `frontend/js/config.ts` → `API_BASE_URL`

### File Upload Limits
- Max size: 50MB (default)
- Change in: `backend/.env` → `MAX_FILE_SIZE`

---

## ❌ Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh

# Check port 5000 is available
lsof -ti:5000

# Kill process on port 5000 if needed
kill -9 $(lsof -ti:5000)
```

### Frontend won't start
```bash
# Check port 3000 is available
lsof -ti:3000

# Kill process on port 3000 if needed
kill -9 $(lsof -ti:3000)
```

### CORS Errors
Make sure `CLIENT_URL` in `backend/.env` matches your frontend URL:
```env
CLIENT_URL=http://localhost:3000
```

### Videos won't upload
```bash
# Check uploads directory exists
mkdir -p backend/uploads

# Check permissions
chmod 755 backend/uploads
```

### MongoDB connection fails
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in backend/.env
```

---

## 🚢 Deploy to Production

Quick deploy checklist:

1. **Set up MongoDB Atlas** (free tier)
2. **Deploy Backend** to Render/Railway/Heroku
3. **Deploy Frontend** to Vercel/Netlify
4. **Update environment variables**
5. **Test everything!**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

- [Full README](./REELFLOW_README.md) - Complete documentation
- [API Docs](./API.md) - All API endpoints
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment

---

## 🎯 Features

✨ **Core Features**
- TikTok-style vertical scrolling
- Video upload & sharing
- Like & engagement
- Infinite scroll
- Mobile-first responsive
- JWT authentication

⚡ **Technical Features**
- Scroll snap
- Auto-play/pause
- View tracking
- Pagination
- Modern glassmorphism UI

---

## 🔐 Security Notes

**For Development:**
- Default JWT secret is insecure
- All IPs allowed for MongoDB

**For Production:**
- Generate strong JWT secret (32+ characters)
- Restrict MongoDB IP whitelist
- Use HTTPS everywhere
- Enable rate limiting
- Scan uploaded files

---

## 🎨 Tech Stack

**Frontend:** TypeScript + Tailwind CSS + Vite
**Backend:** Node.js + Express.js + MongoDB
**Auth:** JWT + Bcrypt
**Upload:** Multer

---

## 💡 Tips

### Best Video Format
- **Format:** MP4 (H.264)
- **Resolution:** 1080x1920 (9:16)
- **Duration:** 15-60 seconds
- **Size:** Under 50MB

### Development Workflow
1. Make changes to code
2. Backend auto-reloads (nodemon)
3. Frontend hot-reloads (Vite)
4. Test in browser
5. Commit changes

### Performance Tips
- Use Chrome DevTools for debugging
- Check Network tab for API calls
- Monitor Console for errors
- Test on mobile devices

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

---

## 📞 Support

**Issues?**
- Check documentation
- Review error messages
- Check GitHub issues
- Create new issue

**Questions?**
- Check API documentation
- Review code comments
- Ask on GitHub discussions

---

## 🌟 What's Next?

After getting it running, consider adding:

- [ ] User profiles with avatar
- [ ] Comments on videos
- [ ] Follow/unfollow users
- [ ] Video categories/tags
- [ ] Search functionality
- [ ] Notifications
- [ ] Share to social media
- [ ] Video analytics
- [ ] Admin dashboard
- [ ] Content moderation

---

## 📝 License

MIT License - feel free to use for learning and projects!

---

## 🎉 You're Ready!

Your TikTok-like video platform is now running!

**Next Steps:**
1. Create your first account
2. Upload a test video
3. Try all the features
4. Customize the theme
5. Deploy to production
6. Share with friends!

**Happy coding! 🚀**

---

**Need help?** Check the full documentation or open an issue on GitHub.

**Want to deploy?** Follow the [Deployment Guide](./DEPLOYMENT.md).

**API Reference?** See [API Documentation](./API.md).
