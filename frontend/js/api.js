/**
 * API Client Module
 * Handles all HTTP requests to the backend
 */

import { CONFIG, getToken } from './config.js';

/**
 * Base fetch wrapper with authentication
 */
const apiFetch = async (endpoint, options = {}) => {
    const url = `${CONFIG.API_URL}${endpoint}`;
    const token = getToken();

    const config = {
        ...options,
        headers: {
            ...options.headers,
        },
    };

    // Add auth token if available
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add Content-Type for JSON requests
    if (options.body && !(options.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        //alert(data.data.user.username);
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

/**
 * Authentication API
 */
export const authAPI = {
    /**
     * Register new user
     */
    register: async (userData) => {
        return await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        const info =  await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        // data is object containing response info
        return info
    },

    /**
     * Get current user profile
     */
    getMe: async () => {
        return await apiFetch('/auth/me');
    },
};

/**
 * Video API
 */
export const videoAPI = {
    /**
     * Upload new video
     */
    upload: async (formData, onProgress) => {
        const url = `${CONFIG.API_URL}/videos/upload`;
        const token = getToken();

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.message || 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', url);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    },

    /**
     * Get video feed with pagination
     */
    getFeed: async (page = 1, limit = CONFIG.FEED.PAGE_SIZE) => {
        return await apiFetch(`/videos/feed?page=${page}&limit=${limit}`);
    },

    /**
     * Get single video by ID
     */
    getVideo: async (videoId) => {
        return await apiFetch(`/videos/${videoId}`);
    },

    /**
     * Toggle like on video
     */
    toggleLike: async (videoId) => {
        return await apiFetch(`/videos/${videoId}/like`, {
            method: 'POST',
        });
    },

    /**
     * Get user's videos
     */
    getUserVideos: async (userId) => {
        return await apiFetch(`/videos/user/${userId}`);
    },
};

/**
 * User API
 */
export const userAPI = {
    /**
     * Get user profile by ID
     */
    getProfile: async (userId) => {
        return await apiFetch(`/users/${userId}`);
    },

    /**
     * Update user profile
     */
    updateProfile: async (profileData) => {
        return await apiFetch('/users/me', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },
};
