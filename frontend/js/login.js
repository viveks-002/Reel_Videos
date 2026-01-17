/**
 * Login Page Handler
 */

import { authAPI } from './api.js';
import { setToken, setCurrentUser, CONFIG } from './config.js';
import { redirectIfAuthenticated } from './auth.js';
import { showToast, showLoading, hideLoading } from './utils.js';

// Redirect if already authenticated
redirectIfAuthenticated();

// DOM elements
const loginForm = document.getElementById('login-form');
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
 * Handle form submission
 */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
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
        const response = await authAPI.login({ email, password });

        if (response.success) {
            //alert('Login Response:', response.data.user.username);
            // Save token and user
            setToken(response.data.token);
            setCurrentUser(response.data.user._id);

            hideLoading();
            showToast('Login successful! Redirecting...', 'success');

            // Redirect to feed
            setTimeout(() => {
                window.location.href = CONFIG.ROUTES.FEED;
            }, 1000);
        } else {
            throw new Error(response.message || 'Login failed');
        }
    } catch (error) {
        hideLoading();
        showError(error.message || 'Invalid email or password');

        // Re-enable form
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
});

// Auto-focus email input
emailInput.focus();
