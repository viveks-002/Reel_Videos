/**
 * Utility Functions
 * Helper functions used across the application
 */

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
export const showToast = (message, type = 'info') => {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl slide-up max-w-md';

    // Set color based on type
    const colors = {
        success: 'bg-gradient-to-r from-green-500 to-emerald-500',
        error: 'bg-gradient-to-r from-red-500 to-pink-500',
        info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    };

    toast.className += ` ${colors[type] || colors.info}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
    };

    toast.innerHTML = `
        <div class="flex items-center gap-3 text-white">
            <i class="fas ${icons[type] || icons.info} text-xl"></i>
            <p class="font-semibold">${message}</p>
        </div>
    `;

    document.body.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

/**
 * Show loading overlay
 */
export const showLoading = () => {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
    loading.innerHTML = `
        <div class="text-center">
            <div class="loader mx-auto mb-4"></div>
            <p class="text-white font-semibold">Loading...</p>
        </div>
    `;
    document.body.appendChild(loading);
};

/**
 * Hide loading overlay
 */
export const hideLoading = () => {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
};

/**
 * Format number with K, M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
};

/**
 * Validate video file
 * @param {File} file - Video file
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validateVideo = (file) => {
    const MAX_SIZE = 52428800; // 50MB
    const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

    if (!file) {
        return { valid: false, error: 'Please select a video file' };
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Please select a valid video file (MP4, MOV, or WebM)' };
    }

    if (file.size > MAX_SIZE) {
        return { valid: false, error: 'Video size must be less than 50MB' };
    }

    return { valid: true };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get video duration
 * @param {File} file - Video file
 * @returns {Promise<number>} Duration in seconds
 */
export const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };

        video.onerror = function() {
            reject(new Error('Failed to load video metadata'));
        };

        video.src = URL.createObjectURL(file);
    });
};

/**
 * Format duration (seconds to MM:SS)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
};

/**
 * Scroll to element smoothly
 * @param {string} elementId - ID of element to scroll to
 */
export const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};
