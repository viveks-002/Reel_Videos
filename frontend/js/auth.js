/**
 * Authentication and Route Protection Module
 */

import { CONFIG, isAuthenticated, removeToken, getCurrentUser } from './config.js';

/**
 * Protect route - redirect to login if not authenticated
 */
export const protectRoute = () => {
    if (!isAuthenticated()) {
        window.location.href = CONFIG.ROUTES.LOGIN;
        return false;
    }
    return true;
};

/**
 * Redirect if already authenticated (for login/signup pages)
 */
export const redirectIfAuthenticated = () => {
    if (isAuthenticated()) {
        window.location.href = CONFIG.ROUTES.FEED;
        return true;
    }
    return false;
};

/**
 * Logout user
 */
export const logout = () => {
    removeToken();
    window.location.href = CONFIG.ROUTES.LANDING;
};

/**
 * Show user info in navigation
 */
export const updateNavWithUser = () => {
    const user = getCurrentUser();
    if (!user) return;

    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span class="text-white font-bold">${user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div class="hidden md:block">
                    <div class="text-white font-semibold">${user.username}</div>
                </div>
            </div>
        `;
    }
};

/**
 * Initialize auth state on page load
 */
export const initAuth = () => {
    updateNavWithUser();

    // Add logout button listeners
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
};
