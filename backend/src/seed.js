import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';
import Video from './models/Video.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

/**
 * Seed Database with Sample Data
 * Creates test users and sample videos for development/testing
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reelflow');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to preserve data)
    await User.deleteMany({});
    await Video.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const users = [];
    const usernames = ['alice_creator', 'bob_videos', 'charlie_reels', 'diana_shorts', 'emma_clips'];

    for (const username of usernames) {
      const user = await User.create({
        username: username,
        email: `${username}@example.com`,
        password: 'password123', // Will be hashed automatically
        bio: `Hi! I'm ${username.split('_')[0]}, and I love creating short videos!`,
      });
      users.push(user);
      console.log(`👤 Created user: ${username}`);
    }

    // Sample video captions
    const captions = [
      'Check out this amazing sunset! 🌅',
      'Just vibing to my favorite song 🎵',
      'My morning routine in 60 seconds ⏰',
      'Cooking my favorite dish 🍳',
      'Travel diary: Day 1 ✈️',
      'Dance challenge accepted! 💃',
      'Quick workout tips 💪',
      'Beautiful nature walk 🌲',
      'My pet doing funny things 🐕',
      'Late night thoughts 🌙',
      'Art time-lapse 🎨',
      'Coffee making tutorial ☕',
      'City lights at night 🌃',
      'Behind the scenes 🎬',
      'Trying a new hobby 🎯',
    ];

    // Create sample videos (with placeholder URLs)
    const videos = [];
    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomLikes = users.slice(0, Math.floor(Math.random() * users.length));

      const video = await Video.create({
        videoUrl: `/uploads/sample-video-${i + 1}.mp4`, // Placeholder URL
        caption: captions[i],
        userId: randomUser._id,
        likes: randomLikes.map(u => u._id),
        views: Math.floor(Math.random() * 10000) + 100,
        duration: Math.floor(Math.random() * 50) + 10, // 10-60 seconds
      });

      videos.push(video);
      console.log(`🎥 Created video: "${video.caption}" by ${randomUser.username}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Users created: ${users.length}`);
    console.log(`   - Videos created: ${videos.length}`);
    console.log(`\n💡 Test Credentials:`);
    console.log(`   Email: alice_creator@example.com`);
    console.log(`   Password: password123\n`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
