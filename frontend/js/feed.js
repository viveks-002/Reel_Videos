/**
 * Feed Page - Video Player and Scroll Logic
 * Handles TikTok-like vertical video scrolling with autoplay
 */

import { videoAPI } from './api.js';
import { protectRoute, logout } from './auth.js';
import { getCurrentUser } from './config.js';

import { showToast, formatNumber, formatRelativeTime } from './utils.js';
import { CONFIG } from './config.js';

// Protect this route
if (!protectRoute()) {
    throw new Error('Unauthorized');
}

// State management
const state = {
    videos: [],
    currentPage: 1,
    isLoading: false,
    hasMore: true,
    currentVideoIndex: 0,
    observers: [],
};

// DOM elements
const feedContainer = document.getElementById('feed-container');
const loadingInitial = document.getElementById('loading-initial');
const videoTemplate = document.getElementById('video-template');

/**
 * Initialize the feed
 */
const init = async () => {
    console.log('Initializing feed...');

    // Set up navigation
    setupNavigation();

    // Load initial videos
    await loadVideos();

    // Set up scroll listener
    setupScrollListener();

    // Set up intersection observer
    setupIntersectionObserver();
};

/**
 * Set up navigation handlers
 */
const setupNavigation = () => {
    // Upload button
    document.getElementById('upload-btn').addEventListener('click', () => {
        window.location.href = '/pages/upload.html';// Profile ya upload pe bhejo
    });

// Profile button
// Profile button (Top Bar)
document.getElementById('profile-btn').addEventListener('click', () => {
    const user = getCurrentUser();
    if (user && user._id) {
            // Redirect to profile page with user ID
            window.location.href = `/pages/profile.html?id=${user._id}`;
        } else {
            window.location.href = '/pages/login.html';
        }
    });

    // Bottom nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = btn.dataset.page;

            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Handle navigation
            if (page === 'upload') {
                window.location.href = '/pages/upload.html';
            } else if (page === 'profile') {
                const user = getCurrentUser();
               if (user && user._id) {
                    window.location.href = `/pages/profile.html?id=${user._id}`;
                } else {
                    window.location.href = '/pages/login.html';
                }
            } else if (page === 'discover') {
                showToast('Discover page coming soon!', 'info');
            }
        });
    });
};

/**
 * Load videos from API
 */
const loadVideos = async () => {
    if (state.isLoading || !state.hasMore) return;

    state.isLoading = true;

    try {
        const response = await videoAPI.getFeed(state.currentPage, CONFIG.FEED.PAGE_SIZE);

        if (response.success) {
            const newVideos = response.data.videos;

            if (newVideos.length === 0) {
                state.hasMore = false;
                if (state.videos.length === 0) {
                    showNoVideosMessage();
                }
                return;
            }

            // Add new videos to state
            state.videos.push(...newVideos);

            // Render videos
            renderVideos(newVideos);

            // Increment page
            state.currentPage++;

            // Check if there are more videos
            if (newVideos.length < CONFIG.FEED.PAGE_SIZE) {
                state.hasMore = false;
            }
        }
    } catch (error) {
        console.error('Error loading videos:', error);
        showToast('Failed to load videos', 'error');

        if (state.videos.length === 0) {
            showErrorMessage();
        }
    } finally {
        state.isLoading = false;

        // Hide initial loading
        if (loadingInitial) {
            loadingInitial.remove();
        }
    }
};

/**
 * Render videos to DOM
 */
const renderVideos = (videos) => {
    videos.forEach(video => {
        const videoElement = createVideoElement(video);
        feedContainer.appendChild(videoElement);
    });
};

/**
 * Create video element from template
 */
const createVideoElement = (videoData) => {
    const clone = videoTemplate.content.cloneNode(true);
    const container = clone.querySelector('.video-container');
   // User info click handler
    const userInfo = clone.querySelector('.video-info .flex');
    userInfo.style.cursor = 'pointer';
    userInfo.addEventListener('click', () => {
        window.location.href = `/pages/profile.html?id=${videoData.userId._id}`;
    });

    // Set video ID
    container.dataset.videoId = videoData._id;

    // Set video source
    const videoPlayer = clone.querySelector('.video-player');
    const videoUrl = `${CONFIG.API_URL.replace('/api', '')}/${videoData.videoUrl}`;
    videoPlayer.src = videoUrl;

    // Set user info
    const usernameInitial = clone.querySelector('.username-initial');
    const username = clone.querySelector('.username');
    usernameInitial.textContent = videoData.userId.username.charAt(0).toUpperCase();
    username.textContent = '@' + videoData.userId.username;

    // Set caption
    const caption = clone.querySelector('.caption');
    caption.textContent = videoData.caption || 'No caption';

    // Set stats
    const likeCount = clone.querySelector('.like-count');
    likeCount.textContent = formatNumber(videoData.likes?.length || 0);

    const viewsCount = clone.querySelector('.views-count');
    viewsCount.innerHTML = `<i class="fas fa-eye mr-1"></i> ${formatNumber(videoData.views || 0)} views`;

    const createdDate = clone.querySelector('.created-date');
    createdDate.textContent = formatRelativeTime(videoData.createdAt);

    // Set like button state
    const likeBtn = clone.querySelector('.like-btn');
    const currentUser = getCurrentUser();

    if (currentUser && videoData.likes?.includes(currentUser._id)) {
        likeBtn.classList.add('liked');
    }

    // Like button handler
    likeBtn.addEventListener('click', async () => {
        await handleLike(videoData._id, likeBtn, likeCount);
    });

    // Video click to play/pause
    videoPlayer.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    });

    return clone;
};

/**
 * Handle like action
 */
const handleLike = async (videoId, likeBtn, likeCountElement) => {
    try {
        const response = await videoAPI.toggleLike(videoId);

        if (response.success) {
            const { isLiked, likeCount } = response.data;

            // Update UI
            if (isLiked) {
                likeBtn.classList.add('liked');
                likeBtn.classList.add('like-animation');
            } else {
                likeBtn.classList.remove('liked');
            }

            // Update like count
            likeCountElement.textContent = formatNumber(likeCount);

            setTimeout(() => {
                likeBtn.classList.remove('like-animation');
            }, 300);
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        showToast('Failed to like video', 'error');
    }
};


/**
 * Set up intersection observer for autoplay
 */
const setupIntersectionObserver = () => {
    const options = {
        root: feedContainer,
        threshold: 0.7, // Video must be 70% visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.video-player');

            if (entry.isIntersecting) {
                // Play video when in view
                video.play().catch(err => {
                    console.log('Autoplay prevented:', err);
                    // Unmute on first interaction
                    video.muted = false;
                });
                video.muted = false; // Unmute when playing
            } else {
                // Pause video when out of view
                video.pause();
                video.currentTime = 0; // Reset to beginning
            }
        });
    }, options);

    // Observe all video containers
    const observeVideos = () => {
        const videoContainers = feedContainer.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            if (container.id !== 'loading-initial') {
                observer.observe(container);
            }
        });
    };

    // Initial observation
    setTimeout(observeVideos, 100);

    // Re-observe when new videos are added
    const mutationObserver = new MutationObserver(observeVideos);
    mutationObserver.observe(feedContainer, { childList: true });
};

/**
 * Set up scroll listener for infinite scroll
 */
const setupScrollListener = () => {
    feedContainer.addEventListener('scroll', () => {
        const scrollTop = feedContainer.scrollTop;
        const scrollHeight = feedContainer.scrollHeight;
        const clientHeight = feedContainer.clientHeight;

        // Load more videos when near bottom
        if (scrollHeight - scrollTop - clientHeight < 1000) {
            loadVideos();
        }
    });
};

/**
 * Show no videos message
 */
const showNoVideosMessage = () => {
    feedContainer.innerHTML = `
        <div class="video-container flex items-center justify-center">
            <div class="text-center px-4">
                <i class="fas fa-video-slash text-white text-6xl mb-4 opacity-50"></i>
                <h2 class="text-white text-2xl font-bold mb-2">No Videos Yet</h2>
                <p class="text-gray-400 mb-6">Be the first to upload a video!</p>
                <button
                    onclick="window.location.href='/pages/upload.html'"
                    class="gradient-primary text-white px-6 py-3 rounded-lg font-semibold btn-hover"
                >
                    <i class="fas fa-upload mr-2"></i> Upload Video
                </button>
            </div>
        </div>
    `;
};

/**
 * Show error message
 */
const showErrorMessage = () => {
    feedContainer.innerHTML = `
        <div class="video-container flex items-center justify-center">
            <div class="text-center px-4">
                <i class="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
                <h2 class="text-white text-2xl font-bold mb-2">Failed to Load Videos</h2>
                <p class="text-gray-400 mb-6">Please check your connection and try again</p>
                <button
                    onclick="location.reload()"
                    class="gradient-primary text-white px-6 py-3 rounded-lg font-semibold btn-hover"
                >
                    <i class="fas fa-redo mr-2"></i> Retry
                </button>
            </div>
        </div>
    `;
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
