const mongoose = require('mongoose');
const Chatroom = require('../models/Chatroom');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedChatrooms = async () => {
  try {
    // Clear existing chatrooms
    await Chatroom.deleteMany({});
    console.log('Cleared existing chatrooms');

    // Get a user to be the creator (you might need to adjust this)
    const users = await User.find({});
    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      process.exit(1);
    }

    const creatorId = users[0]._id; // Use first user as creator

    // Hardcoded chatrooms data
    const chatroomsData = [
      {
        name: 'General',
        description: 'General discussion for all students',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: false,
        maxMembers: 100
      },
      {
        name: 'Programming',
        description: 'Discuss programming languages and projects',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: false,
        maxMembers: 50
      },
      {
        name: 'Mathematics',
        description: 'Help with math problems and concepts',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: false,
        maxMembers: 50
      },
      {
        name: 'Science',
        description: 'Physics, Chemistry, Biology discussions',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: false,
        maxMembers: 50
      },
      {
        name: 'Study Group',
        description: 'Collaborative study sessions',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: false,
        maxMembers: 30
      },
      {
        name: 'Gaming',
        description: 'Video games and esports',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: false,
        maxMembers: 50
      },
      {
        name: 'Music',
        description: 'Share and discuss music',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: false,
        maxMembers: 50
      },
      {
        name: 'Private Study',
        description: 'Invite-only study group',
        createdBy: creatorId,
        members: [creatorId],
        isPrivate: true,
        maxMembers: 10
      }
    ];

    // Insert chatrooms
    const chatrooms = await Chatroom.insertMany(chatroomsData);
    console.log(`✅ Successfully seeded ${chatrooms.length} chatrooms:`);
    
    chatrooms.forEach(chatroom => {
      console.log(`   - ${chatroom.name} (${chatroom.description})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding chatrooms:', error);
    process.exit(1);
  }
};

seedChatrooms();