# ReelFlow - TikTok-like Video Sharing Platform

A production-ready, full-stack short video sharing web application inspired by TikTok. Built with TypeScript, Express.js, MongoDB, and modern web technologies.

![ReelFlow](https://img.shields.io/badge/ReelFlow-Video%20Platform-purple)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

## Features

### Core Features
- ✨ **TikTok-style vertical scrolling** - Smooth, snap-to-video scrolling experience
- 🎬 **Video upload & sharing** - Upload videos up to 60 seconds (max 50MB)
- ❤️ **Like & engage** - Like videos and see real-time like counts
- 🔄 **Infinite scroll** - Automatically loads more videos as you scroll
- 📱 **Mobile-first responsive** - Optimized for all device sizes
- 🔐 **Secure authentication** - JWT-based auth with bcrypt password hashing
- 👤 **User profiles** - Custom usernames and profiles
- ⚡ **Real-time updates** - Instant UI updates for likes and interactions

### Technical Features
- 🎯 **Scroll snap** - Smooth video-to-video transitions
- 🎥 **Auto-play/pause** - Videos play when visible, pause when not
- 📊 **View tracking** - Automatically tracks video views
- 🔍 **Pagination** - Efficient API pagination for large datasets
- 🛡️ **Input validation** - Server-side validation with express-validator
- 📁 **File upload** - Multer for handling video uploads
- 🎨 **Modern UI** - Glassmorphism design with Tailwind CSS

## Tech Stack

### Frontend
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Pure TS** - No framework dependencies (vanilla TypeScript)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## Project Structure

```
reelflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── videoController.js   # Video CRUD operations
│   │   │   └── userController.js    # User management
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   └── upload.js            # File upload config
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Video.js             # Video schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   ├── videoRoutes.js       # Video endpoints
│   │   │   └── userRoutes.js        # User endpoints
│   │   ├── utils/
│   │   │   └── generateToken.js     # JWT helper
│   │   └── server.js                # Express app entry
│   ├── uploads/                     # Uploaded videos
│   ├── .env.example                 # Environment template
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── js/
    │   ├── api.ts                   # API service layer
    │   ├── auth.ts                  # Auth page logic
    │   ├── config.ts                # App configuration
    │   ├── feed.ts                  # Video feed logic
    │   ├── types.ts                 # TypeScript types
    │   ├── upload.ts                # Upload page logic
    │   └── utils.ts                 # Utility functions
    ├── pages/
    │   ├── feed.html                # Video feed page
    │   ├── login.html               # Login page
    │   ├── signup.html              # Sign up page
    │   └── upload.html              # Upload page
    ├── index.html                   # Landing page
    ├── package.json
    ├── tsconfig.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd reelflow
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Update MongoDB URI, JWT secret, etc.
```

**Example .env configuration:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reelflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=52428800
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Update API_BASE_URL in js/config.ts if needed
```

### Running Locally

#### Start MongoDB
Make sure MongoDB is running on your system or use MongoDB Atlas.

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

#### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### First Time Setup

1. Open `http://localhost:3000` in your browser
2. Click "Sign Up" and create an account
3. Upload your first video (max 60 seconds, 50MB)
4. Start scrolling through the feed!

## API Documentation

See [API.md](./API.md) for complete API documentation.

### Quick API Overview

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

#### Videos
- `POST /api/videos/upload` - Upload video (protected)
- `GET /api/videos/feed` - Get video feed (paginated)
- `GET /api/videos/:id` - Get single video
- `POST /api/videos/:id/like` - Toggle like (protected)
- `DELETE /api/videos/:id` - Delete video (protected)
- `GET /api/videos/user/:userId` - Get user's videos

#### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)

## Deployment

### Deploy Backend

#### Render / Railway / Heroku

1. **Create new web service**
2. **Connect your repository**
3. **Set environment variables:**
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Strong random secret
   - `CLIENT_URL` - Your frontend URL
   - `NODE_ENV=production`

4. **Build & Start commands:**
   - Build: `cd backend && npm install`
   - Start: `cd backend && npm start`

#### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP or use `0.0.0.0/0` for all IPs (less secure)
5. Get connection string and add to `.env`

Example MongoDB Atlas URI:
```
mongodb+srv://username:password@cluster.mongodb.net/reelflow?retryWrites=true&w=majority
```

### Deploy Frontend

#### Vercel / Netlify

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Deploy the `dist` folder**
3. **Update `API_BASE_URL` in `frontend/js/config.ts`** to your backend URL
4. **Rebuild and redeploy**

#### Environment Variables for Production

Frontend (`js/config.ts`):
```typescript
export const API_BASE_URL = 'https://your-backend.onrender.com/api';
```

Backend (`.env`):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super_secure_random_string_here
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.vercel.app
MAX_FILE_SIZE=52428800
```

## Production Considerations

### File Storage
For production, replace local file storage with cloud storage:
- **AWS S3** - Scalable object storage
- **Cloudinary** - Video hosting with CDN
- **Google Cloud Storage** - Google's storage solution

Update `videoController.js` to save files to cloud storage instead of local disk.

### Video Processing
Consider adding:
- Video compression
- Thumbnail generation
- Multiple quality levels
- Format conversion

Libraries: **FFmpeg**, **Sharp**, or cloud services like **Cloudinary**

### Scaling
- Use Redis for caching
- Implement CDN for video delivery
- Add database indexes for performance
- Use load balancers for multiple backend instances

### Security Enhancements
- Rate limiting (express-rate-limit)
- CORS configuration
- Helmet.js for security headers
- Input sanitization
- File type validation
- Virus scanning for uploads

## Common Issues

### CORS Errors
Update `CLIENT_URL` in backend `.env` to match your frontend URL.

### Video Upload Fails
- Check `MAX_FILE_SIZE` setting
- Ensure `uploads/` directory exists and has write permissions
- Verify MongoDB connection

### Videos Don't Play
- Check video format (MP4 is most compatible)
- Ensure backend is serving static files from `/uploads`
- Check browser console for errors

### MongoDB Connection Failed
- Verify MongoDB is running
- Check connection string format
- Ensure IP is whitelisted (MongoDB Atlas)
- Check username/password

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by TikTok's user experience
- Built with modern web technologies
- Designed for learning and portfolio purposes

---

**Made with ❤️ by ReelFlow Team**

For questions or support, please open an issue on GitHub.
