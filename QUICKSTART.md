# 🚀 Quick Start Guide - Reelify

Get up and running in 5 minutes!

## Prerequisites
- Node.js v16+ installed
- MongoDB installed OR MongoDB Atlas account

## Step 1: Install Dependencies

```bash
# Option A: Use the setup script (Recommended)
chmod +x SETUP.sh
./SETUP.sh

# Option B: Manual installation
cd backend && npm install && cd ../frontend && npm install && cd ..
```

## Step 2: Configure Backend

1. **Create `.env` file in backend directory:**
```bash
cd backend
cp .env.example .env
```

2. **Edit `backend/.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reelify
JWT_SECRET=change_this_to_a_secure_random_string_min_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=52428800
```

**For MongoDB Atlas:**
- Sign up at mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Replace `MONGODB_URI` with your Atlas connection string

**Generate JWT Secret:**
```bash
# Use this command to generate a secure random string:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

✅ Backend running at `http://localhost:5000`

## Step 4: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

✅ Frontend running at `http://localhost:5173`

## Step 5: Use the App

1. **Open browser** to `http://localhost:5173`

2. **Sign up** for a new account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `123456`

3. **Upload a video**:
   - Click the upload button (+ icon)
   - Select a video file (MP4, MOV, WebM)
   - Add a caption
   - Click "Upload Video"

4. **Browse feed**:
   - Scroll vertically through videos
   - Videos autoplay when in view
   - Like videos with the heart button
   - View user profiles

## Troubleshooting

### MongoDB Connection Error
```bash
# If using local MongoDB, make sure it's running:
mongod

# Or update .env to use MongoDB Atlas connection string
```

### Port Already in Use
```bash
# Backend (change PORT in backend/.env)
PORT=5001

# Frontend (change port in frontend/vite.config.js)
```

### CORS Error
- Make sure `CLIENT_URL` in `backend/.env` matches your frontend URL
- Default: `http://localhost:5173`

### Videos Not Playing
- Check video file is supported format (MP4, MOV, WebM)
- Verify file size is under 50MB
- Check `backend/uploads` directory exists

## Testing the Application

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Test Video Feed (requires token)
```bash
curl http://localhost:5000/api/videos/feed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
reelify/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, upload, errors
│   │   └── server.js     # Entry point
│   ├── uploads/          # Video storage
│   └── .env              # Configuration
│
└── frontend/             # Vanilla JS + Tailwind
    ├── pages/            # HTML pages
    ├── js/               # JavaScript modules
    ├── css/              # Custom styles
    └── index.html        # Landing page
```

## Key Files

### Backend
- `backend/src/server.js` - Express server setup
- `backend/src/models/User.js` - User schema
- `backend/src/models/Video.js` - Video schema
- `backend/src/controllers/authController.js` - Auth logic
- `backend/src/controllers/videoController.js` - Video logic

### Frontend
- `frontend/index.html` - Landing page
- `frontend/pages/feed.html` - Video feed
- `frontend/pages/upload.html` - Video upload
- `frontend/js/api.js` - API client
- `frontend/js/feed.js` - Feed functionality
- `frontend/js/upload.js` - Upload functionality

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/videos/upload` | Upload video | Yes |
| GET | `/api/videos/feed` | Get video feed | Yes |
| POST | `/api/videos/:id/like` | Toggle like | Yes |
| GET | `/api/users/:id` | Get user profile | No |

## Features Checklist

- ✅ User registration and authentication
- ✅ JWT token-based security
- ✅ Video upload (drag-and-drop)
- ✅ TikTok-style vertical feed
- ✅ Auto-play videos on scroll
- ✅ Scroll-snap smooth scrolling
- ✅ Like/unlike videos
- ✅ View counter
- ✅ User profiles
- ✅ Responsive mobile design
- ✅ Modern UI with animations
- ✅ Infinite scroll

## Next Steps

### For Development
- Read [PROJECT_README.md](./PROJECT_README.md) for detailed documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Explore the code and customize as needed

### For Production
1. Set up MongoDB Atlas
2. Deploy backend to Render/Railway/Heroku
3. Deploy frontend to Vercel/Netlify
4. Update environment variables
5. Test thoroughly

## Need Help?

- 📖 Read the full [PROJECT_README.md](./PROJECT_README.md)
- 🚀 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
- 🐛 Open an issue on GitHub
- 💬 Contact support

## Common Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production

# Both
npm install          # Install all dependencies (if using workspaces)
```

## Environment Variables Quick Reference

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reelify
JWT_SECRET=your_secret_key_min_32_characters
CLIENT_URL=http://localhost:5173
```

### Frontend (js/config.js)
```javascript
API_URL: 'http://localhost:5000/api'
```

---

**That's it! You're ready to go! 🎉**

For detailed documentation, see [PROJECT_README.md](./PROJECT_README.md)

*Happy coding! 🚀*
