/**
 * Utility functions
 */

import { STORAGE_KEYS } from './config.js';

/**
 * Get auth token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Set auth token in localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Remove auth token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set current user in localStorage
 */
export const setCurrentUser = (user: any): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Redirect to login if not authenticated
 */
export const requireAuth = (): void => {
  if (!isAuthenticated()) {
    window.location.href = '/pages/login.html';
  }
};

/**
 * Redirect to feed if already authenticated
 */
export const redirectIfAuthenticated = (): void => {
  if (isAuthenticated()) {
    window.location.href = '/pages/feed.html';
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  removeToken();
  window.location.href = '/pages/login.html';
};

/**
 * Format date to relative time
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;

  return past.toLocaleDateString();
};

/**
 * Format number with K, M notation
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get video duration
 */
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Show error message
 */
export const showError = (message: string, elementId: string = 'error-message'): void => {
  const errorEl = document.getElementById(elementId);
  const errorText = document.getElementById('error-text');

  if (errorEl && errorText) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');

    // Auto hide after 5 seconds
    setTimeout(() => {
      errorEl.classList.add('hidden');
    }, 5000);
  }
};

/**
 * Hide error message
 */
export const hideError = (elementId: string = 'error-message'): void => {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.classList.add('hidden');
  }
};

/**
 * Show success message
 */
export const showSuccess = (message: string, elementId: string = 'success-message'): void => {
  const successEl = document.getElementById(elementId);
  const successText = successEl?.querySelector('span');

  if (successEl && successText) {
    successText.textContent = message;
    successEl.classList.remove('hidden');

    // Auto hide after 3 seconds
    setTimeout(() => {
      successEl.classList.add('hidden');
    }, 3000);
  }
};
