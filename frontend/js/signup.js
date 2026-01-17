/**
 * Signup Page Handler
 */

import { authAPI } from './api.js';
import { setToken, setCurrentUser, CONFIG } from './config.js';
import { redirectIfAuthenticated } from './auth.js';
import { showToast, showLoading, hideLoading } from './utils.js';

// Redirect if already authenticated
redirectIfAuthenticated();

// DOM elements
const signupForm = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

/**
 * Show error message
 */
const showError = (message) => {
    errorMessage.classList.remove('hidden');
    errorText.textContent = message;
};

/**
 * Hide error message
 */
const hideError = () => {
    errorMessage.classList.add('hidden');
};

/**
 * Validate form inputs
 */
const validateForm = (username, email, password) => {
    if (!username || !email || !password) {
        return { valid: false, error: 'Please fill in all fields' };
    }

    if (username.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }

    if (username.length > 30) {
        return { valid: false, error: 'Username cannot exceed 30 characters' };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Please enter a valid email address' };
    }

    if (password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters' };
    }

    return { valid: true };
};

/**
 * Handle form submission
 */
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate
    const validation = validateForm(username, email, password);
    if (!validation.valid) {
        showError(validation.error);
        return;
    }

    // Hide error
    hideError();

    // Disable form
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    showLoading();

    try {
        const response = await authAPI.register({
            username,
            email,
            password,
        });

        if (response.success) {
            // Save token and user
            setToken(response.token);
            setCurrentUser(response.user);

            hideLoading();
            showToast('Account created successfully! Redirecting...', 'success');

            // Redirect to feed
            setTimeout(() => {
                window.location.href = CONFIG.ROUTES.FEED;
            }, 1000);
        } else {
            throw new Error(response.message || 'Signup failed');
        }
    } catch (error) {
        hideLoading();
        showError(error.message || 'Failed to create account. Please try again.');

        // Re-enable form
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
});

// Auto-focus username input
usernameInput.focus();
