import mongoose from 'mongoose';

/**
 * Video Schema
 * Stores video metadata and relationships
 */
const videoSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [500, 'Caption cannot exceed 500 characters'],
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
videoSchema.index({ createdAt: -1 });
videoSchema.index({ userId: 1 });

/**
 * Virtual field to get like count
 */
videoSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

/**
 * Ensure virtuals are included in JSON
 */
videoSchema.set('toJSON', { virtuals: true });
videoSchema.set('toObject', { virtuals: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
