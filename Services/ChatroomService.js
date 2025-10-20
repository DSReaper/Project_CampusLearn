const Chatroom = require('../Model/DatabaseSchemas/NormalTables/ChatRoomsChatSchema');
const Message = require('../Model/DatabaseSchemas/NormalTables/Message');

class ChatroomService {
  // Create a new chatroom
  async createChatroom(chatroomData) {
    try {
      const chatroom = new Chatroom(chatroomData);
      // Add creator as a member
      chatroom.members.push(chatroomData.createdBy);
      return await chatroom.save();
    } catch (error) {
      throw error;
    }
  }

  // Get all chatrooms for a user
  async getUserChatrooms(userId) {
    try {
      return await Chatroom.find({
        $or: [
          { isPrivate: false },
          { members: userId }
        ]
      }).populate('createdBy', 'username')
        .populate('members', 'username');
    } catch (error) {
      throw error;
    }
  }

  // Join a chatroom
  async joinChatroom(chatroomId, userId) {
    try {
      const chatroom = await Chatroom.findById(chatroomId);
      
      if (!chatroom) {
        throw new Error('Chatroom not found');
      }

      if (chatroom.members.includes(userId)) {
        throw new Error('User already in chatroom');
      }

      if (chatroom.members.length >= chatroom.maxMembers) {
        throw new Error('Chatroom is full');
      }

      chatroom.members.push(userId);
      return await chatroom.save();
    } catch (error) {
      throw error;
    }
  }

  // Get chatroom messages with pagination
  async getChatroomMessages(chatroomId, page = 1, limit = 50) {
    try {
      const messages = await Message.find({ chatroom: chatroomId })
        .populate('sender', 'username')
        .populate('repliedTo')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Message.countDocuments({ chatroom: chatroomId });

      return {
        messages: messages.reverse(), // Show oldest first
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalMessages: total
      };
    } catch (error) {
      throw error;
    }
  }

  // Send a message
  async sendMessage(messageData) {
    try {
      const message = new Message(messageData);
      return await message.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatroomService();