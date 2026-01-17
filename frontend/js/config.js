/**
 * Application Configuration
 * Centralized config for API endpoints and app settings
 */

export const CONFIG = {
    // API Base URL - Update this for production
    API_URL: 'http://localhost:5000/api',

    // Local storage keys
    STORAGE_KEYS: {
        TOKEN: 'reelify_token',
        USER: 'reelify_user',
    },

    // Video constraints
    VIDEO: {
        MAX_SIZE: 52428800, // 50MB
        MAX_DURATION: 60, // 60 seconds
        ACCEPTED_FORMATS: ['video/mp4', 'video/quicktime', 'video/webm'],
    },

    // Pagination
    FEED: {
        PAGE_SIZE: 10,
        INITIAL_LOAD: 5,
    },

    // Routes
    ROUTES: {
        LANDING: '/index.html',
        LOGIN: '/pages/login.html',
        SIGNUP: '/pages/signup.html',
        FEED: '/pages/feed.html',
        UPLOAD: '/pages/upload.html',
    },
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token
 */
export const getToken = () => {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
};

/**
 * Set authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
};

/**
 * Get current user from localStorage
 * @returns {object|null} User object
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set current user in localStorage
 * @param {object} user - User object
 */
export const setCurrentUser = (user) => {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!getToken();
};
