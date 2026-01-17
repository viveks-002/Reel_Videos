/**
 * Upload Page Handler
 * Handles video upload with drag-and-drop support
 */

import { videoAPI } from './api.js';
import { protectRoute } from './auth.js';
import { showToast, validateVideo, getVideoDuration, formatFileSize, formatDuration } from './utils.js';

// Protect this route
if (!protectRoute()) {
    throw new Error('Unauthorized');
}

// DOM elements
const uploadForm = document.getElementById('upload-form');
const videoInput = document.getElementById('video-input');
const uploadArea = document.getElementById('upload-area');
const uploadPrompt = document.getElementById('upload-prompt');
const previewContainer = document.getElementById('preview-container');
const videoPreview = document.getElementById('video-preview');
const videoInfo = document.getElementById('video-info');
const removeVideoBtn = document.getElementById('remove-video');
const captionContainer = document.getElementById('caption-container');
const captionInput = document.getElementById('caption');
const charCount = document.getElementById('char-count');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');
const uploadProgress = document.getElementById('upload-progress');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const successMessage = document.getElementById('success-message');

// State
let selectedFile = null;

/**
 * Show error message
 */
const showError = (message) => {
    errorMessage.classList.remove('hidden');
    errorText.textContent = message;
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
};

/**
 * Hide error message
 */
const hideError = () => {
    errorMessage.classList.add('hidden');
};

/**
 * Show success message
 */
const showSuccess = () => {
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
};

/**
 * Handle file selection
 */
const handleFileSelect = async (file) => {
    // Validate file
    const validation = validateVideo(file);
    if (!validation.valid) {
        showError(validation.error);
        return;
    }

    // Check duration
    try {
        const duration = await getVideoDuration(file);
        if (duration > 60) {
            showError('Video must be 60 seconds or less');
            return;
        }

        // Store file
        selectedFile = file;

        // Show preview
        const url = URL.createObjectURL(file);
        videoPreview.src = url;

        // Update UI
        uploadArea.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        captionContainer.classList.remove('hidden');
        submitBtn.classList.remove('hidden');

        // Show file info
        videoInfo.textContent = `${file.name} • ${formatFileSize(file.size)} • ${formatDuration(duration)}`;

        hideError();
    } catch (error) {
        showError('Failed to load video. Please try another file.');
    }
};

/**
 * Remove selected video
 */
const removeVideo = () => {
    selectedFile = null;
    videoPreview.src = '';
    captionInput.value = '';
    charCount.textContent = '0';

    // Reset UI
    uploadArea.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    captionContainer.classList.add('hidden');
    submitBtn.classList.add('hidden');

    hideError();
};

/**
 * Handle form submission
 */
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
        showError('Please select a video file');
        return;
    }

    const caption = captionInput.value.trim();

    // Create form data
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('caption', caption);

    // Disable form
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    uploadProgress.classList.remove('hidden');

    try {
        const response = await videoAPI.upload(formData, (percent) => {
            // Update progress
            progressFill.style.width = `${percent}%`;
            progressPercent.textContent = `${Math.round(percent)}%`;
        });

        if (response.success) {
            showSuccess();
            showToast('Video uploaded successfully!', 'success');

            // Reset form after delay
            setTimeout(() => {
                window.location.href = '/pages/feed.html';
            }, 2000);
        } else {
            throw new Error(response.message || 'Upload failed');
        }
    } catch (error) {
        showError(error.message || 'Failed to upload video. Please try again.');

        // Re-enable form
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        uploadProgress.classList.add('hidden');
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
    }
};

/**
 * Set up event listeners
 */
const setupEventListeners = () => {
    // Click to upload
    uploadArea.addEventListener('click', () => {
        videoInput.click();
    });

    // File input change
    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // Remove video
    removeVideoBtn.addEventListener('click', removeVideo);

    // Caption character count
    captionInput.addEventListener('input', () => {
        charCount.textContent = captionInput.value.length;
    });

    // Form submission
    uploadForm.addEventListener('submit', handleSubmit);
};

// Initialize
setupEventListeners();
