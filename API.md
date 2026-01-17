# ReelFlow API Documentation

Complete API documentation for the ReelFlow video sharing platform.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned upon successful login or registration and should be stored securely on the client side.

---

## Authentication Endpoints

### Register New User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `username`: 3-30 characters, required
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "654a1b2c3d4e5f6789012345",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePicture": "",
      "bio": "",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Validation error or user already exists
- `500` - Server error

---

### Login User

Authenticate existing user.

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "654a1b2c3d4e5f6789012345",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePicture": "",
      "bio": "",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Missing credentials
- `401` - Invalid credentials
- `500` - Server error

---

### Get Current User

Get authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "654a1b2c3d4e5f6789012345",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePicture": "",
      "bio": "",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401` - Not authorized or invalid token
- `500` - Server error

---

## Video Endpoints

### Upload Video

Upload a new video.

**Endpoint:** `POST /api/videos/upload`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `video` (file): Video file (required)
  - Max size: 50MB
  - Formats: mp4, mov, avi, mkv, webm
- `caption` (string): Video caption (optional, max 500 characters)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "_id": "654a1b2c3d4e5f6789012346",
      "videoUrl": "/uploads/video-1234567890-123456789.mp4",
      "thumbnailUrl": "",
      "caption": "Check out this awesome video!",
      "userId": {
        "_id": "654a1b2c3d4e5f6789012345",
        "username": "johndoe",
        "profilePicture": ""
      },
      "likes": [],
      "views": 0,
      "duration": 0,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "likeCount": 0
    }
  }
}
```

**Error Responses:**
- `400` - No file uploaded or validation error
- `401` - Not authorized
- `500` - Server error

---

### Get Video Feed

Get paginated video feed.

**Endpoint:** `GET /api/videos/feed`

**Access:** Public

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Videos per page (default: 10, max: 50)

**Example:** `GET /api/videos/feed?page=1&limit=10`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "_id": "654a1b2c3d4e5f6789012346",
        "videoUrl": "/uploads/video-1234567890-123456789.mp4",
        "thumbnailUrl": "",
        "caption": "Check out this awesome video!",
        "userId": {
          "_id": "654a1b2c3d4e5f6789012345",
          "username": "johndoe",
          "profilePicture": "",
          "bio": "Content creator"
        },
        "likes": ["654a1b2c3d4e5f6789012347"],
        "views": 125,
        "duration": 30,
        "createdAt": "2024-01-15T11:00:00.000Z",
        "likeCount": 1,
        "isLiked": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

**Note:** `isLiked` field is only present if user is authenticated.

---

### Get Single Video

Get a specific video by ID.

**Endpoint:** `GET /api/videos/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "video": {
      "_id": "654a1b2c3d4e5f6789012346",
      "videoUrl": "/uploads/video-1234567890-123456789.mp4",
      "thumbnailUrl": "",
      "caption": "Check out this awesome video!",
      "userId": {
        "_id": "654a1b2c3d4e5f6789012345",
        "username": "johndoe",
        "profilePicture": "",
        "bio": "Content creator"
      },
      "likes": ["654a1b2c3d4e5f6789012347"],
      "views": 126,
      "duration": 30,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "likeCount": 1
    }
  }
}
```

**Error Responses:**
- `404` - Video not found
- `500` - Server error

---

### Toggle Like on Video

Like or unlike a video.

**Endpoint:** `POST /api/videos/:id/like`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Video liked successfully",
  "data": {
    "isLiked": true,
    "likeCount": 2
  }
}
```

**Note:** If video is already liked, it will be unliked, and `message` will be "Video unliked successfully".

**Error Responses:**
- `401` - Not authorized
- `404` - Video not found
- `500` - Server error

---

### Get User's Videos

Get all videos uploaded by a specific user.

**Endpoint:** `GET /api/videos/user/:userId`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "_id": "654a1b2c3d4e5f6789012346",
        "videoUrl": "/uploads/video-1234567890-123456789.mp4",
        "thumbnailUrl": "",
        "caption": "Check out this awesome video!",
        "userId": {
          "_id": "654a1b2c3d4e5f6789012345",
          "username": "johndoe",
          "profilePicture": ""
        },
        "likes": [],
        "views": 125,
        "duration": 30,
        "createdAt": "2024-01-15T11:00:00.000Z",
        "likeCount": 0
      }
    ]
  }
}
```

---

### Delete Video

Delete a video (only owner can delete).

**Endpoint:** `DELETE /api/videos/:id`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

**Error Responses:**
- `401` - Not authorized
- `403` - Not authorized to delete this video
- `404` - Video not found
- `500` - Server error

---

## User Endpoints

### Get User Profile

Get public profile information for a user.

**Endpoint:** `GET /api/users/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "654a1b2c3d4e5f6789012345",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePicture": "",
      "bio": "Content creator",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "videoCount": 5
  }
}
```

**Error Responses:**
- `404` - User not found
- `500` - Server error

---

### Update User Profile

Update authenticated user's profile.

**Endpoint:** `PUT /api/users/profile`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newusername",
  "bio": "Updated bio",
  "profilePicture": "https://example.com/image.jpg"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "654a1b2c3d4e5f6789012345",
      "username": "newusername",
      "email": "john@example.com",
      "profilePicture": "https://example.com/image.jpg",
      "bio": "Updated bio",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Not authorized
- `500` - Server error

---

## Utility Endpoints

### Health Check

Check if the server is running.

**Endpoint:** `GET /api/health`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid input or validation error
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User doesn't have permission
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently, there are no rate limits implemented. For production, consider implementing:

- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Video upload**: 10 uploads per hour per user

---

## Data Models

### User Model

```typescript
{
  _id: ObjectId,
  username: string,        // 3-30 characters, unique
  email: string,           // valid email, unique
  password: string,        // hashed with bcrypt
  profilePicture: string,  // URL
  bio: string,             // max 200 characters
  createdAt: Date
}
```

### Video Model

```typescript
{
  _id: ObjectId,
  videoUrl: string,        // URL to video file
  thumbnailUrl: string,    // URL to thumbnail (optional)
  caption: string,         // max 500 characters
  userId: ObjectId,        // reference to User
  likes: ObjectId[],       // array of User IDs
  views: number,
  duration: number,        // in seconds
  createdAt: Date
}
```

---

## Best Practices

1. **Always include the Authorization header** for protected endpoints
2. **Store JWT tokens securely** (localStorage or sessionStorage)
3. **Handle token expiration** - redirect to login when token expires
4. **Validate file sizes** on client side before uploading
5. **Use pagination** for video feeds to improve performance
6. **Implement retry logic** for failed requests
7. **Show loading states** during API calls
8. **Display error messages** to users in a friendly way

---

## Example Usage (JavaScript/TypeScript)

### Register User

```typescript
const register = async (username: string, email: string, password: string) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  }

  throw new Error(data.message);
};
```

### Get Video Feed

```typescript
const getFeed = async (page: number = 1) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `http://localhost:5000/api/videos/feed?page=${page}&limit=10`,
    { headers }
  );

  const data = await response.json();
  return data.data;
};
```

### Upload Video

```typescript
const uploadVideo = async (videoFile: File, caption: string) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();

  formData.append('video', videoFile);
  formData.append('caption', caption);

  const response = await fetch('http://localhost:5000/api/videos/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.data.video;
};
```

### Toggle Like

```typescript
const toggleLike = async (videoId: string) => {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `http://localhost:5000/api/videos/${videoId}/like`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.data;
};
```

---

## Support

For issues or questions about the API, please:

1. Check this documentation first
2. Review the error message in the response
3. Check the server logs
4. Open an issue on GitHub

---

**Last Updated:** January 2024
