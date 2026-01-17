# 🎥 Reelify - TikTok-Style Video Platform

A modern, production-ready short video sharing platform built with vanilla JavaScript, Node.js, Express, and MongoDB. Features TikTok-like vertical video scrolling, autoplay, likes, and user authentication.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

## ✨ Features

### User Features
- 🔐 **User Authentication** - JWT-based secure authentication
- 📱 **Mobile-First Design** - Responsive design optimized for mobile
- 🎬 **Video Upload** - Upload videos up to 50MB and 60 seconds
- 📜 **Infinite Scroll Feed** - TikTok-style vertical video feed
- ▶️ **Auto-Play Videos** - Videos auto-play when in viewport
- ❤️ **Like/Unlike Videos** - Interactive like system
- 👤 **User Profiles** - View user information and videos
- 💬 **Video Captions** - Add captions up to 500 characters

### Technical Features
- 🎯 **Scroll Snap** - Smooth snap-to-video scrolling
- 🔄 **Lazy Loading** - Videos load as you scroll
- 🎨 **Modern UI** - Glass morphism and gradient effects
- 🚀 **Fast Performance** - Optimized video loading
- 📊 **View Counter** - Track video views
- 🔒 **Protected Routes** - Secure authenticated pages
- 📱 **PWA Ready** - Can be installed as mobile app

## 🏗️ Architecture

### Frontend
- **Pure TypeScript/JavaScript** - No frameworks, lightweight and fast
- **Tailwind CSS** - Utility-first CSS framework
- **ES6 Modules** - Modern JavaScript module system
- **Modern Design** - Glass morphism, gradients, smooth animations

### Backend
- **Node.js + Express** - RESTful API server
- **MongoDB + Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure token-based auth
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

### Database Schema

#### User Model
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique, validated),
  password: String (hashed),
  profilePicture: String,
  bio: String (max 200 chars),
  createdAt: Date
}
```

#### Video Model
```javascript
{
  videoUrl: String (required),
  thumbnailUrl: String,
  caption: String (max 500 chars),
  userId: ObjectId (ref: User),
  likes: [ObjectId] (array of user IDs),
  views: Number,
  duration: Number,
  createdAt: Date
}
```

## 📁 Project Structure

```
reelify/
│
├── backend/                    # Backend Node.js application
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection config
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── videoController.js
│   │   │   └── userController.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js        # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js      # Multer config
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── Video.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── videoRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   └── server.js          # Express app entry point
│   ├── uploads/               # Uploaded video files
│   ├── .env.example           # Environment variables template
│   ├── .gitignore
│   └── package.json
│
├── frontend/                  # Frontend web application
│   ├── pages/                 # HTML pages
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── feed.html          # Main video feed
│   │   └── upload.html
│   ├── js/                    # JavaScript modules
│   │   ├── api.js             # API client
│   │   ├── auth.js            # Auth helpers
│   │   ├── config.js          # App configuration
│   │   ├── utils.js           # Utility functions
│   │   ├── feed.js            # Feed page logic
│   │   ├── login.js           # Login handler
│   │   ├── signup.js          # Signup handler
│   │   └── upload.js          # Upload handler
│   ├── css/
│   │   └── styles.css         # Custom styles
│   ├── index.html             # Landing page
│   ├── package.json
│   └── vite.config.js
│
├── DEPLOYMENT.md              # Deployment guide
└── PROJECT_README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+) or MongoDB Atlas account
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd reelify
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI, JWT_SECRET, etc.

# Start server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Update API_URL in js/config.js if needed

# Start dev server
npm run dev
# App runs on http://localhost:5173
```

### 4. Access Application

Open browser to `http://localhost:5173`

**Test Accounts** (create via signup):
- Sign up with any email/username
- Upload videos and test features

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/reelify
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelify

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=52428800
```

### Frontend Configuration

Edit `frontend/js/config.js`:

```javascript
export const CONFIG = {
    API_URL: 'http://localhost:5000/api',
    // Update for production deployment
};
```

## 📱 Usage

### 1. Sign Up / Login
- Create account with username, email, password
- Login with email and password
- JWT token stored in localStorage

### 2. Browse Videos
- Vertical scroll through video feed
- Videos autoplay when in view
- Like/unlike videos
- View user profiles

### 3. Upload Video
- Click upload button
- Select video file (MP4, MOV, WebM)
- Max 50MB, 60 seconds
- Add optional caption
- Upload and share

### 4. Interact
- Like videos
- View video stats (likes, views)
- Browse by user

## 🎨 Design Features

### Modern UI Elements
- **Glass Morphism** - Frosted glass effect cards
- **Gradient Backgrounds** - Purple/pink gradient theme
- **Smooth Animations** - CSS transitions and transforms
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Eye-friendly dark mode
- **Modern Typography** - Inter font family

### UX Features
- **Scroll Snap** - Smooth video-to-video scrolling
- **Auto-play** - Videos play automatically
- **Infinite Scroll** - Load more as you scroll
- **Toast Notifications** - User feedback
- **Loading States** - Visual feedback
- **Error Handling** - User-friendly error messages

## 🔒 Security

### Implemented Security Measures
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ File type and size validation
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection

### Security Best Practices
- Never commit `.env` files
- Use strong JWT secrets (32+ characters)
- Rotate secrets regularly
- Use HTTPS in production
- Implement rate limiting
- Regular security updates

## 📈 Performance

### Optimization Techniques
- Lazy loading for videos
- Pagination for feed
- Video compression recommended
- CDN for static assets (recommended)
- Database indexing
- Efficient queries

### Recommended Improvements
- Use AWS S3 for video storage
- Implement video transcoding
- Add Redis caching
- Use CDN (CloudFront, Cloudflare)
- Implement progressive loading

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration
- [ ] User login/logout
- [ ] Video upload
- [ ] Video playback
- [ ] Like/unlike functionality
- [ ] Feed scrolling
- [ ] Mobile responsiveness
- [ ] Error handling

### API Testing

Use Postman or curl to test endpoints:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get feed (with token)
curl http://localhost:5000/api/videos/feed \
  -H "Authorization: Bearer <your-token>"
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Backend:**
- [Render.com](https://render.com) (Recommended, free tier)
- [Railway.app](https://railway.app)
- [Heroku](https://heroku.com)

**Frontend:**
- [Vercel](https://vercel.com) (Recommended, free tier)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)

**Database:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)

## 🐛 Troubleshooting

### Common Issues

**1. Videos not uploading**
- Check file size < 50MB
- Verify supported format (MP4, MOV, WebM)
- Check backend `uploads` directory permissions

**2. CORS errors**
- Verify `CLIENT_URL` in backend `.env`
- Check frontend `API_URL` in `config.js`

**3. Authentication errors**
- Clear localStorage and login again
- Verify JWT_SECRET is set
- Check token expiration

**4. Videos not playing**
- Check video file exists
- Verify video URL is correct
- Test video file directly

## 📝 API Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete API documentation.

### Key Endpoints

```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user
POST   /api/videos/upload       - Upload video (auth required)
GET    /api/videos/feed         - Get video feed (auth required)
POST   /api/videos/:id/like     - Toggle like (auth required)
GET    /api/users/:id           - Get user profile
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- TikTok for UI/UX inspiration
- Open source community
- Font Awesome for icons
- Tailwind CSS for styling

## 📞 Support

For support, email [support@reelify.com](mailto:support@reelify.com) or open an issue.

## 🗺️ Roadmap

### Version 1.1
- [ ] Comments on videos
- [ ] Share functionality
- [ ] User following system
- [ ] Notifications
- [ ] Search functionality

### Version 1.2
- [ ] Video filters and effects
- [ ] Direct messaging
- [ ] Hashtags and trending
- [ ] Analytics dashboard
- [ ] Multiple video qualities

### Version 2.0
- [ ] Live streaming
- [ ] Stories feature
- [ ] Monetization options
- [ ] Admin dashboard
- [ ] Content moderation tools

---

**Built with ❤️ by the Reelify Team**

*Happy Creating! 🎥*
