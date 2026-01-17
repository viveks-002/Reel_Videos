import User from '../models/User.js';
import Video from '../models/Video.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's video count
    const videoCount = await Video.countDocuments({ userId: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        videoCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, profilePicture } = req.body;

    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    next(error);
  }
};
