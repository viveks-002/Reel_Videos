/**
 * API service for making HTTP requests
 */

import { API_ENDPOINTS } from './config.js';
import { getToken } from './utils.js';
import type {
  AuthResponse,
  VideoResponse,
  FeedResponse,
  LikeResponse,
  ApiError,
} from './types.js';

/**
 * Base fetch wrapper with auth headers
 */
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add Content-Type for JSON requests
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

/**
 * Handle API response
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

/**
 * Auth API
 */
export const authAPI = {
  /**
   * Register new user
   */
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Get current user
   */
  getMe: async (): Promise<any> => {
    const response = await fetchWithAuth(API_ENDPOINTS.GET_ME);
    return handleResponse(response);
  },
};

/**
 * Video API
 */
export const videoAPI = {
  /**
   * Upload video
   */
  uploadVideo: async (videoFile: File, caption: string): Promise<VideoResponse> => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('caption', caption);

    const response = await fetchWithAuth(API_ENDPOINTS.UPLOAD_VIDEO, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<VideoResponse>(response);
  },

  /**
   * Get video feed
   */
  getFeed: async (page: number = 1, limit: number = 10): Promise<FeedResponse> => {
    const url = `${API_ENDPOINTS.GET_FEED}?page=${page}&limit=${limit}`;
    const response = await fetchWithAuth(url);
    return handleResponse<FeedResponse>(response);
  },

  /**
   * Get single video
   */
  getVideo: async (id: string): Promise<VideoResponse> => {
    const response = await fetchWithAuth(API_ENDPOINTS.GET_VIDEO(id));
    return handleResponse<VideoResponse>(response);
  },

  /**
   * Toggle like on video
   */
  toggleLike: async (id: string): Promise<LikeResponse> => {
    const response = await fetchWithAuth(API_ENDPOINTS.TOGGLE_LIKE(id), {
      method: 'POST',
    });
    return handleResponse<LikeResponse>(response);
  },

  /**
   * Delete video
   */
  deleteVideo: async (id: string): Promise<any> => {
    const response = await fetchWithAuth(API_ENDPOINTS.DELETE_VIDEO(id), {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  /**
   * Get user's videos
   */
  getUserVideos: async (userId: string): Promise<any> => {
    const response = await fetchWithAuth(API_ENDPOINTS.GET_USER_VIDEOS(userId));
    return handleResponse(response);
  },
};

/**
 * User API
 */
export const userAPI = {
  /**
   * Get user profile
   */
  getProfile: async (id: string): Promise<any> => {
    const response = await fetchWithAuth(API_ENDPOINTS.GET_USER_PROFILE(id));
    return handleResponse(response);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: {
    username?: string;
    bio?: string;
    profilePicture?: string;
  }): Promise<any> => {
    const response = await fetchWithAuth(API_ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
