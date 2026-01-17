/**
 * Application configuration
 */

// API base URL - change this for production
export const API_BASE_URL = 'http://localhost:5000/api';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'reelflow_token',
  USER: 'reelflow_user',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_ME: `${API_BASE_URL}/auth/me`,

  // Videos
  UPLOAD_VIDEO: `${API_BASE_URL}/videos/upload`,
  GET_FEED: `${API_BASE_URL}/videos/feed`,
  GET_VIDEO: (id: string) => `${API_BASE_URL}/videos/${id}`,
  TOGGLE_LIKE: (id: string) => `${API_BASE_URL}/videos/${id}/like`,
  DELETE_VIDEO: (id: string) => `${API_BASE_URL}/videos/${id}`,
  GET_USER_VIDEOS: (userId: string) => `${API_BASE_URL}/videos/user/${userId}`,

  // Users
  GET_USER_PROFILE: (id: string) => `${API_BASE_URL}/users/${id}`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
} as const;

// Video settings
export const VIDEO_SETTINGS = {
  MAX_FILE_SIZE: 52428800, // 50MB in bytes
  MAX_DURATION: 60, // seconds
  FEED_PAGE_SIZE: 10,
} as const;
