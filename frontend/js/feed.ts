/**
 * Video feed page logic - TikTok-style vertical scrolling
 */

import { videoAPI } from './api.js';
import { requireAuth, formatRelativeTime, formatNumber, API_BASE_URL } from './utils.js';
import type { Video } from './types.js';

// Require authentication
requireAuth();

// State
let currentPage = 1;
let isLoading = false;
let hasMore = true;
let videos: Video[] = [];
let currentVideoIndex = 0;

// DOM elements
const feedContainer = document.getElementById('feed-container') as HTMLElement;
const loadingInitial = document.getElementById('loading-initial') as HTMLElement;
const videoTemplate = document.getElementById('video-template') as HTMLTemplateElement;

// Navigation buttons
const uploadBtn = document.getElementById('upload-btn') as HTMLButtonElement;
const navBtns = document.querySelectorAll('.nav-btn');

/**
 * Create video element from template
 */
const createVideoElement = (video: Video, index: number): HTMLElement => {
  const clone = videoTemplate.content.cloneNode(true) as DocumentFragment;
  const container = clone.querySelector('.video-container') as HTMLElement;
  const videoEl = clone.querySelector('.video-player') as HTMLVideoElement;
  const likeBtn = clone.querySelector('.like-btn') as HTMLElement;
  const likeCount = clone.querySelector('.like-count') as HTMLElement;
  const username = clone.querySelector('.username') as HTMLElement;
  const usernameInitial = clone.querySelector('.username-initial') as HTMLElement;
  const caption = clone.querySelector('.caption') as HTMLElement;
  const viewsCount = clone.querySelector('.views-count') as HTMLElement;
  const createdDate = clone.querySelector('.created-date') as HTMLElement;

  // Set video attributes
  container.dataset.videoId = video._id;
  container.dataset.index = index.toString();

  // Get video URL - handle both absolute and relative URLs
  let videoUrl = video.videoUrl;
  if (videoUrl.startsWith('/')) {
    videoUrl = `${API_BASE_URL.replace('/api', '')}${videoUrl}`;
  }
  videoEl.src = videoUrl;

  // Set user info
  const user = typeof video.userId === 'object' ? video.userId : null;
  if (user) {
    username.textContent = user.username;
    usernameInitial.textContent = user.username.charAt(0).toUpperCase();
  }

  // Set caption
  caption.textContent = video.caption || '';

  // Set stats
  likeCount.textContent = formatNumber(video.likeCount || video.likes.length);
  viewsCount.innerHTML = `<i class="fas fa-eye mr-1"></i> ${formatNumber(video.views)} views`;
  createdDate.textContent = formatRelativeTime(video.createdAt);

  // Set like button state
  if (video.isLiked) {
    likeBtn.classList.add('liked');
    likeBtn.querySelector('i')?.classList.replace('fa-heart', 'fa-heart');
  }

  // Handle like button click
  likeBtn.addEventListener('click', async () => {
    try {
      const response = await videoAPI.toggleLike(video._id);

      if (response.success) {
        // Update UI
        if (response.data.isLiked) {
          likeBtn.classList.add('liked');
        } else {
          likeBtn.classList.remove('liked');
        }
        likeCount.textContent = formatNumber(response.data.likeCount);

        // Update video data
        video.isLiked = response.data.isLiked;
        video.likeCount = response.data.likeCount;
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  });

  return container;
};

/**
 * Load videos from API
 */
const loadVideos = async (): Promise<void> => {
  if (isLoading || !hasMore) return;

  isLoading = true;

  try {
    const response = await videoAPI.getFeed(currentPage, 10);

    if (response.success) {
      const newVideos = response.data.videos;

      // Add new videos to state
      videos.push(...newVideos);

      // Remove loading indicator on first load
      if (currentPage === 1 && loadingInitial) {
        loadingInitial.remove();
      }

      // Create video elements
      newVideos.forEach((video, i) => {
        const index = videos.length - newVideos.length + i;
        const videoElement = createVideoElement(video, index);
        feedContainer.appendChild(videoElement);
      });

      // Update pagination
      hasMore = response.data.pagination.page < response.data.pagination.pages;
      currentPage++;

      // Start observing videos
      observeVideos();
    }
  } catch (error) {
    console.error('Failed to load videos:', error);
    if (loadingInitial) {
      loadingInitial.innerHTML = `
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p class="text-white text-lg">Failed to load videos</p>
          <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">
            Try Again
          </button>
        </div>
      `;
    }
  } finally {
    isLoading = false;
  }
};

/**
 * Handle video visibility and autoplay
 */
const observeVideos = (): void => {
  const observerOptions = {
    root: feedContainer,
    threshold: 0.7, // Video must be 70% visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const container = entry.target as HTMLElement;
      const video = container.querySelector('video') as HTMLVideoElement;

      if (entry.isIntersecting) {
        // Play video when visible
        video.muted = false;
        video.play().catch(() => {
          // If autoplay fails, keep muted and try again
          video.muted = true;
          video.play();
        });

        // Update current index
        const index = parseInt(container.dataset.index || '0');
        currentVideoIndex = index;

        // Load more videos when near end
        if (index >= videos.length - 3) {
          loadVideos();
        }
      } else {
        // Pause video when not visible
        video.pause();
      }
    });
  }, observerOptions);

  // Observe all video containers
  const videoContainers = feedContainer.querySelectorAll('.video-container');
  videoContainers.forEach((container) => observer.observe(container));
};

/**
 * Handle scroll events for snap scrolling
 */
let scrollTimeout: NodeJS.Timeout;
feedContainer.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    // Snap to nearest video
    const containers = Array.from(feedContainer.querySelectorAll('.video-container'));
    const scrollPosition = feedContainer.scrollTop;

    let nearestIndex = 0;
    let minDistance = Infinity;

    containers.forEach((container, index) => {
      const rect = (container as HTMLElement).getBoundingClientRect();
      const distance = Math.abs(rect.top);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    // Scroll to nearest video
    const nearestContainer = containers[nearestIndex] as HTMLElement;
    nearestContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
});

/**
 * Navigation handlers
 */
uploadBtn?.addEventListener('click', () => {
  window.location.href = '/pages/upload.html';
});

navBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const page = (btn as HTMLElement).dataset.page;

    if (page === 'upload') {
      window.location.href = '/pages/upload.html';
    } else if (page === 'profile') {
      alert('Profile page coming soon!');
    } else if (page === 'discover') {
      alert('Discover page coming soon!');
    }
  });
});

/**
 * Keyboard navigation
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
    const prevContainer = feedContainer.querySelector(
      `[data-index="${currentVideoIndex - 1}"]`
    ) as HTMLElement;
    prevContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (e.key === 'ArrowDown' && currentVideoIndex < videos.length - 1) {
    const nextContainer = feedContainer.querySelector(
      `[data-index="${currentVideoIndex + 1}"]`
    ) as HTMLElement;
    nextContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Initialize - load first batch of videos
loadVideos();
