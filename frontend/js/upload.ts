/**
 * Video upload page logic
 */

import { videoAPI } from './api.js';
import {
  requireAuth,
  showError,
  hideError,
  showSuccess,
  formatFileSize,
  getVideoDuration,
} from './utils.js';
import { VIDEO_SETTINGS } from './config.js';

// Require authentication
requireAuth();

// DOM elements
const uploadForm = document.getElementById('upload-form') as HTMLFormElement;
const uploadArea = document.getElementById('upload-area') as HTMLElement;
const videoInput = document.getElementById('video-input') as HTMLInputElement;
const previewContainer = document.getElementById('preview-container') as HTMLElement;
const videoPreview = document.getElementById('video-preview') as HTMLVideoElement;
const videoInfo = document.getElementById('video-info') as HTMLElement;
const removeVideoBtn = document.getElementById('remove-video') as HTMLButtonElement;
const captionContainer = document.getElementById('caption-container') as HTMLElement;
const captionInput = document.getElementById('caption') as HTMLTextAreaElement;
const charCount = document.getElementById('char-count') as HTMLElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const btnText = document.getElementById('btn-text') as HTMLElement;
const btnLoading = document.getElementById('btn-loading') as HTMLElement;
const uploadProgress = document.getElementById('upload-progress') as HTMLElement;
const progressFill = document.getElementById('progress-fill') as HTMLElement;
const progressPercent = document.getElementById('progress-percent') as HTMLElement;

// State
let selectedFile: File | null = null;

/**
 * Handle file selection
 */
const handleFileSelect = async (file: File): Promise<void> => {
  hideError();

  // Validate file type
  const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|avi|mkv|webm)$/i)) {
    showError('Please select a valid video file (MP4, MOV, AVI, MKV, WEBM)');
    return;
  }

  // Validate file size
  if (file.size > VIDEO_SETTINGS.MAX_FILE_SIZE) {
    showError(`File size must be less than ${formatFileSize(VIDEO_SETTINGS.MAX_FILE_SIZE)}`);
    return;
  }

  try {
    // Get video duration
    const duration = await getVideoDuration(file);

    // Validate duration
    if (duration > VIDEO_SETTINGS.MAX_DURATION) {
      showError(`Video must be less than ${VIDEO_SETTINGS.MAX_DURATION} seconds`);
      return;
    }

    // Set selected file
    selectedFile = file;

    // Show preview
    const videoUrl = URL.createObjectURL(file);
    videoPreview.src = videoUrl;

    // Update UI
    uploadArea.classList.add('hidden');
    previewContainer.classList.remove('hidden');
    captionContainer.classList.remove('hidden');
    submitBtn.classList.remove('hidden');

    // Show video info
    videoInfo.textContent = `${file.name} • ${formatFileSize(file.size)} • ${Math.round(duration)}s`;
  } catch (error) {
    showError('Failed to load video. Please try another file.');
    console.error('Error loading video:', error);
  }
};

/**
 * Upload area click handler
 */
uploadArea.addEventListener('click', () => {
  videoInput.click();
});

/**
 * File input change handler
 */
videoInput.addEventListener('change', (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    handleFileSelect(file);
  }
});

/**
 * Drag and drop handlers
 */
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

  const file = e.dataTransfer?.files[0];
  if (file) {
    handleFileSelect(file);
  }
});

/**
 * Remove video handler
 */
removeVideoBtn.addEventListener('click', () => {
  selectedFile = null;
  videoPreview.src = '';
  videoInput.value = '';

  // Reset UI
  uploadArea.classList.remove('hidden');
  previewContainer.classList.add('hidden');
  captionContainer.classList.add('hidden');
  submitBtn.classList.add('hidden');
  captionInput.value = '';
  charCount.textContent = '0';
});

/**
 * Caption character count
 */
captionInput.addEventListener('input', () => {
  const length = captionInput.value.length;
  charCount.textContent = length.toString();
});

/**
 * Form submission handler
 */
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  if (!selectedFile) {
    showError('Please select a video file');
    return;
  }

  const caption = captionInput.value.trim();

  // Disable form
  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoading.classList.remove('hidden');
  uploadProgress.classList.remove('hidden');

  try {
    // Simulate upload progress (in production, use XHR for real progress)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;

      progressFill.style.width = `${progress}%`;
      progressPercent.textContent = `${Math.round(progress)}%`;
    }, 200);

    // Upload video
    const response = await videoAPI.uploadVideo(selectedFile, caption);

    // Clear progress interval
    clearInterval(progressInterval);

    // Set progress to 100%
    progressFill.style.width = '100%';
    progressPercent.textContent = '100%';

    if (response.success) {
      showSuccess('Video uploaded successfully!');

      // Reset form after 2 seconds
      setTimeout(() => {
        window.location.href = '/pages/feed.html';
      }, 2000);
    }
  } catch (error: any) {
    showError(error.message || 'Failed to upload video. Please try again.');

    // Re-enable form
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    uploadProgress.classList.add('hidden');
    progressFill.style.width = '0%';
  }
});
