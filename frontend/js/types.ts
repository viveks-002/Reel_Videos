/**
 * TypeScript type definitions
 */

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
}

export interface Video {
  _id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  userId: User | string;
  likes: string[];
  views: number;
  duration: number;
  createdAt: string;
  likeCount: number;
  isLiked?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface VideoResponse {
  success: boolean;
  message?: string;
  data: {
    video: Video;
  };
}

export interface FeedResponse {
  success: boolean;
  data: {
    videos: Video[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    isLiked: boolean;
    likeCount: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
}
