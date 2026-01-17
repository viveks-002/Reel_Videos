import Video from '../models/Video.js';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload new video
 * @route   POST /api/videos/upload
 * @access  Private
 */
export const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file',
      });
    }

    const { caption } = req.body;

    // Create video URL (in production, use cloud storage URL)
    const videoUrl = `uploads/${req.file.filename}`;
    console.log('Video URL:', videoUrl);
    const video = await Video.create({
      videoUrl,
      caption: caption || '',
      userId: req.user._id,
    });

    // Populate user info
    await video.populate('userId', 'username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        video,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get video feed (paginated)
 * @route   GET /api/videos/feed
 * @access  Public
 */
export const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username profilePicture bio');

    const total = await Video.countDocuments();

    // Add isLiked flag if user is authenticated
    let enhancedVideos = videos;
    if (req.user) {
      enhancedVideos = videos.map(video => {
        const videoObj = video.toObject();
        videoObj.isLiked = video.isLikedBy(req.user._id);
        return videoObj;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        videos: enhancedVideos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single video
 * @route   GET /api/videos/:id
 * @access  Public
 */
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('userId', 'username profilePicture bio');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      data: {
        video,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like/Unlike video
 * @route   POST /api/videos/:id/like
 * @access  Private
 */
export const toggleLike = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    console.log('Toggling like for video ID:', req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    const userIdString = req.user._id.toString();
    const likeIndex = video.likes.findIndex(
      id => id.toString() === userIdString
    );

    let action;
    if (likeIndex > -1) {
      // Unlike
      video.likes.splice(likeIndex, 1);
      action = 'unliked';
    } else {
      // Like
      video.likes.push(req.user._id);
      action = 'liked';
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: `Video ${action} successfully`,
      data: {
        isLiked: action === 'liked',
        likeCount: video.likes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's videos
 * @route   GET /api/videos/user/:userId
 * @access  Public
 */
export const getUserVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username profilePicture');

    res.status(200).json({
      success: true,
      data: {
        videos,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete video
 * @route   DELETE /api/videos/:id
 * @access  Private
 */
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Check if user owns the video
    if (video.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this video',
      });
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
