# 🏗️ Reelify - System Architecture

This document provides a visual and detailed overview of the Reelify application architecture.

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  Landing   │  │   Login/   │  │   Video    │           │
│  │    Page    │  │   Signup   │  │    Feed    │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Upload   │  │  Profile   │  │   Utils    │           │
│  │    Page    │  │    Page    │  │  Modules   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│                   JavaScript Modules                         │
│  ┌───────────────────────────────────────────┐             │
│  │  api.js  │  auth.js  │  utils.js          │             │
│  │  config.js  │  feed.js  │  upload.js      │             │
│  └───────────────────────────────────────────┘             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS + JWT
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    API SERVER (Express.js)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     Routes                           │   │
│  │  /api/auth  │  /api/videos  │  /api/users          │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Controllers                        │   │
│  │  authController │ videoController │ userController  │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Middleware                         │   │
│  │  auth.js  │  upload.js  │  errorHandler.js          │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     Models                           │   │
│  │      User Model  │  Video Model                     │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   DATABASE (MongoDB)                         │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  users           │         │  videos          │         │
│  │  Collection      │         │  Collection      │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   FILE STORAGE (Local/S3)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Uploaded Video Files                     │   │
│  │     /uploads/video1.mp4  |  /uploads/video2.mp4     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### 1. User Registration Flow

```
User fills signup form
       │
       ▼
Frontend validates input
       │
       ▼
POST /api/auth/register
       │
       ▼
authController.register()
       │
       ├──► Validate user data
       ├──► Check if user exists
       ├──► Hash password (bcrypt)
       ├──► Save to database
       └──► Generate JWT token
       │
       ▼
Return token + user data
       │
       ▼
Store token in localStorage
       │
       ▼
Redirect to feed
```

### 2. Video Upload Flow

```
User selects video file
       │
       ▼
Frontend validates file
  (size, format, duration)
       │
       ▼
Create FormData with video + caption
       │
       ▼
POST /api/videos/upload
  (with JWT token)
       │
       ▼
auth middleware verifies token
       │
       ▼
multer middleware processes file
       │
       ▼
videoController.uploadVideo()
       │
       ├──► Save file to /uploads
       ├──► Create video record in DB
       └──► Return video object
       │
       ▼
Update UI and redirect
```

### 3. Video Feed Flow

```
User navigates to feed
       │
       ▼
GET /api/videos/feed?page=1&limit=10
  (with JWT token)
       │
       ▼
auth middleware verifies token
       │
       ▼
videoController.getFeed()
       │
       ├──► Query videos from DB
       ├──► Populate user data
       ├──► Apply pagination
       └──► Return video array
       │
       ▼
Render videos in feed
       │
       ▼
Setup Intersection Observer
       │
       ▼
Auto-play visible videos
       │
       ▼
On scroll near bottom:
  Fetch next page
```

### 4. Like Video Flow

```
User clicks like button
       │
       ▼
POST /api/videos/:id/like
  (with JWT token)
       │
       ▼
auth middleware verifies token
       │
       ▼
videoController.toggleLike()
       │
       ├──► Find video by ID
       ├──► Check if already liked
       ├──► Add/Remove user from likes array
       ├──► Save updated video
       └──► Return new like status
       │
       ▼
Update UI with new like count
  and button state
```

---

## 🔐 Authentication Architecture

```
┌────────────────────────────────────────────────────────┐
│                  Authentication Flow                    │
└────────────────────────────────────────────────────────┘

Registration:
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Client    │─────▶│   Backend    │─────▶│  Database  │
│             │      │              │      │            │
│ 1. Submit   │      │ 2. Hash pwd  │      │ 3. Store   │
│    form     │      │    (bcrypt)  │      │    user    │
│             │      │              │      │            │
│             │◀─────│ 4. Generate  │◀─────│            │
│             │      │    JWT token │      │            │
│ 5. Store    │      │              │      │            │
│    token    │      │              │      │            │
└─────────────┘      └──────────────┘      └────────────┘

Login:
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Client    │─────▶│   Backend    │─────▶│  Database  │
│             │      │              │      │            │
│ 1. Submit   │      │ 2. Find user │      │ 3. Return  │
│    email +  │      │    by email  │      │    user    │
│    password │      │              │      │            │
│             │      │ 4. Compare   │      │            │
│             │      │    passwords │      │            │
│             │      │    (bcrypt)  │      │            │
│             │◀─────│ 5. Generate  │      │            │
│             │      │    JWT token │      │            │
│ 6. Store    │      │              │      │            │
│    token    │      │              │      │            │
└─────────────┘      └──────────────┘      └────────────┘

Protected Request:
┌─────────────┐      ┌──────────────┐
│   Client    │─────▶│   Backend    │
│             │      │              │
│ 1. Send     │      │ 2. Extract   │
│    request  │      │    token     │
│    with     │      │              │
│    Bearer   │      │ 3. Verify    │
│    token    │      │    token     │
│             │      │    (JWT)     │
│             │◀─────│              │
│ 5. Receive  │      │ 4. Process   │
│    response │      │    request   │
└─────────────┘      └──────────────┘
```

---

## 📦 Data Models

### User Model Schema

```javascript
User {
  _id: ObjectId (auto)
  username: String (unique, 3-30 chars)
  email: String (unique, validated)
  password: String (hashed, not returned)
  profilePicture: String (URL, optional)
  bio: String (max 200 chars, optional)
  createdAt: Date (auto)
}

Relationships:
  User ─── has many ───▶ Video
```

### Video Model Schema

```javascript
Video {
  _id: ObjectId (auto)
  videoUrl: String (required, file path)
  thumbnailUrl: String (optional)
  caption: String (max 500 chars, optional)
  userId: ObjectId (ref: User, required)
  likes: [ObjectId] (array of User IDs)
  views: Number (default: 0)
  duration: Number (seconds)
  createdAt: Date (auto)
}

Relationships:
  Video ─── belongs to ───▶ User
  Video ─── liked by ───▶ User (many)

Virtuals:
  likeCount: likes.length

Indexes:
  { userId: 1, createdAt: -1 }  // User's videos
  { createdAt: -1 }              // Recent videos
```

---

## 🎯 Frontend Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Frontend Structure                  │
└──────────────────────────────────────────────────────┘

Pages (HTML)
├── index.html (Landing)
├── pages/
│   ├── login.html (Authentication)
│   ├── signup.html (Registration)
│   ├── feed.html (Video Feed)
│   └── upload.html (Upload Video)

JavaScript Modules
├── config.js (Configuration)
│   ├── API_URL
│   ├── Storage keys
│   └── Constants
├── api.js (API Client)
│   ├── authAPI
│   ├── videoAPI
│   └── userAPI
├── auth.js (Auth Helpers)
│   ├── protectRoute()
│   ├── redirectIfAuthenticated()
│   └── logout()
├── utils.js (Utilities)
│   ├── showToast()
│   ├── formatNumber()
│   └── validateVideo()
└── Page Controllers
    ├── login.js
    ├── signup.js
    ├── feed.js
    └── upload.js

Styling
├── Tailwind CSS (Utility classes)
└── styles.css (Custom styles)
    ├── Animations
    ├── Glass morphism
    └── Video container
```

---

## 🔌 API Endpoint Architecture

```
┌─────────────────────────────────────────────────────┐
│                    API Endpoints                     │
└─────────────────────────────────────────────────────┘

/api/auth
  ├── POST   /register
  │     Input:  { username, email, password }
  │     Output: { token, user }
  │     Auth:   No
  │
  ├── POST   /login
  │     Input:  { email, password }
  │     Output: { token, user }
  │     Auth:   No
  │
  └── GET    /me
        Input:  -
        Output: { user }
        Auth:   Yes (JWT)

/api/videos
  ├── POST   /upload
  │     Input:  FormData { video, caption }
  │     Output: { video }
  │     Auth:   Yes (JWT)
  │
  ├── GET    /feed
  │     Query:  ?page=1&limit=10
  │     Output: { videos[], pagination }
  │     Auth:   Yes (JWT)
  │
  ├── GET    /:id
  │     Input:  Video ID (param)
  │     Output: { video }
  │     Auth:   No
  │
  ├── POST   /:id/like
  │     Input:  Video ID (param)
  │     Output: { liked, likes }
  │     Auth:   Yes (JWT)
  │
  └── DELETE /:id
        Input:  Video ID (param)
        Output: { success }
        Auth:   Yes (JWT, owner)

/api/users
  ├── GET    /:id
  │     Input:  User ID (param)
  │     Output: { user }
  │     Auth:   No
  │
  └── PUT    /me
        Input:  { bio, profilePicture }
        Output: { user }
        Auth:   Yes (JWT)
```

---

## 🎬 Video Player Architecture

```
┌──────────────────────────────────────────────────────┐
│              Video Feed Architecture                  │
└──────────────────────────────────────────────────────┘

Feed Container
  │
  ├── Scroll Container
  │     (scroll-snap-type: y mandatory)
  │     (overflow-y: scroll)
  │     (height: 100vh)
  │
  └── Video Items (snap points)
        │
        ├── Video Player
        │     ├── video element
        │     ├── playsinline
        │     ├── loop
        │     └── controls
        │
        ├── Video Overlay
        │     └── gradient (bottom to top)
        │
        ├── Video Info
        │     ├── User avatar
        │     ├── Username
        │     ├── Caption
        │     └── Stats (views, date)
        │
        └── Action Buttons
              ├── Like button
              └── Like count

Intersection Observer
  │
  ├── Options
  │     ├── root: feedContainer
  │     └── threshold: 0.7 (70% visible)
  │
  └── Callback
        ├── If intersecting: play video
        └── If not: pause video

Infinite Scroll
  │
  ├── Listen to scroll event
  │
  ├── Check if near bottom
  │     (scrollHeight - scrollTop - clientHeight < 1000)
  │
  └── Fetch next page of videos
```

---

## 🗄️ State Management

```
┌──────────────────────────────────────────────────────┐
│                 State Management                      │
└──────────────────────────────────────────────────────┘

Client-Side State
  │
  ├── localStorage
  │     ├── reelify_token (JWT token)
  │     └── reelify_user (User object)
  │
  ├── Page-Level State (feed.js)
  │     ├── videos: []
  │     ├── currentPage: 1
  │     ├── isLoading: false
  │     ├── hasMore: true
  │     └── currentVideoIndex: 0
  │
  └── Session State
        ├── Authentication status
        ├── Current user info
        └── Active video ID

Server-Side State
  │
  ├── Database
  │     ├── User documents
  │     └── Video documents
  │
  └── File System
        └── Uploaded video files
```

---

## 🔧 Middleware Pipeline

```
┌──────────────────────────────────────────────────────┐
│               Middleware Architecture                 │
└──────────────────────────────────────────────────────┘

Request → Middleware Chain → Controller → Response

1. CORS Middleware
     ├── Check origin
     └── Set CORS headers

2. Body Parser
     ├── Parse JSON
     └── Parse URL-encoded

3. Auth Middleware (protected routes)
     ├── Extract token from header
     ├── Verify JWT token
     ├── Attach user to request
     └── Continue or reject

4. Upload Middleware (video upload)
     ├── Configure storage
     ├── Set file limits
     ├── Filter file types
     └── Save file to disk

5. Error Handler (last)
     ├── Catch all errors
     ├── Format error response
     └── Send to client
```

---

## 📱 Responsive Design

```
┌──────────────────────────────────────────────────────┐
│              Responsive Breakpoints                   │
└──────────────────────────────────────────────────────┘

Mobile First Approach

Mobile (< 640px)
  ├── Full-width video container
  ├── Stacked navigation
  ├── Single column layout
  └── Touch-optimized buttons

Tablet (640px - 1024px)
  ├── Adjusted padding
  ├── 2-column layouts (where applicable)
  └── Larger touch targets

Desktop (> 1024px)
  ├── Max-width containers
  ├── Multi-column layouts
  ├── Hover effects
  └── Keyboard navigation

Tailwind Breakpoints Used:
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
```

---

## 🔄 Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│              Production Architecture                  │
└──────────────────────────────────────────────────────┘

                    Users
                      │
                      ▼
                    DNS
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   Frontend CDN              API Server
  (Vercel/Netlify)       (Render/Railway)
   (Static Assets)        (Express.js)
        │                           │
        │                           ▼
        │                      MongoDB Atlas
        │                     (Cloud Database)
        │                           │
        └───────────┬───────────────┘
                    │
                    ▼
              File Storage
           (Local or AWS S3)
```

### Production Stack

**Frontend Hosting:**
- Vercel or Netlify
- Global CDN
- Automatic HTTPS
- Continuous deployment

**Backend Hosting:**
- Render or Railway
- Automatic scaling
- Environment variables
- Logging and monitoring

**Database:**
- MongoDB Atlas
- Managed service
- Automatic backups
- Global clusters

**File Storage:**
- Local storage (development)
- AWS S3 (recommended for production)
- CloudFront CDN (optional)

---

## 🎯 Performance Optimizations

```
┌──────────────────────────────────────────────────────┐
│            Performance Optimizations                  │
└──────────────────────────────────────────────────────┘

Frontend
  ├── Lazy loading videos
  ├── Intersection Observer
  ├── Debounced scroll events
  ├── CSS animations (hardware accelerated)
  ├── Minified assets
  └── CDN delivery

Backend
  ├── Database indexing
  │     ├── userId + createdAt
  │     └── createdAt
  ├── Pagination (limit queries)
  ├── Select specific fields only
  ├── Compression middleware
  └── Caching headers

Database
  ├── Compound indexes
  ├── Query optimization
  └── Connection pooling

Videos
  ├── File size limits
  ├── Duration limits
  ├── Preload metadata only
  └── Progressive loading
```

---

## 🛡️ Security Architecture

```
┌──────────────────────────────────────────────────────┐
│              Security Layers                          │
└──────────────────────────────────────────────────────┘

1. Input Validation
     ├── Client-side validation
     ├── Server-side validation
     ├── File type checking
     └── Size limits

2. Authentication
     ├── Password hashing (bcrypt)
     ├── JWT tokens
     ├── Token expiration
     └── Secure token storage

3. Authorization
     ├── Protected routes
     ├── User ownership checks
     └── Role-based access

4. Data Protection
     ├── Password not returned in responses
     ├── Sensitive data excluded
     └── CORS configuration

5. Network Security
     ├── HTTPS (production)
     ├── Secure headers
     └── Rate limiting (recommended)
```

---

This architecture provides a scalable, maintainable, and secure foundation for a TikTok-like video platform.
