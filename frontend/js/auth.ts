/**
 * Authentication page logic
 */

import { authAPI } from './api.js';
import {
  setToken,
  setCurrentUser,
  redirectIfAuthenticated,
  showError,
  hideError,
} from './utils.js';

// Redirect if already authenticated
redirectIfAuthenticated();

// Get form elements
const loginForm = document.getElementById('login-form') as HTMLFormElement | null;
const signupForm = document.getElementById('signup-form') as HTMLFormElement | null;

/**
 * Handle login form submission
 */
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    const btnText = document.getElementById('btn-text') as HTMLElement;
    const btnLoading = document.getElementById('btn-loading') as HTMLElement;

    // Get form data
    const formData = new FormData(loginForm);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    try {
      // Call login API
      const response = await authAPI.login(email, password);

      if (response.success) {
        // Save token and user
        setToken(response.data.token);
        setCurrentUser(response.data.user);

        // Redirect to feed
        window.location.href = '/pages/feed.html';
      }
    } catch (error: any) {
      showError(error.message || 'Login failed. Please try again.');

      // Re-enable button
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
    }
  });
}

/**
 * Handle signup form submission
 */
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    const btnText = document.getElementById('btn-text') as HTMLElement;
    const btnLoading = document.getElementById('btn-loading') as HTMLElement;

    // Get form data
    const formData = new FormData(signupForm);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate
    if (username.length < 3) {
      showError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    try {
      // Call register API
      const response = await authAPI.register(username, email, password);

      if (response.success) {
        // Save token and user
        setToken(response.data.token);
        setCurrentUser(response.data.user);

        // Redirect to feed
        window.location.href = '/pages/feed.html';
      }
    } catch (error: any) {
      showError(error.message || 'Registration failed. Please try again.');

      // Re-enable button
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
    }
  });
}
